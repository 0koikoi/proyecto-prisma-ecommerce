import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({ value, max, onChange, label = 'Cantidad', disabled = false }) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-xl border border-gray-300 bg-white">
      <button type="button" className="btn btn-ghost min-h-11 min-w-11" aria-label={`Reducir ${label.toLowerCase()}`}
        disabled={disabled || value <= 1} onClick={() => onChange(value - 1)}><Minus size={16} aria-hidden="true" /></button>
      <span className="min-w-9 text-center text-sm font-semibold" aria-live="polite">{value}</span>
      <button type="button" className="btn btn-ghost min-h-11 min-w-11" aria-label={`Aumentar ${label.toLowerCase()}`}
        disabled={disabled || value >= max} onClick={() => onChange(value + 1)}><Plus size={16} aria-hidden="true" /></button>
    </div>
  );
}
