export interface Service {
  id?: string;
  name: string;
  time: number; // in minutes
  price: number; // in BRL
  image: string;
}

export interface Barber {
  id: string;
  name: string;
  phone: string;
  photo: string;
  commissionServicePercent: number; // e.g., 50%
  commissionProductPercent: number; // e.g., 10%
  role: 'master' | 'barber';
  pinCode: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number; // e.g. 3
  category: 'Pomada' | 'Óleo/Barba' | 'Shampoo' | 'Bebida' | 'Tratamento' | 'Outros';
  supplier?: string;
  image?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'sale' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  author: string;
  createdAt: string; // dd/MM/yyyy HH:mm
}

export interface Expense {
  id: string;
  description: string;
  category: 'Aluguel' | 'Água/Luz/Internet' | 'Insumos/Produtos' | 'Manutenção' | 'Taxas de Cartão' | 'Outros';
  type: 'Fixa' | 'Variável';
  amount: number;
  dueDate: string; // dd/MM/yyyy
  paymentDate?: string;
  status: 'pending' | 'paid';
  recipient?: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  cutsPerMonth: number; // -1 for unlimited
  description: string;
}

export interface CustomerSubscription {
  id: string;
  customerName: string;
  customerPhone: string;
  planId: string;
  planName: string;
  startDate: string; // dd/MM/yyyy
  expiryDate: string; // dd/MM/yyyy
  remainingCuts: number; // -1 for unlimited
  status: 'active' | 'expiring' | 'expired' | 'canceled';
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string; // dd/MM/yyyy
  technicalNote: string;
  photos: string[]; // URLs or base64 data
  birthDate?: string;
}

export interface ComandaItem {
  id: string;
  type: 'service' | 'product' | 'plan_deduction';
  name: string;
  price: number;
  quantity: number;
  commissionRate: number; // percentage
}

export interface Comanda {
  id: string;
  bookingId?: string;
  customerName: string;
  customerPhone: string;
  barberId: string;
  barberName: string;
  items: ComandaItem[];
  subtotal: number;
  discount: number;
  total: number;
  commissionTotal: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Plano Recorrente';
  createdAt: string; // ISO string or dd/MM/yyyy HH:mm
  status: 'open' | 'closed';
}

export interface Booking {
  id: string;
  service: string;
  price: number;
  date: string; // dd/MM/yyyy
  time: string; // HH:mm
  name: string;
  phone: string;
  status: 'pending' | 'accepted' | 'completed';
  barberId?: string;
  barberName?: string;
  paidByPlan?: boolean;
  planName?: string;
}

export type CancelReason =
  | 'Imprevisto'
  | 'Indisponibilidade'
  | 'Problema pessoal'
  | 'Horário não disponível';

export interface CustomerReview {
  id: string;
  name: string;
  avatar?: string;
  photo?: string;
  rating: number;
  message: string;
  service?: string;
  date: string;
  verified?: boolean;
}

