import { formatCurrency } from '../utils/formatters';
import { DELIVERY_SCOPE_LABELS, PAYMENT_LABELS } from '../constants/orders';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-primary sm:text-right">{value}</dd>
    </div>
  );
}

/** Items table + totals. */
export function OrderItems({ order }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-primary">Productos</h2>
      <ul className="divide-y divide-gray-100">
        {order.items.map((item) => (
          <li key={item.variantId} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.size} · {item.color} · x{item.quantity}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-primary">
              {formatCurrency(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-primary">
        <span>Total</span>
        <span>{formatCurrency(order.subtotal)}</span>
      </div>
    </div>
  );
}

/** Customer, delivery and payment data. */
export function OrderCustomerInfo({ order }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-primary">Datos del pedido</h2>
      <dl className="space-y-2 text-sm">
        <InfoRow label="Cliente" value={order.customerName} />
        <InfoRow label="Celular" value={order.customerPhone} />
        <InfoRow label="Dirección" value={order.shippingAddress} />
        <InfoRow label="Referencia" value={order.reference} />
        <InfoRow label="Entrega" value={DELIVERY_SCOPE_LABELS[order.deliveryScope]} />
        <InfoRow
          label="Método de pago"
          value={PAYMENT_LABELS[order.requestedPaymentMethod] || order.requestedPaymentMethod}
        />
      </dl>
    </div>
  );
}
