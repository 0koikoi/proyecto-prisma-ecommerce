import { Package } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Package,
  title = 'Módulo en construcción',
  description = 'Estamos preparando esta sección para ti.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`content-card flex flex-col items-center justify-center text-center py-12 px-6 gap-3 ${className}`.trim()}
    >
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-400" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-md">
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="lg" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
