import { describe, expect, it } from 'vitest';
import { orderService } from '../services/orderService';

const payload = {
  customerName: 'María Núñez',
  customerPhone: '987654321',
  shippingAddress: 'Jr. General Prado 450',
  items: [{ variantId: 201, quantity: 2, salePrice: 59.9 }],
};

describe('orderService (mock mode)', () => {
  it('creates an order with a WEB-2026-XXXXX code and retrievable by code', async () => {
    const order = await orderService.createOrder(payload);
    expect(order.code).toMatch(/^WEB-2026-\d{5}$/);
    expect(order.status).toBe('PENDING');
    const fetched = await orderService.getOrderByCode(order.code.toLowerCase());
    expect(fetched.code).toBe(order.code);
  });

  it('rejects an empty cart', async () => {
    await expect(orderService.createOrder({ ...payload, items: [] })).rejects.toThrow(/vacío/);
  });

  it('rejects invalid phone', async () => {
    await expect(
      orderService.createOrder({ ...payload, customerPhone: '123' }),
    ).rejects.toThrow(/celular/);
  });

  it('throws a 404 for unknown codes', async () => {
    await expect(orderService.getOrderByCode('WEB-2026-99999')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('serves demo orders for each tracking state', async () => {
    const shipped = await orderService.getOrderByCode('WEB-2026-00003');
    expect(shipped.status).toBe('SHIPPED');
    expect(shipped.courier).toBeTruthy();
  });
});
