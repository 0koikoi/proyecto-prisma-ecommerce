export const PAYMENT_LABELS = {
  YAPE: 'Yape',
  PLIN: 'Plin',
  TARJETA: 'Tarjeta',
  EFECTIVO: 'Efectivo',
};

export const DELIVERY_SCOPE_LABELS = {
  LOCAL: 'Local (Huánuco)',
  NACIONAL: 'Nacional (provincias)',
};

// Ordered flow of a regular order. CANCELLED is handled separately.
export const ORDER_FLOW = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED'];

export const ORDER_STATUS = {
  PENDING: {
    label: 'Pendiente',
    badge: 'amber',
    description: 'Recibimos tu pedido y estamos validando el pago.',
  },
  PREPARING: {
    label: 'En preparación',
    badge: 'cyan',
    description: 'Estamos empacando tus productos.',
  },
  SHIPPED: {
    label: 'Enviado',
    badge: 'purple',
    description: 'Tu pedido va en camino.',
  },
  DELIVERED: {
    label: 'Entregado',
    badge: 'emerald',
    description: 'Tu pedido fue entregado. ¡Gracias por comprar!',
  },
  CANCELLED: {
    label: 'Cancelado',
    badge: 'rose',
    description: 'Este pedido fue cancelado.',
  },
};
