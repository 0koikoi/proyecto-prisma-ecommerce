import { motion, useReducedMotion } from 'motion/react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { formatCurrency } from '../utils/formatters';
import { getProductImages, getProductPrice, getProductStock } from '../utils/productUtils';

export function ProductCard({ product }) {
  const shouldReduceMotion = useReducedMotion();
  const stock = getProductStock(product);
  const image = getProductImages(product)[0];

  return (
    <motion.article
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors hover:border-gray-900 hover:shadow-md ${
        stock === 0 ? 'opacity-60' : ''
      }`}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <Link
        to={`/producto/${encodeURIComponent(product.slug)}`}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" aria-hidden="true" />
              <span className="sr-only">Imagen no disponible</span>
            </div>
          )}

          {stock > 0 && stock <= 3 && (
            <Badge variant="amber" className="absolute left-2 top-2">
              Últimas {stock} unidades
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="rose" className="absolute left-2 top-2">
              Agotado
            </Badge>
          )}
        </div>

        <div className="space-y-2 p-3 sm:p-4">
          <Badge variant="neutral" className="max-w-full truncate">
            {product.category}
          </Badge>
          <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-primary">
            {product.name}
          </h2>
          <p className="text-sm font-bold text-primary">{formatCurrency(getProductPrice(product))}</p>
        </div>
      </Link>
    </motion.article>
  );
}
