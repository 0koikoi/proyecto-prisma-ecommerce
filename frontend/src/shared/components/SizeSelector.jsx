import { useId } from 'react';

export function SizeSelector({ variants, value, onChange, error }) {
  const errorId = useId();
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-semibold mb-3">Elige tu talla y color</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button key={variant.id} type="button" disabled={variant.availableStock <= 0}
            aria-pressed={value === variant.id}
            aria-label={`${variant.size}, ${variant.color}${variant.availableStock <= 0 ? ', agotado' : ''}`}
            onClick={() => onChange(variant.id)}
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary disabled:line-through disabled:opacity-40 disabled:cursor-not-allowed ${value === variant.id ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'}`}>
            {variant.size} <span className="font-normal">· {variant.color}</span>
          </button>
        ))}
      </div>
      {error && <p id={errorId} role="alert" className="text-sm text-rose mt-2">{error}</p>}
    </fieldset>
  );
}
