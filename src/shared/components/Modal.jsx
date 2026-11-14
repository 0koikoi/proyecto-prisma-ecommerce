import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={onClose}
    >
      <div
        className={`modal-content p-6 ${className}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-100">
            {title ? (
              <h2 id="modal-title" className="text-lg font-bold tracking-tight">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar ventana"
                className="btn btn-ghost btn-sm min-h-11 min-w-11 p-2 rounded-xl"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
