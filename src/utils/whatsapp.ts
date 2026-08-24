import { BARBERSHOP_PHONE } from '../data/services';

export const WEEKDAY_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
];

export const SATURDAY_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
];

export function getTimeSlotsForDate(date: Date): string[] {
  const day = date.getDay();
  if (day === 0) return []; // Sunday closed
  return WEEKDAY_SLOTS;
}

export function isOpenNow(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMin = hours * 60 + minutes;

  if (day === 0) return false; // Sunday closed
  // Mon-Sat: 09:00 to 19:30 (540 to 1170 minutes)
  return totalMin >= 540 && totalMin < 1170;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodeURIComponent(text)}`;
}

export function buildGeneralWhatsAppLink(text: string): string {
  return buildWhatsAppLink(BARBERSHOP_PHONE, text);
}

export function formatPhoneMask(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatDateBr(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
