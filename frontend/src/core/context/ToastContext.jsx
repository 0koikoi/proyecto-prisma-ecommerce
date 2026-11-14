import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

const TOAST_DURATION_MS = 3500;

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: { Icon: CheckCircle2, className: 'text-emerald' },
  warning: { Icon: AlertTriangle, className: 'text-amber' },
  error: { Icon: XCircle, className: 'text-rose' },
  info: { Icon: Info, className: 'text-secondary' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      setToasts((prev) => [...prev, { id, message, type }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, TOAST_DURATION_MS);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
      success: (msg) => showToast(msg, 'success'),
      warning: (msg) => showToast(msg, 'warning'),
      error: (msg) => showToast(msg, 'error'),
      info: (msg) => showToast(msg, 'info'),
    }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const config = TOAST_ICONS[toast.type] || TOAST_ICONS.info;
          const IconComponent = config.Icon;

          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex items-center justify-between gap-3 bg-primary text-white rounded-2xl shadow-2xl px-4 py-3.5 transition-all duration-300"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComponent
                  className={`w-4 h-4 shrink-0 ${config.className}`}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold uppercase tracking-wider truncate">
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Cerrar notificación"
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}

export { ToastContext };
