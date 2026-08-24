import {
  Service,
  Barber,
  Product,
  Plan,
  CustomerSubscription,
  CustomerProfile,
  Comanda,
  Expense,
  InventoryMovement,
} from '../types';

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Degradê',
    time: 30,
    price: 30,
    image: 'https://barbeariabigboss.com.br/wp-content/uploads/2025/07/a-historia-do-corte-degrade.png',
  },
  {
    id: 's2',
    name: 'Corte Social',
    time: 30,
    price: 30,
    image: '/images/corte-de-cabelo-social-2.webp',
  },
  {
    id: 's4',
    name: 'Barba',
    time: 20,
    price: 20,
    image: 'https://static.ndmais.com.br/2021/03/istock-1185955900-800x533.jpg',
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Dona Renata',
    phone: '5588998577627',
    photo: '/images/about.jpg',
    commissionServicePercent: 100,
    commissionProductPercent: 100,
    role: 'master',
    pinCode: 'admin',
  },
  {
    id: 'b2',
    name: 'Alex Silva',
    phone: '84988776655',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    commissionServicePercent: 50,
    commissionProductPercent: 10,
    role: 'barber',
    pinCode: '1234',
  },
  {
    id: 'b3',
    name: 'Bruno Costa',
    phone: '84999887766',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    commissionServicePercent: 40,
    commissionProductPercent: 15,
    role: 'barber',
    pinCode: '5678',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pomada Efeito Matte (Fixação Forte)',
    price: 35,
    costPrice: 15,
    stock: 24,
    minStock: 5,
    category: 'Pomada',
    supplier: 'Distribuidora Barber Beauty',
  },
  {
    id: 'p2',
    name: 'Óleo para Barba Hidratante 30ml',
    price: 30,
    costPrice: 12,
    stock: 15,
    minStock: 4,
    category: 'Óleo/Barba',
    supplier: 'Distribuidora Barber Beauty',
  },
  {
    id: 'p3',
    name: 'Shampoo Fortificante Cabelo & Barba',
    price: 40,
    costPrice: 18,
    stock: 12,
    minStock: 5,
    category: 'Shampoo',
    supplier: 'Cosméticos Pro Barba',
  },
  {
    id: 'p4',
    name: 'Cerveja Long Neck Gelada',
    price: 10,
    costPrice: 4.5,
    stock: 48,
    minStock: 12,
    category: 'Bebida',
    supplier: 'Ambev Distribuição',
  },
  {
    id: 'p5',
    name: 'Minoxidil 5% Tônico Fortalecedor',
    price: 60,
    costPrice: 28,
    stock: 2, // Low stock trigger for AI Manager!
    minStock: 3,
    category: 'Tratamento',
    supplier: 'Lab Pharma Men',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'Aluguel do Ponto Comercial',
    category: 'Aluguel',
    type: 'Fixa',
    amount: 1500,
    dueDate: '10/08/2026',
    paymentDate: '10/08/2026',
    status: 'paid',
    recipient: 'Imobiliária Natal Norte',
  },
  {
    id: 'exp-2',
    description: 'Energia Elétrica (Cosern)',
    category: 'Água/Luz/Internet',
    type: 'Fixa',
    amount: 380,
    dueDate: '15/08/2026',
    paymentDate: '12/08/2026',
    status: 'paid',
    recipient: 'Neoenergia Cosern',
  },
  {
    id: 'exp-3',
    description: 'Internet Fibra 500MB',
    category: 'Água/Luz/Internet',
    type: 'Fixa',
    amount: 120,
    dueDate: '20/08/2026',
    status: 'pending',
    recipient: 'Provedor Turbo',
  },
  {
    id: 'exp-4',
    description: 'Lote de Pomadas & Minoxidil',
    category: 'Insumos/Produtos',
    type: 'Variável',
    amount: 450,
    dueDate: '05/08/2026',
    paymentDate: '05/08/2026',
    status: 'paid',
    recipient: 'Distribuidora Barber Beauty',
  },
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    productId: 'p5',
    productName: 'Minoxidil 5% Tônico Fortalecedor',
    type: 'sale',
    quantity: 1,
    previousStock: 3,
    newStock: 2,
    reason: 'Venda Casada Comanda #cmd-1',
    author: 'Dona Renata',
    createdAt: '10/08/2026 14:00',
  },
  {
    id: 'mov-2',
    productId: 'p1',
    productName: 'Pomada Efeito Matte',
    type: 'in',
    quantity: 10,
    previousStock: 14,
    newStock: 24,
    reason: 'Reposição de Estoque Nota Fiscal #9081',
    author: 'Dona Renata',
    createdAt: '08/08/2026 10:15',
  },
];

