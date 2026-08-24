import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Scissors,
  Check,
  X,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  LogOut,
  AlertCircle,
  CheckCheck,
  ShoppingCart,
  Award,
  Users,
  Sparkles,
  Send,
  Filter,
  Image as ImageIcon,
  Database,
} from 'lucide-react';
import { Booking, CancelReason, Barber, CustomerSubscription, CustomerProfile, Comanda, Plan } from '../types';
import { CANCEL_REASONS, ADDRESS } from '../data/services';
import {
  getBookings,
  saveBookings,
  getCompletedBookings,
  addCompletedBooking,
  saveCompletedBookings,
  ADMIN_REMEMBER_KEY,
  addBooking,
  getBarbers,
  saveBarbers,
  getSubscriptions,
  saveSubscriptions,
  getCustomerProfiles,
  saveCustomerProfiles,
  getComandas,
  getPlans,
  savePlans,
  getServices,
  saveServices,
} from '../utils/storage';
import { buildWhatsAppLink, formatPhoneMask } from '../utils/whatsapp';

// Modular Components
import { ComandaModal } from '../components/admin/ComandaModal';
import { FinanceDashboard } from '../components/admin/FinanceDashboard';
import { CrmManager } from '../components/admin/CrmManager';
import { BarbersManager } from '../components/admin/BarbersManager';
import { VerticalScheduleView } from '../components/admin/VerticalScheduleView';
import { InventoryManager } from '../components/admin/InventoryManager';
import { ExpensesManager } from '../components/admin/ExpensesManager';
import { GalleryManager } from '../components/admin/GalleryManager';
import { ServicesManager } from '../components/admin/ServicesManager';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [loggedInBarber, setLoggedInBarber] = useState<Barber | null>(null);

  // Tab State & View Mode
  const [activeTab, setActiveTab] = useState<'bookings' | 'finance' | 'inventory' | 'expenses' | 'crm' | 'team' | 'services' | 'gallery' | 'add'>('bookings');
  const [agendaViewMode, setAgendaViewMode] = useState<'timeline' | 'cards'>('timeline');

  // Domain Data States
  const [services, setServices] = useState(getServices());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [profiles, setProfiles] = useState<CustomerProfile[]>([]);
  const [comandas, setComandas] = useState<Comanda[]>([]);

  // Filter Agenda by Barber
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');

  // Modals
  const [comandaBooking, setComandaBooking] = useState<Booking | null>(null);
  const [isComandaModalOpen, setIsComandaModalOpen] = useState(false);

  // Cancel Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [selectedCancelReason, setSelectedCancelReason] =
    useState<CancelReason>('Horário não disponível');

  // Add Manual Booking Form State
  const [addService, setAddService] = useState<string>('');
  const [addPrice, setAddPrice] = useState<string>('');
  const [addName, setAddName] = useState<string>('');
  const [addPhone, setAddPhone] = useState<string>('');
  const [addDate, setAddDate] = useState<string>('');
  const [addTime, setAddTime] = useState<string>('');
  const [addBarberId, setAddBarberId] = useState<string>('b1');
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem(ADMIN_REMEMBER_KEY) === 'true') {
      setIsAuthenticated(true);
    }
    refreshData();
  }, []);

  const refreshData = () => {
    setBookings(getBookings());
    setCompletedBookings(getCompletedBookings());
    const bList = getBarbers();
    setBarbers(bList);
    setProfiles(getCustomerProfiles());
    setComandas(getComandas());
  };

  const handleLogin = () => {
    const bList = getBarbers();
    const cleanPass = password.trim().toLowerCase();
    const masterPasswords = ['galdino', 'renata', 'admin', '1234', 'dona', 'barbearia', 'master'];
    
    // Check if password matches master or barber PIN
    if (masterPasswords.includes(cleanPass)) {
      setIsAuthenticated(true);
      setLoggedInBarber(null); // Master access
      setPassword('');
      setLoginError(false);
      if (rememberMe) {
        localStorage.setItem(ADMIN_REMEMBER_KEY, 'true');
      }
    } else {
      const foundBarber = bList.find((b) => b.pinCode === password || b.pinCode === cleanPass);
      if (foundBarber) {
        setIsAuthenticated(true);
        setLoggedInBarber(foundBarber);
        setPassword('');
        setLoginError(false);
      } else {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 2000);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInBarber(null);
    localStorage.removeItem(ADMIN_REMEMBER_KEY);
  };

  // Filter Bookings by Barber & Access Role
  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (loggedInBarber) {
      list = list.filter((b) => b.barberId === loggedInBarber.id);
    } else if (selectedBarberFilter !== 'all') {
      list = list.filter((b) => b.barberId === selectedBarberFilter);
    }
    return list;
  }, [bookings, loggedInBarber, selectedBarberFilter]);

  // Accept Appointment
  const handleAcceptBooking = (b: Booking) => {
    const message = `✂️ *BARBEARIA SEU GALDINO* ✂️
Olá *${b.name}*! 👋
Seu agendamento foi *CONFIRMADO* com sucesso! ✅

📋 *Serviço:* ${b.service}
💈 *Barbeiro:* ${b.barberName || 'Dona Renata'}
💰 *Valor:* ${b.paidByPlan ? 'INCLUSO NO PLANO VIP' : `R$ ${b.price},00`}
📅 *Data:* ${b.date}
🕐 *Horário:* ${b.time}
📍 *Endereço:* ${ADDRESS}

Estamos te esperando! 💈
Até lá! 🤝`;

    if (b.phone) {
      window.open(buildWhatsAppLink(b.phone, message), '_blank');
    }

    const updated = bookings.map((item) =>
      item.id === b.id ? { ...item, status: 'accepted' as const } : item
    );
    saveBookings(updated);
    setBookings(updated);
  };

  // Send 24h Reminder
  const handleSend24hReminder = (b: Booking) => {
    const message = `✂️ *LEMBRETE SEU GALDINO* ✂️
Olá *${b.name}*! Passando para confirmar seu agendamento de amanhã:

🗓️ *Data:* ${b.date} às *${b.time}*
💈 *Profissional:* ${b.barberName || 'Dona Renata'}
📋 *Serviço:* ${b.service}
📍 *Endereço:* ${ADDRESS}

Te esperamos! Para confirmar ou reagendar, basta responder a este WhatsApp. 💈`;

    window.open(buildWhatsAppLink(b.phone, message), '_blank');
  };

  // Open Comanda Closing Modal for Booking
  const handleOpenComanda = (b: Booking) => {
    setComandaBooking(b);
    setIsComandaModalOpen(true);
  };

  // Confirm Cancel
  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const b = cancelModalBooking;
    const message = `✂️ *BARBEARIA SEU GALDINO* ✂️
Olá *${b.name}*! 👋
Infelizmente não poderemos atender seu agendamento. 😔

📋 *Serviço:* ${b.service}
📅 *Data:* ${b.date}
🕐 *Horário:* ${b.time}
❌ *Motivo:* ${selectedCancelReason}

Por favor, escolha outro horário disponível no nosso site. Desculpe pelo inconveniente! 🙏
Estamos à disposição! 💈`;

    if (b.phone) {
      window.open(buildWhatsAppLink(b.phone, message), '_blank');
    }

    const remaining = bookings.filter((item) => item.id !== b.id);
    saveBookings(remaining);
    setBookings(remaining);
    setCancelModalBooking(null);
  };

  // Submit Manual Booking
  const handleSubmitManualBooking = () => {
    if (!addService || !addPrice || !addName || !addDate || !addTime) return;

    const bBarber = barbers.find((b) => b.id === addBarberId) || barbers[0];

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      service: addService,
      price: Number(addPrice),
      date: addDate,
      time: addTime,
      name: addName,
      phone: addPhone.replace(/\D/g, ''),
      status: 'pending',
      barberId: bBarber.id,
      barberName: bBarber.name,
    };

    addBooking(newBooking);
    refreshData();

    setAddService('');
    setAddPrice('');
    setAddName('');
    setAddPhone('');
    setAddDate('');
    setAddTime('');
    setAddSuccess(true);
    setActiveTab('bookings');
    setTimeout(() => setAddSuccess(false), 2500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_30px_-5px_hsl(45_97%_54%/0.3)]">
              <Shield className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Gerente Virtual</h1>
            <p className="text-sm text-muted-foreground mt-1">Barbearia Dona Renata</p>
          </div>

          <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_50px_-15px_rgba(0,0,0,0.5)]">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block">
                  Senha ou PIN do Barbeiro
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className={`w-full bg-background/50 border ${
                    loginError ? 'border-destructive' : 'border-primary/10 focus:border-primary/40'
                  } p-4 rounded-xl outline-none transition-all text-foreground placeholder:text-muted-foreground/40 font-mono`}
                />
                {loginError && (
                  <p className="text-destructive text-xs mt-2 animate-pulse">Senha/PIN incorreto</p>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-md border border-primary/20 bg-background/50 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center text-primary-foreground">
                  {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Lembrar-me neste dispositivo
                </span>
              </label>

              <button
                onClick={handleLogin}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-primary/90 active:scale-95 text-base cursor-pointer shadow-md"
              >
                Acessar Gerente Virtual
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors text-center block cursor-pointer"
              >
                ← Voltar para o site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/80 backdrop-blur-xl rounded-2xl sticky top-0 z-20 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Barbearia Dona Renata</h1>
                <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/30">
                  GERENTE VIRTUAL
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {loggedInBarber
                  ? `Logado como Barbeiro: ${loggedInBarber.name}`
                  : 'Acesso Mestre / Proprietário Geral'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              Ver Site
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border pb-3 space-y-3">
          {/* Mobile Select Dropdown for direct access on small screens */}
          <div className="block md:hidden">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Navegar pelo Painel:
            </label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full bg-secondary border border-border text-foreground font-bold text-sm rounded-xl px-3 py-2.5 outline-none focus:border-primary"
            >
              <option value="bookings">📅 Agenda Sem Caderninho ({bookings.length})</option>
              {!loggedInBarber && (
                <>
                  <option value="finance">💰 Financeiro</option>
                  <option value="inventory">🛒 Estoque & Produtos</option>
                  <option value="expenses">💸 Despesas (Caixa)</option>
                  <option value="gallery">🖼️ Galeria de Fotos</option>
                  <option value="services">✂️ Serviços</option>
                  <option value="crm">👥 CRM & Ficha Técnica</option>
                  <option value="team">🎖️ Barbeiros & Comissões</option>
                </>
              )}
              <option value="add">➕ + Agendamento</option>
            </select>
          </div>

          {/* Horizontal Scrollable Tabs for touch and desktop */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto touch-pan-x w-full py-1 no-scrollbar scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Calendar className="w-4 h-4" /> Agenda ({bookings.length})
              </button>

              {!loggedInBarber && (
                <>
                  <button
                    onClick={() => setActiveTab('finance')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'finance'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" /> Financeiro
                  </button>

                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'inventory'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" /> Estoque
                  </button>

                  <button
                    onClick={() => setActiveTab('expenses')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'expenses'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-destructive" /> Despesas
                  </button>

                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'gallery'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Galeria
                  </button>

                  <button
                    onClick={() => setActiveTab('services')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'services'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Scissors className="w-4 h-4" /> Serviços
                  </button>

                  <button
                    onClick={() => setActiveTab('crm')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'crm'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Users className="w-4 h-4" /> CRM
                  </button>

                  <button
                    onClick={() => setActiveTab('team')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'team'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Award className="w-4 h-4" /> Barbeiros
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTab('add')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'add'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Plus className="w-4 h-4" /> + Agendamento
              </button>
            </div>

            {activeTab === 'bookings' && (
              <div className="flex items-center bg-secondary p-1 rounded-xl border border-border shrink-0">
                <button
                  onClick={() => setAgendaViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    agendaViewMode === 'timeline' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Modo 30min
                </button>
                <button
                  onClick={() => setAgendaViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    agendaViewMode === 'cards' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Cards
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: AGENDA MASTER */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {agendaViewMode === 'timeline' ? (
              <VerticalScheduleView
                bookings={filteredBookings}
                barbers={barbers}
                profiles={profiles}
                onAcceptBooking={handleAcceptBooking}
                onOpenComanda={handleOpenComanda}
                onSendReminder={handleSend24hReminder}
                onCancelBooking={(b) => setCancelModalBooking(b)}
                onAddQuickBooking={(time, barberId) => {
                  setAddTime(time);
                  setAddBarberId(barberId);
                  setActiveTab('add');
                }}
              />
            ) : (
              <>
                {/* Filter Bar by Barber */}
                {!loggedInBarber && (
                  <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Filter className="w-4 h-4 text-primary" /> Filtrar Agenda por Profissional:
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedBarberFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedBarberFilter === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Todos ({bookings.length})
                      </button>
                      {barbers.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBarberFilter(b.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedBarberFilter === b.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {b.name} ({bookings.filter((item) => item.barberId === b.id).length})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBookings.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground bg-card rounded-3xl border border-border">
                      <Scissors className="w-12 h-12 mx-auto text-primary/40 mb-3" />
                      <p className="font-bold text-base text-foreground">Nenhum agendamento encontrado</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agendamentos realizados no site ou adicionados manualmente aparecerão aqui.
                      </p>
                    </div>
                  ) : (
                    filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-card border border-border card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-extrabold text-primary flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {b.date} às {b.time}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                b.status === 'accepted'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {b.status === 'accepted' ? 'Confirmado' : 'Pendente'}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-base text-foreground">{b.name}</h4>
                          <p className="text-xs text-muted-foreground">{b.phone}</p>

                          <div className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border space-y-1 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Serviço:</span>
                              <strong className="text-foreground">{b.service}</strong>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Barbeiro:</span>
                              <strong className="text-primary">{b.barberName || 'Dona Renata'}</strong>
                            </div>
                            <div className="flex justify-between text-foreground font-bold pt-1 border-t border-border/50">
                              <span>Valor:</span>
                              {b.paidByPlan ? (
                                <span className="text-emerald-400 font-extrabold">Plano VIP (R$ 0)</span>
                              ) : (
                                <span className="text-primary">R$ {b.price},00</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-2 border-t border-border">
                          <div className="flex gap-2">
                            {b.status === 'pending' && (
                              <button
                                onClick={() => handleAcceptBooking(b)}
                                className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Confirmar WA
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenComanda(b)}
                              className="flex-1 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs transition-all hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_10px_-2px_hsl(45_97%_54%/0.4)]"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Fechar Comanda
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSend24hReminder(b)}
                              className="flex-1 py-1.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-[11px] rounded-xl cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Send className="w-3 h-3 text-primary" /> Lembrete 24h
                            </button>

                            <button
                              onClick={() => setCancelModalBooking(b)}
                              className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 font-bold text-[11px] rounded-xl cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: FINANCIAL DASHBOARD */}
        {activeTab === 'finance' && !loggedInBarber && (
          <FinanceDashboard
            bookings={bookings}
            completedBookings={completedBookings}
            comandas={comandas}
            barbers={barbers}
          />
        )}

        {/* TAB 2.1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && !loggedInBarber && (
          <InventoryManager />
        )}

        {/* TAB 2.2: EXPENSES MANAGEMENT */}
        {activeTab === 'expenses' && !loggedInBarber && (
          <ExpensesManager />
        )}

        {/* TAB: SERVICES */}
        {activeTab === 'services' && !loggedInBarber && (
          <ServicesManager
            services={services}
            onSaveServices={(s) => {
              saveServices(s);
              setServices(s);
            }}
          />
        )}


        {/* TAB: GALLERY */}
        {activeTab === 'gallery' && !loggedInBarber && (
          <GalleryManager />
        )}

        {/* TAB 4: CRM & FICHA TÉCNICA */}
        {activeTab === 'crm' && !loggedInBarber && (
          <CrmManager
            profiles={profiles}
            onSaveProfiles={(p) => {
              saveCustomerProfiles(p);
              setProfiles(p);
            }}
          />
        )}

        {/* TAB 5: TEAM & BARBERS MANAGEMENT */}
        {activeTab === 'team' && !loggedInBarber && (
          <BarbersManager
            barbers={barbers}
            onSaveBarbers={(b) => {
              saveBarbers(b);
              setBarbers(b);
            }}
          />
        )}

        {/* TAB 6: MANUAL AGENDAMENTO */}
        {activeTab === 'add' && (
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-xl mx-auto card-shadow space-y-6">
            <h3 className="text-xl font-bold text-foreground">Novo Agendamento Manual</h3>

            {addSuccess && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" /> Agendamento adicionado à agenda com sucesso!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  Serviço
                </label>
                <select
                  value={addService}
                  onChange={(e) => {
                    setAddService(e.target.value);
                    const f = services.find((s) => s.name === e.target.value);
                    if (f) setAddPrice(String(f.price));
                  }}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none font-bold"
                >
                  <option value="">Selecione um serviço...</option>
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} - R$ {s.price},00
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  Barbeiro
                </label>
                <select
                  value={addBarberId}
                  onChange={(e) => setAddBarberId(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none font-bold"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(formatPhoneMask(e.target.value))}
                  placeholder="(84) 99999-9999"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                    Data (dd/mm/aaaa)
                  </label>
                  <input
                    type="text"
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    placeholder="11/08/2026"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                    Horário (HH:mm)
                  </label>
                  <input
                    type="text"
                    value={addTime}
                    onChange={(e) => setAddTime(e.target.value)}
                    placeholder="14:00"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitManualBooking}
                disabled={!addService || !addName || !addDate || !addTime}
                className="w-full py-3.5 bg-primary text-primary-foreground font-extrabold rounded-xl text-sm transition-all hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_-5px_hsl(45_97%_54%/0.4)]"
              >
                Salvar Agendamento Manual
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Comanda Modal */}
      <ComandaModal
        isOpen={isComandaModalOpen}
        booking={comandaBooking}
        barbers={barbers}
        onClose={() => {
          setIsComandaModalOpen(false);
          setComandaBooking(null);
        }}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* Cancel Booking Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">Cancelar Agendamento</h3>
            <p className="text-xs text-muted-foreground">
              Selecione o motivo do cancelamento para avisar <strong>{cancelModalBooking.name}</strong> via WhatsApp:
            </p>

            <select
              value={selectedCancelReason}
              onChange={(e) => setSelectedCancelReason(e.target.value as CancelReason)}
              className="w-full bg-secondary border border-border rounded-xl p-3 text-xs text-foreground outline-none font-bold"
            >
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-destructive text-white font-extrabold text-xs"
              >
                Confirmar & Notificar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
