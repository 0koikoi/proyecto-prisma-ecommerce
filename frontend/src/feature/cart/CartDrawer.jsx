import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../core/context/CartContext';
import { ProductImage } from '../../shared/components/ProductImage';
import { QuantitySelector } from '../../shared/components/QuantitySelector';
import { formatCurrency } from '../../shared/utils/formatters';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, canCheckout } = useCart();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} aria-labelledby="cart-title" className="store-cart-dialog" onCancel={(event) => { event.preventDefault(); closeCart(); }}>
      <div className="sidebar-backdrop" aria-hidden="true" onClick={closeCart} />
      <section className="store-cart-panel">
        <header className="flex items-center justify-between gap-3 border-b border-gray-200 p-5 shrink-0">
          <h2 id="cart-title" className="text-lg font-bold">Tu carrito <span className="text-gray-500">({items.length})</span></h2>
          <button type="button" autoFocus onClick={closeCart} className="btn btn-ghost min-h-11 min-w-11" aria-label="Cerrar carrito"><X size={20} /></button>
        </header>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center"><ShoppingBag className="text-gray-400" aria-hidden="true" /></div>
            <h3>Tu carrito está vacío</h3>
            <p className="text-sm text-gray-500">Encuentra algo para ti en nuestras colecciones.</p>
            <Link to="/catalogo" onClick={closeCart} className="btn btn-primary btn-lg">Explorar catálogo</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-200 px-5">
              {items.map((item) => (
                <li key={item.variantId} className="py-5 space-y-3">
                  <div className="flex gap-3">
                    <ProductImage src={item.image} alt={item.name} className="w-20 aspect-[3/4] rounded-xl shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1">
                      {item.slug ? <Link to={`/producto/${item.slug}`} onClick={closeCart} className="store-focus rounded text-sm font-semibold hover:underline">{item.name}</Link> : <h3 className="text-sm">{item.name}</h3>}
                      <p className="text-xs text-gray-500">Talla: {item.size} · {item.color}</p>
                      <p className="text-sm">{formatCurrency(item.salePrice)} <span className="text-xs text-gray-500">por unidad</span></p>
                      <p className="text-sm font-bold">{item.unavailable ? 'No disponible' : formatCurrency(item.salePrice * item.quantity)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <QuantitySelector value={item.quantity} max={item.availableStock} disabled={item.unavailable}
                      label={`Cantidad de ${item.name}, ${item.size}, ${item.color}`} onChange={(qty) => updateQuantity(item.variantId, qty)} />
                    <button type="button" onClick={() => removeItem(item.variantId)} className="btn btn-ghost min-h-11 min-w-11" aria-label={`Eliminar ${item.name}, ${item.size}, ${item.color}`}><Trash2 size={18} aria-hidden="true" /></button>
                  </div>
                  {item.stockWarning && <p role="status" className="text-xs text-amber-text bg-amber-soft rounded-xl p-3">{item.stockWarning}</p>}
                </li>
              ))}
            </ul>
            <footer className="shrink-0 border-t border-gray-200 p-5 space-y-3 bg-white">
              <div className="flex justify-between font-bold" aria-live="polite"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <p className="text-xs text-gray-500">Envío calculado en el checkout.</p>
              {canCheckout ? <Link to="/checkout" onClick={closeCart} className="btn btn-primary btn-lg w-full">Ir a pagar</Link>
                : <><p className="text-xs text-rose">Elimina los artículos no disponibles para continuar.</p><button type="button" disabled className="btn btn-primary btn-lg w-full">Ir a pagar</button></>}
            </footer>
          </>
        )}
      </section>
    </dialog>
  );
}
