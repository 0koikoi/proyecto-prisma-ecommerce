import { Check, X } from 'lucide-react';
import { ORDER_FLOW, ORDER_STATUS } from '../../../shared/constants/orders';

function getStepState(step, status) {
  const currentIndex = ORDER_FLOW.indexOf(status);
  const stepIndex = ORDER_FLOW.indexOf(step);
  if (stepIndex < currentIndex) return 'done';
  if (stepIndex === currentIndex) return 'current';
  return 'pending';
}

const DOT_CLASSES = {
  done: 'border-emerald bg-emerald text-white',
  current: 'border-primary bg-primary text-white ring-4 ring-secondary',
  pending: 'border-gray-300 bg-white text-gray-400',
};

/** Vertical timeline: completed, current and pending steps. */
export function OrderTimeline({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-rose-border bg-rose-soft p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose text-white">
          <X className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-rose">{ORDER_STATUS.CANCELLED.label}</p>
          <p className="text-xs text-gray-600">{ORDER_STATUS.CANCELLED.description}</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="space-y-0" aria-label="Etapas del pedido">
      {ORDER_FLOW.map((step, index) => {
        const state = getStepState(step, status);
        const isLast = index === ORDER_FLOW.length - 1;

        return (
          <li
            key={step}
            className="relative flex gap-4 pb-6 last:pb-0"
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {!isLast && (
              <span
                className={`absolute left-4 top-8 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 ${
                  state === 'done' ? 'bg-emerald' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            )}
            <span
              className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${DOT_CLASSES[state]}`}
            >
              {state === 'done' ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <div className="min-w-0 pt-1">
              <p
                className={`text-sm font-semibold ${
                  state === 'pending' ? 'text-gray-400' : 'text-primary'
                }`}
              >
                {ORDER_STATUS[step].label}
                <span className="sr-only">
                  {state === 'done' ? ' (completado)' : state === 'current' ? ' (actual)' : ' (pendiente)'}
                </span>
              </p>
              {state !== 'pending' && (
                <p className="text-xs text-gray-500">{ORDER_STATUS[step].description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
