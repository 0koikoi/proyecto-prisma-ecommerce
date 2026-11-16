import { apiClient, simulateNetworkDelay, USE_MOCK } from '../../../core/api/apiClient';
import { validateName, validatePhone } from '../../../shared/utils/validators';
import { findVariantInCatalog } from '../../catalog/services/catalogService';

const sessionOrders = new Map();
const DEMO_BASE = {
  createdAt: new Date().toISOString(),
  customerName: 'Cliente Demo',
  customerPhone: '987654321',
  shippingAddress: 'Jr. General Prado 450, Huánuco',
  reference: 'Frente a la plazuela',
  deliveryScope: 'LOCAL',
  requestedPaymentMethod: 'YAPE',
  items: [
    {
      variantId: 201,
      name: 'Polera oversize negra',
      size: 'M',
      color: 'Negro',
      quantity: 1,
      unitPrice: 59.9,
      subtotal: 59.9,
    },
  ],
  subtotal: 59.9,
};

// Demo orders available in mock mode so every tracking state can be explored.
// A Map (not a plain object) so a user-provided code can never reach inherited members.
const DEMO_ORDERS = new Map([
  ['WEB-2026-00001', () => ({ ...DEMO_BASE, code: 'WEB-2026-00001', status: 'PENDING' })],
  ['WEB-2026-00002', () => ({ ...DEMO_BASE, code: 'WEB-2026-00002', status: 'PREPARING' })],
  [
    'WEB-2026-00003',
    () => ({
      ...DEMO_BASE,
      code: 'WEB-2026-00003',
      status: 'SHIPPED',
      courier: 'Olva Courier',
      trackingNumber: 'OLV-884210',
    }),
  ],
  [
    'WEB-2026-00004',
    () => ({
      ...DEMO_BASE,
      code: 'WEB-2026-00004',
      status: 'DELIVERED',
      courier: 'Olva Courier',
      trackingNumber: 'OLV-770123',
    }),
  ],
  ['WEB-2026-00005', () => ({ ...DEMO_BASE, code: 'WEB-2026-00005', status: 'CANCELLED' })],
]);

let orderSequence = 1;

function buildOrderCode() {
  const padded = String(orderSequence).padStart(5, '0');
  orderSequence += 1;
  return `WEB-2026-${padded}`;
}

function validateOrderPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Datos del pedido inválidos.');
  }

  if (!validateName(payload.customerName)) {
    throw new Error('Ingresa un nombre válido (mínimo 3 letras).');
  }

  if (!validatePhone(payload.customerPhone)) {
    throw new Error('Ingresa un número de celular válido de 9 dígitos.');
  }

  if (!payload.shippingAddress || String(payload.shippingAddress).trim().length < 5) {
    throw new Error('Ingresa una dirección de entrega válida.');
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Tu carrito está vacío.');
  }
}

export async function createOrder(payload) {
  validateOrderPayload(payload);

  if (USE_MOCK) {
    await simulateNetworkDelay();

    const code = buildOrderCode();
    const enrichedItems = payload.items.map((item) => {
      const details = findVariantInCatalog(item.variantId);
      const unitPrice = details ? details.salePrice : Number(item.salePrice) || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);

      return {
        variantId: item.variantId,
        quantity,
        name: details?.name || 'Producto Tienda Prisma',
        size: details?.size || '-',
        color: details?.color || '-',
        unitPrice,
        subtotal: Number((unitPrice * quantity).toFixed(2)),
      };
    });

    const subtotal = Number(
      enrichedItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2),
    );

    const createdOrder = {
      code,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      requestKey: payload.requestKey || `req-${Date.now()}`,
      customerName: String(payload.customerName).trim(),
      customerPhone: String(payload.customerPhone).trim(),
      shippingAddress: String(payload.shippingAddress).trim(),
      reference: payload.reference ? String(payload.reference).trim() : '',
      deliveryScope: payload.deliveryScope || 'LOCAL',
      requestedPaymentMethod: payload.requestedPaymentMethod || 'YAPE',
      items: enrichedItems,
      subtotal,
    };

    sessionOrders.set(code, createdOrder);
    return createdOrder;
  }

  // NOTA: Los endpoints /api/public/... son provisionales hasta que el backend los exponga.
  // return apiClient('/api/public/orders', {
  //   method: 'POST',
  //   body: payload,
  // });
  return apiClient('/api/public/orders', {
    method: 'POST',
    body: payload,
  });
}

export async function getOrderByCode(code) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    const normalized = String(code || '').trim().toUpperCase();

    if (sessionOrders.has(normalized)) {
      return sessionOrders.get(normalized);
    }

    if (DEMO_ORDERS.has(normalized)) {
      return DEMO_ORDERS.get(normalized)();
    }

    const error = new Error('Pedido no encontrado');
    error.status = 404;
    throw error;
  }

  // NOTA: Ruta provisional sujeta a definición del backend público.
  // return apiClient(`/api/public/orders/${encodeURIComponent(code)}`);
  return apiClient(`/api/public/orders/${encodeURIComponent(code)}`);
}

export const orderService = {
  createOrder,
  getOrderByCode,
};
