import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { EmptyState } from '../../shared/components';
import { ProductCard } from '../../shared/components/ProductCard';
import { Badge } from '../../shared/components/Badge';
import { formatCurrency } from '../../shared/utils/formatters';
import { getProductImages, getProductPrice } from '../../shared/utils/productUtils';
import { catalogService } from './services/catalogService';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedError, setRelatedError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError(null);
    setRelatedError(null);
    setRelatedProducts([]);
    setSelectedImage(0);

    async function loadProduct() {
      try {
        const loadedProduct = await catalogService.getProductBySlug(slug);
        if (!isCurrentRequest) return;
        setProduct(loadedProduct);
        setIsLoading(false);

        try {
          const products = await catalogService.getProducts({ line: loadedProduct.line });
          if (!isCurrentRequest) return;
          const sameCategory = products.filter(
            (item) => item.slug !== loadedProduct.slug && item.category === loadedProduct.category,
          );
          const related = [
            ...sameCategory,
            ...products.filter(
              (item) =>
                item.slug !== loadedProduct.slug &&
                item.line === loadedProduct.line &&
                !sameCategory.some((categoryItem) => categoryItem.slug === item.slug),
            ),
          ];
          setRelatedProducts(related.slice(0, 4));
        } catch (relatedRequestError) {
          if (isCurrentRequest) setRelatedError(relatedRequestError);
        }
      } catch (requestError) {
        if (isCurrentRequest) setError(requestError);
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    loadProduct();

    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey, slug]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl space-y-6" aria-busy="true">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200 lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-9 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    const isNotFound = error?.status === 404;
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <EmptyState
          title={isNotFound ? 'No encontramos este producto' : 'No pudimos cargar el producto'}
          description={
            isNotFound
              ? 'Es posible que el producto ya no esté disponible.'
              : error?.message || 'Revisa tu conexión e inténtalo nuevamente.'
          }
          actionLabel={isNotFound ? 'Volver al catálogo' : 'Reintentar'}
          onAction={() =>
            isNotFound ? navigate('/catalogo') : setReloadKey((key) => key + 1)
          }
        />
      </section>
    );
  }

  const images = getProductImages(product);
  const displayImages = images.length ? images : [null];
  const prices = (product.variants || [])
    .map((variant) => Number(variant.salePrice))
    .filter(Number.isFinite);
  const hasVariablePrice = new Set(prices).size > 1;
  const catalogPath = product.line ? `/catalogo/${product.line.toLowerCase()}` : '/catalogo';

  return (
    <section className="mx-auto max-w-6xl space-y-10">
      <Link
        to={catalogPath}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a {product.line || 'catálogo'}
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
            {displayImages[selectedImage] ? (
              <img
                src={displayImages[selectedImage]}
                alt={`${product.name} - imagen ${selectedImage + 1}`}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                <Package className="h-16 w-16" aria-hidden="true" />
                <span className="text-sm font-medium">Imagen no disponible</span>
              </div>
            )}
          </div>

          <div
            className="flex gap-3 overflow-x-auto pb-2"
            aria-label="Miniaturas del producto"
          >
            {displayImages.map((image, index) => (
              <button
                key={`${image || 'placeholder'}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                aria-pressed={selectedImage === index}
                className={`relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-gray-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary sm:w-24 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="absolute inset-0 m-auto h-7 w-7 text-gray-400" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <Badge variant="neutral">{product.category}</Badge>
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{product.name}</h1>
            <p className="text-2xl font-bold">
              {hasVariablePrice && (
                <>
                  <span className="mr-1 text-sm font-medium text-gray-500">Desde</span>{' '}
                </>
              )}
              {formatCurrency(getProductPrice(product))}
            </p>
          </div>
          {product.description && (
            <p className="border-t border-gray-200 pt-5 text-sm leading-7 text-gray-600">
              {product.description}
            </p>
          )}
          <div className="border-t border-gray-200 pt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Línea</p>
            <p className="mt-1 text-sm font-semibold">{product.line}</p>
          </div>
        </div>
      </div>

      {(relatedProducts.length > 0 || relatedError) && (
        <section className="space-y-5 border-t border-gray-200 pt-8" aria-labelledby="related-title">
          <div>
            <h2 id="related-title" className="text-xl font-bold">
              Productos relacionados
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Más opciones de {product.category || product.line}.
            </p>
          </div>
          {relatedError ? (
            <p className="text-sm text-rose" role="status">
              No pudimos cargar los productos relacionados: {relatedError.message}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id || relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  );
}
