export const REGEX_PATTERNS = {
  PHONE_PE: /^9\d{8}$/,
  DNI: /^\d{8}$/,
  RUC: /^\d{11}$/,
  NAME: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{3,}$/,
};

export function sanitizePhone(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 9);
}

export function sanitizeDigits(value = '', maxLength = 11) {
  return String(value).replace(/\D/g, '').slice(0, maxLength);
}

export function validatePhone(value = '') {
  return REGEX_PATTERNS.PHONE_PE.test(String(value).trim());
}

export function validateDNI(value = '') {
  return REGEX_PATTERNS.DNI.test(String(value).trim());
}

export function validateRUC(value = '') {
  return REGEX_PATTERNS.RUC.test(String(value).trim());
}

export function validateName(value = '') {
  const trimmed = String(value).trim();
  return trimmed.length >= 3 && REGEX_PATTERNS.NAME.test(trimmed);
}
