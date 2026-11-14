import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../../core/context/CartContext';
import { STORE_LINES } from '../constants/storeLines';

export function Header({ onOpenMobileMenu, onOpenSearch, onOpenCart }) {
  const { totalItems } = useCart();

  return (
    <header className="store-header">
      <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Izquierda: botón menú móvil y logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menú de navegación"
            className="md:hidden btn btn-ghost btn-sm min-h-11 min-w-11 p-2.5 rounded-xl"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          <Link to="/" className="store-brand-badge">
            <span className="w-8 h-8 rounded-xl bg-primary text-secondary flex items-center justify-center font-extrabold text-sm shadow-sm">
              P
            </span>
            <span>TIENDA PRISMA</span>
          </Link>
        </div>

        {/* Centro: navegación por línea (desde md) */}
        <nav aria-label="Líneas de la tienda" className="hidden md:flex items-center gap-1">
          {STORE_LINES.map((line) => (
            <NavLink
              key={line.id}
              to={`/catalogo/${line.slug}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : 'text-gray-700 hover:bg-surface-hover'}`
              }
            >
              {line.label}
            </NavLink>
          ))}
        </nav>

        {/* Derecha: buscador y carrito con contador */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Abrir buscador de productos"
            className="btn btn-ghost btn-sm min-h-11 min-w-11 p-2.5 rounded-xl"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Abrir carrito de compras (${totalItems} artículos)`}
            className="relative btn btn-ghost btn-sm min-h-11 min-w-11 p-2.5 rounded-xl"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            <span
              className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold"
              aria-live="polite"
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
