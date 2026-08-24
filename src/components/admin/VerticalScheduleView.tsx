import React, { useState, useMemo } from 'react';
import { Clock, Calendar, User, Scissors, Check, ShoppingCart, Plus, AlertCircle, Phone, Send, Sparkles } from 'lucide-react';
import { Booking, Barber, CustomerProfile } from '../../types';
import { formatPhoneMask, buildWhatsAppLink } from '../../utils/whatsapp';

interface VerticalScheduleViewProps {
  bookings: Booking[];
  barbers: Barber[];
  profiles: CustomerProfile[];
  onAcceptBooking: (b: Booking) => void;
  onOpenComanda: (b: Booking) => void;
  onSendReminder: (b: Booking) => void;
  onCancelBooking: (b: Booking) => void;
  onAddQuickBooking: (time: string, barberId: string) => void;
}

export const VerticalScheduleView: React.FC<VerticalScheduleViewProps> = ({
  bookings,
  barbers,
  profiles,
  onAcceptBooking,
  onOpenComanda,
  onSendReminder,
  onCancelBooking,
  onAddQuickBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });

  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');

  // Generate 30-min time slots from 08:00 to 20:00
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      const hStr = String(hour).padStart(2, '0');
      slots.push(`${hStr}:00`);
      if (hour < 20) {
        slots.push(`${hStr}:30`);
      }
    }
    return slots;
  }, []);

  // Filtered bookings for the selected date and barber
  const dayBookings = useMemo(() => {
    return bookings.filter((b) => {
      const dateMatch = b.date === selectedDate || !b.date;
      const barberMatch = selectedBarberId === 'all' || b.barberId === selectedBarberId;
      return dateMatch && barberMatch;
    });
  }, [bookings, selectedDate, selectedBarberId]);

  // Map bookings to time slot
  const bookingsBySlot = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    timeSlots.forEach((slot) => {
      map[slot] = [];
    });

    dayBookings.forEach((b) => {
      if (map[b.time]) {
        map[b.time].push(b);
      } else {
        // Fallback or exact slot match
        const slotKey = timeSlots.find((s) => s === b.time) || b.time;
        if (!map[slotKey]) map[slotKey] = [];
        map[slotKey].push(b);
      }
    });

    return map;
  }, [timeSlots, dayBookings]);

  return (
    <div className="space-y-6">
      {/* Date & Barber Barber Filter Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Data da Agenda:</label>
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="dd/mm/aaaa"
              className="bg-secondary border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary w-32"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-muted-foreground uppercase">Barbeiro:</span>
          <button
            onClick={() => setSelectedBarberId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedBarberId === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos os Profissionais
          </button>
          {barbers.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBarberId(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBarberId === b.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Schedule */}
      <div className="bg-card border border-border rounded-3xl p-4 md:p-6 card-shadow space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Agenda em Blocos (30 em 30 min)
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            {dayBookings.length} Atendimento(s) em {selectedDate}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {timeSlots.map((slot) => {
            const slotItems = bookingsBySlot[slot] || [];
            const hasFitIn = slotItems.length > 1;

            return (
              <div
                key={slot}
                className={`p-3 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center gap-3 ${
                  slotItems.length > 0
                    ? hasFitIn
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-secondary/40 border-primary/20'
                    : 'bg-secondary/10 border-border/40 hover:bg-secondary/20'
                }`}
              >
                {/* Slot Hour Badge */}
                <div className="flex items-center gap-2 shrink-0 md:w-28">
                  <div className="px-3 py-1.5 rounded-xl bg-background border border-primary/20 text-primary font-mono font-extrabold text-xs shadow-sm">
                    {slot}
                  </div>
                  {hasFitIn && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-black animate-pulse">
                      Encaixe DUPLO
                    </span>
                  )}
                </div>

                {/* Slot Content */}
                <div className="flex-1 space-y-2">
                  {slotItems.length === 0 ? (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs text-muted-foreground/60 italic">Horário livre na agenda</span>
                      <button
                        onClick={() => onAddQuickBooking(slot, selectedBarberId === 'all' ? barbers[0]?.id || 'b1' : selectedBarberId)}
                        className="px-2.5 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-[11px] cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Encaixar Cliente
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {slotItems.map((b) => {
                        // Check technical note from profile
                        const profile = profiles.find((p) => p.phone && b.phone && p.phone.replace(/\D/g, '') === b.phone.replace(/\D/g, ''));

                        return (
                          <div
                            key={b.id}
                            className={`p-3.5 rounded-xl bg-card border ${
                              b.paidByPlan ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border'
                            } flex flex-col justify-between space-y-3 shadow-md`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-extrabold text-foreground">{b.name}</span>
                                <div className="flex items-center gap-1">
                                  {b.paidByPlan && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
                                      Plano Ativo
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      b.status === 'accepted'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/20 text-amber-400'
                                    }`}
                                  >
                                    {b.status === 'accepted' ? 'Confirmado' : 'Pendente'}
                                  </span>
                                </div>
                              </div>

                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Scissors className="w-3 h-3 text-primary" /> {b.service} •{' '}
                                <strong className="text-foreground">{b.barberName || 'Dona Renata'}</strong>
                              </p>

                              {/* Ficha Técnica Nota em Destaque */}
                              {profile?.technicalNote && (
                                <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20 text-[11px] text-primary font-medium flex items-start gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Ficha do Barbeiro:</strong> "{profile.technicalNote}"
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Card Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                              <button
                                onClick={() => onOpenComanda(b)}
                                className="flex-1 py-1.5 bg-primary text-primary-foreground font-extrabold text-[11px] rounded-lg hover:bg-primary/90 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <ShoppingCart className="w-3 h-3" /> Fechar Comanda
                              </button>
                              <button
                                onClick={() => onSendReminder(b)}
                                className="p-1.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-lg text-[11px] font-bold cursor-pointer"
                                title="Enviar Lembrete WA"
                              >
                                <Send className="w-3.5 h-3.5 text-primary" />
                              </button>
                              <button
                                onClick={() => onCancelBooking(b)}
                                className="px-2 py-1 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