export const PLANS: Plan[] = [
  {
    id: 'plan-1',
    name: 'Plano VIP Ilimitado',
    priceMonthly: 150,
    cutsPerMonth: -1, // Ilimitado
    description: 'Cortes ilimitados no mês + café/cerveja de cortesia em cada visita.',
  },
  {
    id: 'plan-2',
    name: 'Pacote 4 Cortes Mensais',
    priceMonthly: 100,
    cutsPerMonth: 4,
    description: 'Até 4 cortes de cabelo por mês. Economia de até R$ 20.',
  },
  {
    id: 'plan-3',
    name: 'Clube Barba & Cabelo',
    priceMonthly: 180,
    cutsPerMonth: -1,
    description: 'Cortes de cabelo + barboterapia ilimitados no mês.',
  },
];

export const INITIAL_SUBSCRIPTIONS: CustomerSubscription[] = [
  {
    id: 'sub-1',
    customerName: 'Carlos Eduardo',
    customerPhone: '(84) 98811-2233',
    planId: 'plan-1',
    planName: 'Plano VIP Ilimitado',
    startDate: '01/08/2026',
    expiryDate: '31/08/2026',
    remainingCuts: -1,
    status: 'active',
  },
  {
    id: 'sub-2',
    customerName: 'Mateus Oliveira',
    customerPhone: '(84) 99944-5566',
    planId: 'plan-2',
    planName: 'Pacote 4 Cortes Mensais',
    startDate: '05/08/2026',
    expiryDate: '15/08/2026', // Expiring soon!
    remainingCuts: 1,
    status: 'expiring',
  },
  {
    id: 'sub-3',
    customerName: 'Rafael Vasconcelos',
    customerPhone: '(84) 98765-4321',
    planId: 'plan-3',
    planName: 'Clube Barba & Cabelo',
    startDate: '10/08/2026',
    expiryDate: '10/09/2026',
    remainingCuts: -1,
    status: 'active',
  },
];

export const INITIAL_CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    id: 'c1',
    name: 'Carlos Eduardo',
    phone: '(84) 98811-2233',
    totalVisits: 14,
    totalSpent: 450,
    lastVisit: '08/08/2026',
    technicalNote: 'Gosta do degradê navalhado bem baixo, máquina 0.5 na lateral. Usa pomada efeito matte. Aceita café sem açúcar.',
    photos: [
      'https://i.imgur.com/hM5a4aW.png',
      'https://i.imgur.com/ENcr2Kl.png',
    ],
    birthDate: '15/03/1992',
  },
  {
    id: 'c2',
    name: 'Mateus Oliveira',
    phone: '(84) 99944-5566',
    totalVisits: 8,
    totalSpent: 280,
    lastVisit: '05/08/2026',
    technicalNote: 'Corte social clássico na tesoura, pente 3 nas laterais. Cuidado com redemoinho no topo.',
    photos: [
      'https://i.imgur.com/hgpefSS.png',
    ],
    birthDate: '22/07/1988',
  },
  {
    id: 'c3',
    name: 'Rafael Vasconcelos',
    phone: '(84) 98765-4321',
    totalVisits: 22,
    totalSpent: 780,
    lastVisit: '10/08/2026',
    technicalNote: 'Barba longa com alinhamento na navalha. Pós-barba suave sem álcool (tem sensibilidade).',
    photos: [
      'https://i.imgur.com/cJKAYNF.png',
      'https://i.imgur.com/WxRamWi.png',
    ],
    birthDate: '04/11/1995',
  },
];

