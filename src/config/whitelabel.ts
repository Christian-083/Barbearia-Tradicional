/**
 * Configuração Central White-Label da Barbearia
 * Altere as cores, nome, logo e dados de contato aqui para personalizar 100% da aplicação.
 */

export const WHITELABEL_CONFIG = {
  shopName: 'Barbearia Dona Renata',
  tagline: 'Cortes de precisão, barboterapia e ambiente premium exclusivo',
  shortName: 'Dona Renata',
  logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200',
  heroBannerBg: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1600',
  
  // Contato & Localização
  phone: '84999999999', // WhatsApp do Gerente
  phoneFormatted: '(84) 99999-9999',
  address: 'Rua das Barbearias, 1000 - Centro, Natal/RN',
  googleMapsUrl: 'https://maps.google.com',
  instagram: '@barbeariaseugaldino',
  instagramUrl: 'https://instagram.com',
  
  // Estilo & Visual (Premium Dark)
  theme: {
    primaryGold: '#EAB308', // Dourado Vibrante (#EAB308 / #D4AF37)
    primaryGoldHover: '#CA8A04',
    darkBg: '#0a0a0a',      // Fundo Preto Profundo
    cardBg: '#121212',      // Card Escuro Neumórfico
    borderColor: '#262626',
  },

  // Horários de Funcionamento
  workingHours: {
    weekdays: '08:00 às 20:00',
    saturday: '08:00 às 18:00',
    sunday: 'Fechado',
  },

  // Planos de Assinatura Padrão
  defaultPlans: [
    {
      id: 'plan-corte',
      name: 'Plano Corte Ilimitado',
      priceMonthly: 120,
      cutsPerMonth: -1, // -1 = Ilimitado
      description: 'Cortes de cabelo ilimitados no mês + 10% de desconto em pomadas e produtos.',
    },
    {
      id: 'plan-barba',
      name: 'Plano Barba VIP (4x)',
      priceMonthly: 90,
      cutsPerMonth: 4,
      description: 'Até 4 Barboterapias completas por mês com toalha quente e alinhamento.',
    },
    {
      id: 'plan-combo',
      name: 'Plano Cabelo & Barba Ilimitado',
      priceMonthly: 180,
      cutsPerMonth: -1,
      description: 'Cabelo e Barba totalmente ilimitados + Bebida cortesia a cada visita.',
    },
  ],
};
