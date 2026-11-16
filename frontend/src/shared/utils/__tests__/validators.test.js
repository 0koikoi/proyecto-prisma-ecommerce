import { describe, expect, it } from 'vitest';
import {
  sanitizeDigits,
  sanitizePhone,
  validateDNI,
  validateName,
  validatePhone,
  validateRUC,
} from '../validators';

describe('validators', () => {
  it('sanitizes phone to at most 9 digits', () => {
    expect(sanitizePhone('987-654 321 99')).toBe('987654321');
    expect(sanitizePhone()).toBe('');
  });

  it('sanitizes digits with a custom max length', () => {
    expect(sanitizeDigits('12a34b56', 4)).toBe('1234');
    expect(sanitizeDigits('1'.repeat(20))).toHaveLength(11);
  });

  it('validates Peruvian mobile numbers', () => {
    expect(validatePhone('987654321')).toBe(true);
    expect(validatePhone(' 987654321 ')).toBe(true);
    expect(validatePhone('887654321')).toBe(false);
    expect(validatePhone('')).toBe(false);
  });

  it('validates DNI and RUC lengths', () => {
    expect(validateDNI('12345678')).toBe(true);
    expect(validateDNI('1234567')).toBe(false);
    expect(validateRUC('20123456789')).toBe(true);
    expect(validateRUC('2012345678')).toBe(false);
  });

  it('validates names with accents and rejects digits or short values', () => {
    expect(validateName('José Ñañez')).toBe(true);
    expect(validateName('  Ana  ')).toBe(true);
    expect(validateName('Al')).toBe(false);
    expect(validateName('Juan 3')).toBe(false);
  });
});
