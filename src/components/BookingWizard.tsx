import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Calendar, Clock, User, Phone, Check, ChevronLeft } from 'lucide-react';
import { Service, Barber } from '../types';
import { BARBERSHOP_PHONE, BARBERS } from '../data/services';
import {
  addBooking,
  getBookings,
  addOrUpdateCustomerProfile,
  getServices,
} from '../utils/storage';
import {
  buildWhatsAppLink,
  formatPhoneMask,
  formatDateBr,
  getTimeSlotsForDate,
} from '../utils/whatsapp';

export const BookingWizard: React.FC = () => {
  const SERVICES = useMemo(() => getServices(), []);
  const [step, setStep] = useState<number>(1);
  const [primaryService, setPrimaryService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(BARBERS[0]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Available upcoming dates (next 14 days, excluding Sundays)
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) {
        // Exclude Sunday
        dates.push(d);
      }
    }
    return dates;
  }, []);

  // Available time slots for the chosen date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlotsForDate(selectedDate);
  }, [selectedDate]);

  // Booked slots for selected date
  const bookedSlotsSet = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    const dateStr = formatDateBr(selectedDate);
    const bookings = getBookings();
    const taken = bookings
      .filter((b) => b.date === dateStr && b.status !== 'completed' && (!selectedBarber || b.barberId === selectedBarber.id))
      .map((b) => b.time);
    return new Set(taken);
  }, [selectedDate, selectedBarber, step]);

  // Combined services string name
  const combinedServicesTitle = useMemo(() => {
    if (!primaryService) return '';
    const addonNames = selectedAddons.map((a) => a.name);
    return [primaryService.name, ...addonNames].join(' + ');
  }, [primaryService, selectedAddons]);

  // Total price calculation
  const totalPrice = useMemo(() => {
    if (!primaryService) return 0;
    const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
    return primaryService.price + addonsTotal;
  }, [primaryService, selectedAddons]);

  // Filter possible add-ons (excluding selected primary and incompatible full cuts)
  const excludedFromAddons = ['Corte Social', 'Corte na Tesoura', 'Degradê'];
  const availableAddons = useMemo(() => {
    if (!primaryService) return [];
    return SERVICES.filter(
      (s) =>
        s.name !== primaryService.name &&
        !s.name.includes('+') &&
        !excludedFromAddons.includes(s.name)
    );
  }, [primaryService]);

  const handleSelectPrimaryService = (service: Service) => {
    setPrimaryService(service);
    setSelectedAddons([]);
    setStep(1.5);
  };

  const handleToggleAddon = (service: Service) => {
    setSelectedAddons((prev) =>
      prev.find((s) => s.name === service.name)
        ? prev.filter((s) => s.name !== service.name)
        : [...prev, service]
    );
  };

  const handleConfirmServices = () => {
    setStep(1.8); // Choose Barber
  };

  const handleSelectBarber = (barber: Barber | null) => {
    setSelectedBarber(barber);
    setStep(2); // Choose Date
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep(3);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBack = () => {
    if (step === 1.5) {
      setStep(1);
      setSelectedAddons([]);
    } else if (step === 1.8) {
      setStep(1.5);
    } else if (step === 2) {
      setStep(1.8);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleSubmitBooking = () => {
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !primaryService ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    const dateStr = formatDateBr(selectedDate);

    // Auto-update CRM Profile
    addOrUpdateCustomerProfile({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      lastVisit: dateStr,
    });

    const newBooking = {
      id: crypto.randomUUID(),
      service: combinedServicesTitle,
      price: totalPrice,
      date: dateStr,
      time: selectedTime,
      name: customerName.trim(),
      phone: customerPhone.trim(),
      status: 'pending' as const,
      barberId: selectedBarber ? selectedBarber.id : 'b1',
      barberName: selectedBarber ? selectedBarber.name : 'Dona Renata',
    };

    addBooking(newBooking);

    const message = `✂️ *A TRADICIONAL BARBEARIA* ✂️
Olá ${newBooking.barberName}! 💈
Meu nome é *${newBooking.name}*.
Gostaria de confirmar meu agendamento:

📋 *Serviço:* ${newBooking.service}
💈 *Barbeiro:* ${newBooking.barberName}
💰 *Valor:* R$ ${newBooking.price},00
📅 *Data:* ${newBooking.date}
🕐 *Horário:* ${newBooking.time}
📱 *Meu WhatsApp:* ${newBooking.phone}

⏳ Aguardo sua confirmação!
Obrigado! 🙏`;

    const targetPhone = selectedBarber ? selectedBarber.phone : BARBERSHOP_PHONE;
    const waLink = buildWhatsAppLink(targetPhone, message);
    window.location.href = waLink;

    setShowSuccessModal(true);
    setStep(1);
    setPrimaryService(null);
    setSelectedAddons([]);
    setSelectedDate(undefined);
    setSelectedTime('');
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <section id="agendar" className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Agende seu horário
        </h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Escolha o serviço e o melhor momento para o seu visual.
        </p>
      </div>

      {/* Wizard Card */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 card-shadow relative overflow-hidden">
        {/* Step Header Indicator */}
        <div className="flex justify-center mb-10 mt-4 relative">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="absolute left-0 top-1 p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer"
              title="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-6 sm:gap-16">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 || step === 1.5 || step === 1.8 ? 'bg-[#ffc107] text-black shadow-lg shadow-[#ffc107]/20' : 'bg-secondary text-muted-foreground'}`}>1</div>
              <span className="text-xs text-muted-foreground font-medium">Serviço</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-[#ffc107] text-black shadow-lg shadow-[#ffc107]/20' : step > 2 ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>2</div>
              <span className="text-xs text-muted-foreground font-medium">Data</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step === 3 ? 'bg-[#ffc107] text-black shadow-lg shadow-[#ffc107]/20' : step > 3 ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>3</div>
              <span className="text-xs text-muted-foreground font-medium">Horário</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step === 4 ? 'bg-[#ffc107] text-black shadow-lg shadow-[#ffc107]/20' : 'bg-secondary text-muted-foreground'}`}>4</div>
              <span className="text-xs text-muted-foreground font-medium">Dados</span>
            </div>
          </div>
        </div>
           {/* STEP 1: Primary Services */}
        {step === 1 && (
          <div className="flex flex-col items-center w-full">
            <div
              className="w-full flex gap-4 overflow-x-auto pb-6 pt-2 px-2 no-scrollbar snap-x snap-mandatory"
            >
              {SERVICES.map((service) => (
                <motion.div
                  key={service.id || service.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPrimaryService(service)}
                  className="relative shrink-0 snap-center w-[240px] md:w-[260px] h-[320px] md:h-[360px] rounded-3xl cursor-pointer overflow-hidden group shadow-lg border border-border/30 hover:border-primary/50 transition-all duration-300"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Content at bottom left */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col items-start text-left z-10">
                    <h4 className="font-extrabold text-2xl text-white mb-0.5 group-hover:text-primary transition-colors leading-tight">
                      {service.name}
                    </h4>
                    <span className="text-gray-300 text-sm font-medium mb-3">
                      {service.time} min
                    </span>
                    <span className="font-black text-xl flex items-center gap-1.5 text-primary">
                      <span>R$</span> <span>{service.price}</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Arraste para o lado hint */}
            <div className="flex items-center gap-4 w-full max-w-xl mt-3 opacity-50 px-2">
              <div className="h-px bg-foreground/20 flex-1"></div>
              <span className="text-xs text-foreground/70 whitespace-nowrap">← Arraste para o lado →</span>
              <div className="h-px bg-foreground/20 flex-1"></div>
            </div>
          </div>
        )}

        {/* STEP 1.5: Optional Addons */}
        {step === 1.5 && primaryService && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scissors className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Serviço Principal</p>
                  <p className="font-bold text-foreground">{primaryService.name}</p>
                </div>
              </div>
              <span className="font-bold text-primary text-lg">R$ {primaryService.price},00</span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione serviços adicionais se desejar:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableAddons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.name === addon.name);
                  return (
                    <div
                      key={addon.name}
                      onClick={() => handleToggleAddon(addon)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary/20 border-primary text-foreground'
                          : 'bg-secondary/40 border-border/60 hover:border-border text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{addon.name}</p>
                          <p className="text-xs text-muted-foreground">+{addon.time} min</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary text-sm">+R$ {addon.price},00</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Total Selecionado</p>
                <p className="text-2xl font-bold text-primary">R$ {totalPrice},00</p>
              </div>
              <button
                onClick={handleConfirmServices}
                className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-primary/90 active:scale-95 cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* STEP 1.8: Choose Barber */}
        {step === 1.8 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Com qual profissional você gostaria de cortar?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BARBERS.map((barber) => {
                const isSelected = selectedBarber?.id === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => handleSelectBarber(barber)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_-5px_hsl(45_97%_54%/0.3)]'
                        : 'bg-secondary/50 border-border/60 hover:border-primary/50'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/40 shrink-0">
                      {barber.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-foreground">{barber.name}</h4>
                      <p className="text-xs text-primary font-semibold">
                        {barber.role === 'master' ? 'Mestre Barbeiro' : 'Profissional Especialista'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Choose Date */}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {availableDates.map((date) => {
              const dayName = date
                .toLocaleDateString('pt-BR', { weekday: 'short' })
                .replace('.', '');
              const formattedDate = formatDateBr(date);

              return (
                <motion.button
                  key={formattedDate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectDate(date)}
                  className="p-5 rounded-2xl bg-secondary/50 border border-border/60 hover:border-primary/50 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-xs font-bold uppercase text-primary tracking-wider">
                    {dayName}
                  </span>
                  <span className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {date.getDate()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* STEP 3: Choose Time */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Horários disponíveis para{' '}
              <strong className="text-foreground">
                {selectedDate && formatDateBr(selectedDate)}
              </strong>
              {selectedBarber ? ` com ${selectedBarber.name}` : ''}:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {timeSlots.map((time) => {
                const isBooked = bookedSlotsSet.has(time);

                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => handleSelectTime(time)}
                    className={`py-3.5 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isBooked
                        ? 'bg-muted/30 border-border/30 text-muted-foreground/40 cursor-not-allowed opacity-50 line-through'
                        : 'bg-secondary/50 border-border/60 hover:border-primary text-foreground hover:text-primary active:scale-95'
                    }`}
                  >
                    <span>{time}</span>
                    {isBooked && (
                      <span className="text-[10px] no-underline text-destructive font-normal mt-0.5">
                        Ocupado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Confirm Data */}
        {step === 4 && (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* Booking Summary Box */}
            <div className="p-5 rounded-2xl bg-secondary/60 border border-border/80 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Serviço(s)</span>
                <span className="font-bold text-foreground text-right">{combinedServicesTitle}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Barbeiro</span>
                <span className="font-bold text-foreground">{selectedBarber ? selectedBarber.name : 'Dona Renata'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Data e Horário</span>
                <span className="font-bold text-primary">
                  {selectedDate && formatDateBr(selectedDate)} às {selectedTime}
                </span>
              </div>
              <div className="flex justify-between items-center text-base pt-1">
                <span className="font-bold text-foreground">Valor</span>
                <span className="font-extrabold text-primary text-xl">R$ {totalPrice},00</span>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-3.5 focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  WhatsApp (para envio do comprovante e confirmação)
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(formatPhoneMask(e.target.value))}
                    placeholder="(84) 99999-9999"
                    maxLength={15}
                    className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-3.5 focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitBooking}
                disabled={!customerName.trim() || !customerPhone.trim()}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-primary/90 active:scale-95 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_hsl(45_97%_54%/0.4)]"
              >
                Finalizar Agendamento
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-8 rounded-3xl card-shadow w-full max-w-sm border border-border text-center relative"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
              <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Agendamento Realizado!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Seu agendamento foi enviado com sucesso. Aguarde a confirmação do barbeiro pelo WhatsApp.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

