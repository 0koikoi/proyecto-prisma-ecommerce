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

  it.each([
    ['WEB-2026-00001', 'PENDING'],
    ['WEB-2026-00002', 'PREPARING'],
    ['WEB-2026-00003', 'SHIPPED'],
    ['WEB-2026-00004', 'DELIVERED'],
    ['WEB-2026-00005', 'CANCELLED'],
  ])('serves demo order %s with status %s', async (code, status) => {
    const order = await orderService.getOrderByCode(code);
    expect(order.status).toBe(status);
    expect(order.code).toBe(code);
  });

  it('includes courier data for shipped orders', async () => {
    const shipped = await orderService.getOrderByCode('WEB-2026-00003');
    expect(shipped.courier).toBeTruthy();
    expect(shipped.trackingNumber).toBeTruthy();
  });

  it.each(['constructor', '__proto__', 'toString'])('does not resolve inherited name %s', async (name) => {
    await expect(orderService.getOrderByCode(name)).rejects.toMatchObject({ status: 404 });
  });
});
