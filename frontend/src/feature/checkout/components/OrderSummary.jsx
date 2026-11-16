import { useState } from 'react';
import { ChevronDown, Truck } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatters';

/**
 * Cart summary. Collapsible on mobile (toggle button), always open on desktop.
 */
export function OrderSummary({ items, subtotal }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = 'checkout-order-summary';

  return (
    <aside className="content-card space-y-4" aria-label="Resumen de tu compra">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left lg:pointer-events-none"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm font-bold text-primary">
          Resumen de tu compra ({items.length})
        </span>
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary lg:hidden">
            {formatCurrency(subtotal)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform lg:hidden ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div id={panelId} className={`${isOpen ? 'block' : 'hidden'} space-y-4 lg:block`}>
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.variantId} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.size} · {item.color} · x{item.quantity}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-primary">
                {formatCurrency(item.salePrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-amber-soft p-3 text-xs text-amber-text">
            <Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Los gastos de envío se coordinan por WhatsApp según tu ámbito de entrega.</p>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-primary">
            <dt>Total</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
