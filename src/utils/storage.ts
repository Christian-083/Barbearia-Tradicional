import {
  Booking,
  Barber,
  Product,
  Plan,
  CustomerSubscription,
  CustomerProfile,
  Comanda,
  Expense,
  InventoryMovement,
  CustomerReview,
  Service,
} from '../types';
import {
  BARBERS,
  PRODUCTS,
  PLANS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_CUSTOMER_PROFILES,
  INITIAL_COMANDAS,
  INITIAL_EXPENSES,
  INITIAL_MOVEMENTS,
  INITIAL_REVIEWS,
  SERVICES,
} from '../data/services';

const BOOKINGS_KEY = 'galdino_bookings';
const COMPLETED_KEY = 'galdino_completed';
const BARBERS_KEY = 'galdino_barbers_v3';
const SERVICES_KEY = 'galdino_services_v10';
const PRODUCTS_KEY = 'galdino_products';
const PLANS_KEY = 'galdino_plans';
const SUBSCRIPTIONS_KEY = 'galdino_subscriptions';
const PROFILES_KEY = 'galdino_profiles';
const COMANDAS_KEY = 'galdino_comandas';
const EXPENSES_KEY = 'galdino_expenses';
const MOVEMENTS_KEY = 'galdino_movements';
const REVIEWS_KEY = 'galdino_reviews';
export const ADMIN_REMEMBER_KEY = 'galdino_admin_remembered';

// --- BOOKINGS ---
export function getBookings(): Booking[] {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
}

export function addBooking(booking: Booking): void {
  const current = getBookings();
  current.push(booking);
  saveBookings(current);
}

export function getCompletedBookings(): Booking[] {
  try {
    const data = localStorage.getItem(COMPLETED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCompletedBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save completed bookings', e);
  }
}

export function addCompletedBooking(booking: Booking): void {
  const completed = getCompletedBookings();
  completed.push({ ...booking, status: 'completed' });
  saveCompletedBookings(completed);
}

export function removeCompletedBooking(id: string): Booking | undefined {
  const completed = getCompletedBookings();
  const target = completed.find((b) => b.id === id);
  saveCompletedBookings(completed.filter((b) => b.id !== id));
  return target;
}

// --- BARBERS ---
export function getBarbers(): Barber[] {
  try {
    const data = localStorage.getItem(BARBERS_KEY);
    return data ? JSON.parse(data) : BARBERS;
  } catch {
    return BARBERS;
  }
}

export function saveBarbers(barbers: Barber[]): void {
  try {
    localStorage.setItem(BARBERS_KEY, JSON.stringify(barbers));
  } catch (e) {
    console.error('Failed to save barbers', e);
  }
}

// --- SERVICES ---
export function getServices(): Service[] {
  try {
    const data = localStorage.getItem(SERVICES_KEY);
    return data ? JSON.parse(data) : SERVICES;
  } catch (e) {
    return SERVICES;
  }
}

export function saveServices(services: Service[]): void {
  try {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  } catch (e) {
    console.error('Failed to save services', e);
  }
}

// --- PRODUCTS ---
export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
}

// --- PLANS ---
export function getPlans(): Plan[] {
  try {
    const data = localStorage.getItem(PLANS_KEY);
    return data ? JSON.parse(data) : PLANS;
  } catch {
    return PLANS;
  }
}

export function savePlans(plans: Plan[]): void {
  try {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans', e);
  }
}

// --- SUBSCRIPTIONS ---
export function getSubscriptions(): CustomerSubscription[] {
  try {
    const data = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return data ? JSON.parse(data) : INITIAL_SUBSCRIPTIONS;
  } catch {
    return INITIAL_SUBSCRIPTIONS;
  }
}

export function saveSubscriptions(subs: CustomerSubscription[]): void {
  try {
    localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('Failed to save subscriptions', e);
  }
}

export function findActiveSubscriptionByPhone(phone: string): CustomerSubscription | null {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return null;
  const subs = getSubscriptions();
  const found = subs.find((s) => {
    const subClean = s.customerPhone.replace(/\D/g, '');
    return (
      (subClean.includes(clean) || clean.includes(subClean)) &&
      (s.status === 'active' || s.status === 'expiring')
    );
  });
  return found || null;
}

