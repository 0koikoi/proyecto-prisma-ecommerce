import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PackageSearch, ShoppingBag, Sparkles, X } from 'lucide-react';
import { STORE_LINES } from '../constants/storeLines';

export function MobileMenu({ isOpen, onClose }) {
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
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="sidebar-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="Menú principal móvil"
        className="relative z-50 w-72 max-w-[85vw] h-full bg-primary text-white shadow-2xl flex flex-col justify-between p-5 transition-transform duration-300"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-secondary text-primary flex items-center justify-center font-extrabold text-sm">
                P
              </span>
              <span className="font-extrabold tracking-tight text-base">
                TIENDA PRISMA
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú de navegación"
              className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="flex flex-col gap-1.5">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item min-h-11 ${
                  isActive
                    ? 'nav-item-active'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Inicio</span>
            </NavLink>

            <NavLink
              to="/catalogo"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item min-h-11 ${
                  isActive
                    ? 'nav-item-active'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Ver catálogo</span>
            </NavLink>

            <div className="pt-4 pb-1 px-3.5">
              <span className="text-[11px] font-extrabold tracking-[0.22em] text-gray-400 uppercase">
                Líneas
              </span>
            </div>

            {STORE_LINES.map((line) => (
              <NavLink
                key={line.id}
                to={`/catalogo/${line.slug}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item min-h-11 ${
                    isActive
                      ? 'nav-item-active'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{line.fullName}</span>
              </NavLink>
            ))}

            <div className="pt-4 pb-1 px-3.5">
              <span className="text-[11px] font-extrabold tracking-[0.22em] text-gray-400 uppercase">
                Pedidos
              </span>
            </div>

            <NavLink
              to="/pedido/WEB-2026-00001"
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item min-h-11 ${
                  isActive
                    ? 'nav-item-active'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <PackageSearch className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Seguimiento de pedido</span>
            </NavLink>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-gray-400 space-y-1">
          <p className="font-semibold text-white">Envíos a todo el Perú</p>
          <p>Atención desde Huánuco</p>
        </div>
      </aside>
    </div>
  );
}
