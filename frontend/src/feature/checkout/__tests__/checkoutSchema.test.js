import { describe, expect, it } from 'vitest';
import { checkoutSchema, CHECKOUT_DEFAULT_VALUES } from '../checkoutSchema';
import { zodResolver } from '../../../shared/utils/zodResolver';

const valid = {
  ...CHECKOUT_DEFAULT_VALUES,
  customerName: 'María Núñez',
  customerPhone: '987654321',
  shippingAddress: 'Jr. General Prado 450',
};

describe('checkoutSchema', () => {
  it('accepts a valid payload', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects short names and names with digits', () => {
    expect(checkoutSchema.safeParse({ ...valid, customerName: 'Al' }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, customerName: 'Juan 3' }).success).toBe(false);
  });

  it.each(['887654321', '98765432', '9876543210', 'abc'])('rejects phone %s', (phone) => {
    expect(checkoutSchema.safeParse({ ...valid, customerPhone: phone }).success).toBe(false);
  });

  it('rejects unknown delivery scope and payment method', () => {
    expect(checkoutSchema.safeParse({ ...valid, deliveryScope: 'MUNDIAL' }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, paymentMethod: 'BITCOIN' }).success).toBe(false);
  });

  it('treats reference as optional', () => {
    const { reference, ...rest } = valid;
    expect(reference).toBe('');
    expect(checkoutSchema.safeParse(rest).success).toBe(true);
  });
});

describe('zodResolver', () => {
  it('returns values on success', async () => {
    const result = await zodResolver(checkoutSchema)(valid);
    expect(result.errors).toEqual({});
    expect(result.values.customerPhone).toBe('987654321');
  });

  it('maps issues to field errors', async () => {
    const result = await zodResolver(checkoutSchema)({ ...valid, customerPhone: '1' });
    expect(result.values).toEqual({});
    expect(result.errors.customerPhone.message).toMatch(/celular/i);
  });
});