export const INITIAL_COMANDAS: Comanda[] = [
  {
    id: 'cmd-1',
    bookingId: 'b-old-1',
    customerName: 'Carlos Eduardo',
    customerPhone: '(84) 98811-2233',
    barberId: 'b2',
    barberName: 'Alex Silva',
    items: [
      { id: 'i1', type: 'service', name: 'Degradê', price: 30, quantity: 1, commissionRate: 50 },
      { id: 'i2', type: 'product', name: 'Pomada Efeito Matte', price: 35, quantity: 1, commissionRate: 10 },
    ],
    subtotal: 65,
    discount: 0,
    total: 65,
    commissionTotal: 18.5, // (30*0.50) + (35*0.10) = 15 + 3.5
    paymentMethod: 'PIX',
    createdAt: '10/08/2026 14:00',
    status: 'closed',
  },
  {
    id: 'cmd-2',
    bookingId: 'b-old-2',
    customerName: 'Rafael Vasconcelos',
    customerPhone: '(84) 98765-4321',
    barberId: 'b1',
    barberName: 'Dona Renata',
    items: [
      { id: 'i3', type: 'service', name: 'Corte + Barba', price: 45, quantity: 1, commissionRate: 100 },
      { id: 'i4', type: 'product', name: 'Óleo para Barba Hidratante', price: 30, quantity: 1, commissionRate: 100 },
    ],
    subtotal: 75,
    discount: 5,
    total: 70,
    commissionTotal: 70,
    paymentMethod: 'Cartão de Crédito',
    createdAt: '10/08/2026 15:30',
    status: 'closed',
  },
];

export const GALLERY_IMAGES = [
  '/images/gallery-1.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
  '/images/gallery-8.jpg',
  '/images/gallery-10.jpg',
  '/images/gallery-11.jpg',
  '/images/gallery-12.jpg',
  '/images/gallery-13.jpg',
  '/images/gallery-14.jpg',
  '/images/Barbearia-Instragram.jpeg',
];

export const BARBERSHOP_PHONE = '5588998577627';

export const ADDRESS = 'Avenida Governador Plácido Aderaldo Castelo branco 535 - Lagoa Seca, Juazeiro do Norte - CE, 63040-540';

export const REVIEWS_IMAGES = [
  '/images/gallery-1.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Gabriel Santos',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    photo: '/images/gallery-1.jpg',
    rating: 5,
    message: 'Melhor degradê de Natal! A Dona Renata é braba demais, atendimento nota 1000 e cerveja sempre geladíssima.',
    service: 'Degradê Navalhado',
    date: 'há 2 dias',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Lucas Ferreira',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    photo: '/images/gallery-6.jpg',
    rating: 5,
    message: 'O ambiente é sensacional. Toalha quente na barba e alinhamento impecável. Assinei o Plano VIP e economizo bastante no mês!',
    service: 'Corte + Barboterapia',
    date: 'há 5 dias',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Rodrigo Medeiros',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    photo: '/images/gallery-3.jpg',
    rating: 5,
    message: 'Agendamento super rápido pelo site sem ter que esperar na fila. Pontualidade máxima e corte na tesoura perfeito!',
    service: 'Corte Social na Tesoura',
    date: 'há 1 semana',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Matheus Lima',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    photo: '/images/gallery-4.jpg',
    rating: 5,
    message: 'Atendimento do Alex foi nota dez! Cuidado extremo nos detalhes e acabamento impecável do pezinho.',
    service: 'Degradê + Pezinho',
    date: 'há 2 semanas',
    verified: true,
  },
  {
    id: 'rev-5',
    name: 'Renan Souza',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    photo: '/images/gallery-5.jpg',
    rating: 5,
    message: 'Estrutura top, ambiente climatizado, música boa e atendimento VIP. Recomendo de olhos fechados pra qualquer um!',
    service: 'Barba Completa com Toalha Quente',
    date: 'há 3 semanas',
    verified: true,
  },
];

export const CANCEL_REASONS = [
  'Imprevisto',
  'Indisponibilidade',
  'Problema pessoal',
  'Horário não disponível',
];

