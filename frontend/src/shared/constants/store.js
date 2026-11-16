// Store contact number in international format without "+" (Peru: 51 + 9 digits).
// Override with VITE_WHATSAPP_NUMBER at build time.
export const WHATSAPP_NUMBER = import.meta.env?.VITE_WHATSAPP_NUMBER || '51999999999';

export function buildWhatsAppUrl(message = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