export function deductSubscriptionCredit(subId: string): boolean {
  const subs = getSubscriptions();
  const updated = subs.map((s) => {
    if (s.id === subId) {
      if (s.remainingCuts === -1) {
        // Unlimited cuts plan, keep active
        return s;
      }
      if (s.remainingCuts > 0) {
        const nextRem = s.remainingCuts - 1;
        return {
          ...s,
          remainingCuts: nextRem,
          status: nextRem === 0 ? ('expired' as const) : s.status,
        };
      }
    }
    return s;
  });
  saveSubscriptions(updated);
  return true;
}

// --- CUSTOMER PROFILES (CRM) ---
export function getCustomerProfiles(): CustomerProfile[] {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : INITIAL_CUSTOMER_PROFILES;
  } catch {
    return INITIAL_CUSTOMER_PROFILES;
  }
}

export function saveCustomerProfiles(profiles: CustomerProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles', e);
  }
}

export function addOrUpdateCustomerProfile(profile: Partial<CustomerProfile> & { phone: string; name: string }): void {
  const profiles = getCustomerProfiles();
  const cleanPhone = profile.phone.replace(/\D/g, '');
  const existingIdx = profiles.findIndex((p) => p.phone.replace(/\D/g, '') === cleanPhone);

  if (existingIdx >= 0) {
    profiles[existingIdx] = {
      ...profiles[existingIdx],
      ...profile,
      name: profile.name || profiles[existingIdx].name,
    };
  } else {
    profiles.push({
      id: crypto.randomUUID(),
      name: profile.name,
      phone: profile.phone,
      totalVisits: profile.totalVisits || 1,
      totalSpent: profile.totalSpent || 0,
      lastVisit: profile.lastVisit || new Date().toLocaleDateString('pt-BR'),
      technicalNote: profile.technicalNote || '',
      photos: profile.photos || [],
      birthDate: profile.birthDate,
    });
  }

  saveCustomerProfiles(profiles);
}

// --- COMANDAS ---
export function getComandas(): Comanda[] {
  try {
    const data = localStorage.getItem(COMANDAS_KEY);
    return data ? JSON.parse(data) : INITIAL_COMANDAS;
  } catch {
    return INITIAL_COMANDAS;
  }
}

export function saveComandas(comandas: Comanda[]): void {
  try {
    localStorage.setItem(COMANDAS_KEY, JSON.stringify(comandas));
  } catch (e) {
    console.error('Failed to save comandas', e);
  }
}

export function addComanda(comanda: Comanda): void {
  const comandas = getComandas();
  comandas.push(comanda);
  saveComandas(comandas);
}

// --- EXPENSES (FLUXO DE CAIXA) ---
export function getExpenses(): Expense[] {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : INITIAL_EXPENSES;
  } catch {
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses', e);
  }
}

export function addExpense(expense: Expense): void {
  const current = getExpenses();
  current.unshift(expense);
  saveExpenses(current);
}

// --- INVENTORY MOVEMENTS (HISTÓRICO DE ESTOQUE) ---
export function getInventoryMovements(): InventoryMovement[] {
  try {
    const data = localStorage.getItem(MOVEMENTS_KEY);
    return data ? JSON.parse(data) : INITIAL_MOVEMENTS;
  } catch {
    return INITIAL_MOVEMENTS;
  }
}

export function saveInventoryMovements(movements: InventoryMovement[]): void {
  try {
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
  } catch (e) {
    console.error('Failed to save movements', e);
  }
}

export function recordInventoryMovement(movement: InventoryMovement): void {
  const current = getInventoryMovements();
  current.unshift(movement);
  saveInventoryMovements(current);
}

export function deductProductStock(productId: string, qty: number, author: string, reason: string): boolean {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === productId);
  if (idx >= 0) {
    const prev = products[idx].stock;
    const newStock = Math.max(0, prev - qty);
    products[idx].stock = newStock;
    saveProducts(products);

    // Record movement
    recordInventoryMovement({
      id: crypto.randomUUID(),
      productId,
      productName: products[idx].name,
      type: 'sale',
      quantity: qty,
      previousStock: prev,
      newStock: newStock,
      reason,
      author,
      createdAt: new Date().toLocaleString('pt-BR'),
    });

    return true;
  }
  return false;
}

// --- REVIEWS ---
export function getReviews(): CustomerReview[] {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    return data ? JSON.parse(data) : INITIAL_REVIEWS;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveReviews(reviews: CustomerReview[]): void {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews', e);
  }
}

export function addReview(review: CustomerReview): void {
  const current = getReviews();
  current.unshift(review);
  saveReviews(current);
}

