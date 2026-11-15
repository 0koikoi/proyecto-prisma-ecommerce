import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { EmptyState } from '../../shared/components';
import { SizeSelector } from '../../shared/components/SizeSelector';
import { QuantitySelector } from '../../shared/components/QuantitySelector';
import { ProductImage } from '../../shared/components/ProductImage';
import { useCart } from '../../core/context/CartContext';
import { STORE_CONTACT } from '../../shared/constants/storeLines';
import { formatCurrency } from '../../shared/utils/formatters';
import { catalogService } from './services/catalogService';

export function ProductDetailPage() {
  const { slug } = useParams();
  return <ProductDetail key={slug} slug={slug} />;
}

function ProductDetail({ slug }) {
  const [state, setState] = useState({ loading: true, product: null, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ loading: true, product: null, error: null });
    catalogService.getProductBySlug(slug).then(
      (product) => { if (active) setState({ loading: false, product, error: null }); },
      (error) => { if (active) setState({ loading: false, product: null, error }); },
    );
    return () => { active = false; };
  }, [slug, attempt]);

  if (state.loading) return (
    <section className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8" aria-busy="true" aria-label="Cargando producto">
      <div className="lg:col-span-7"><Skeleton className="aspect-[3/4]" /></div>
      <div className="lg:col-span-5 space-y-6"><Skeleton height={40} count={2} /><Skeleton height={24} count={5} /></div>
    </section>
  );
  if (state.error) return <EmptyState title={state.error.status === 404 ? 'Producto no encontrado' : 'No pudimos cargar la información.'}
    description={state.error.status === 404 ? 'Este producto no está disponible en nuestro catálogo.' : 'Revisa tu conexión e inténtalo otra vez.'}
    actionLabel="Reintentar" onAction={() => setAttempt((value) => value + 1)} />;
  if (!state.product) return <EmptyState title="Producto no encontrado" description="Explora nuestras colecciones para encontrar otros productos." />;
  return <ProductPurchase product={state.product} />;
}

function ProductPurchase({ product }) {
  const { items, addItem, openCart } = useCart();
  const [variantId, setVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const selectionRef = useRef(null);
  const variants = product.variants || [];
  const selected = variants.find((variant) => variant.id === variantId);
  const soldOut = !variants.some((variant) => variant.availableStock > 0);
  const inCart = items.find((item) => item.variantId === variantId)?.quantity || 0;
  const remaining = Math.max(0, (selected?.availableStock || 0) - inCart);
  const effectiveQuantity = Math.min(quantity, Math.max(1, remaining));
  const price = selected?.salePrice ?? (variants.length ? Math.min(...variants.map((variant) => variant.salePrice)) : 0);
  const message = `Hola, quiero consultar por ${product.name}${selected ? `, talla ${selected.size}, color ${selected.color}` : ''}. ${window.location.href}`;
  const whatsappUrl = `${STORE_CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;

  function handleAdd() {
    if (!selected) {
      setError('Elige una talla y color antes de agregar al carrito.');
      selectionRef.current?.querySelector('button:not(:disabled)')?.focus();
      selectionRef.current?.scrollIntoView({ block: 'center' });
      return;
    }
    if (remaining <= 0) return;
    addItem(selected.id, effectiveQuantity);
    setError('');
    setQuantity(1);
    openCart();
  }

  const buttonText = soldOut ? 'Agotado' : selected && remaining === 0 ? 'Máximo en el carrito' : 'Agregar al carrito';
  const disabled = soldOut || Boolean(selected && remaining === 0);
  return (
    <section className="max-w-6xl mx-auto pb-24 lg:pb-0 space-y-6">
      <Link to="/catalogo" className="btn btn-ghost min-h-11 px-3 text-sm">Volver al catálogo</Link>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-7">
          <ProductImage src={product.images?.[0]} alt={product.name} loading="eager" className="aspect-[3/4] rounded-3xl" />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="badge badge-neutral">{product.category}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-bold" aria-live="polite">{!selected && new Set(variants.map((variant) => variant.salePrice)).size > 1 && <span className="text-sm font-normal">Desde </span>}{formatCurrency(price)}</p>
          </div>
          <div ref={selectionRef}>
            <SizeSelector variants={variants} value={variantId} error={error} onChange={(id) => { setVariantId(id); setQuantity(1); setError(''); }} />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold">Cantidad</p>
            <QuantitySelector value={effectiveQuantity} max={remaining} disabled={!selected || remaining === 0} onChange={setQuantity} />
            <div aria-live="polite" className="text-sm text-gray-500">
              {soldOut ? <p className="text-rose">Este producto está agotado en todas sus tallas. Consúltanos por WhatsApp.</p>
                : selected ? <><p>{remaining === 0 ? 'Ya tienes todas las unidades disponibles en tu carrito.' : `${remaining} unidades disponibles para agregar.`}</p>{selected.availableStock <= 3 && <span className="badge badge-amber mt-2">Últimas {selected.availableStock} unidades</span>}</>
                  : <p>Selecciona tu talla para ver la disponibilidad.</p>}
            </div>
          </div>
          <div className="space-y-3">
            <button type="button" onClick={handleAdd} disabled={disabled} className="btn btn-primary btn-lg w-full"><ShoppingBag size={18} aria-hidden="true" />{buttonText}</button>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-success btn-lg w-full min-h-11"><MessageCircle size={18} aria-hidden="true" />Consultar por WhatsApp</a>
          </div>
          <div className="border-t border-gray-200 pt-6 space-y-2"><h2 className="text-base font-semibold">Sobre este producto</h2><p className="text-sm text-gray-600 leading-relaxed">{product.description}</p></div>
        </div>
      </div>
      <div className="store-purchase-bar">
        <div className="shrink-0"><span className="block text-xs text-gray-500">Precio</span><span className="text-lg font-bold">{formatCurrency(price)}</span></div>
        <button type="button" onClick={handleAdd} disabled={disabled} className="btn btn-primary min-h-11 px-3 py-3 text-xs flex-1">{buttonText}</button>
      </div>
    </section>
  );
}
