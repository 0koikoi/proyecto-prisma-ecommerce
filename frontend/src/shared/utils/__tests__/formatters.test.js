import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate } from '../formatters';

describe('formatters', () => {
  it('formats amounts as PEN with two decimals', () => {
    const text = formatCurrency(59.9).replace(/\s/g, ' ');
    expect(text).toContain('59.90');
    expect(text).toMatch(/S\/|PEN/);
  });

  it('falls back to zero for invalid amounts', () => {
    expect(formatCurrency('abc')).toContain('0.00');
  });

  it('formats valid dates and returns empty for invalid ones', () => {
    expect(formatDate('2026-03-15T12:00:00Z')).toMatch(/2026/);
    expect(formatDate(new Date('2026-03-15T12:00:00Z'))).toMatch(/2026/);
    expect(formatDate('')).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });
});
