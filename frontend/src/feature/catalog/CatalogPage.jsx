import { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalogService } from './services/catalogService';
import { ProductCard } from '../../shared/components/ProductCard';
import { Button, EmptyState } from '../../shared/components';
import { STORE_LINES } from '../../shared/constants/storeLines';

const PAGE_SIZE = 8;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

function getLineFromSlug(slug) {
  return STORE_LINES.find((line) => line.slug === slug);
}

function CatalogGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="Cargando productos"
      aria-busy="true"
    >
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="aspect-[3/4] animate-pulse bg-gray-200" />
          <div className="space-y-3 p-3 sm:p-4">
            <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CatalogFilters({
  selectedLine,
  categories,
  sizes,
  category,
  size,
  onLineChange,
  onCategoryChange,
  onSizeChange,
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-700">
          Línea
        </legend>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          <button
            type="button"
            onClick={() => onLineChange('')}
            aria-pressed={!selectedLine}
            className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary ${
              !selectedLine
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 hover:border-gray-900'
            }`}
          >
            Todas las líneas
          </button>
          {STORE_LINES.map((line) => (
            <button
              key={line.id}
              type="button"
              onClick={() => onLineChange(line.id)}
              aria-pressed={selectedLine === line.id}
              className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary ${
                selectedLine === line.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              {line.fullName}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-700">
          Categoría
        </legend>
        <div className="flex flex-wrap gap-2">
          {categories.length ? (
            categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onCategoryChange(category === item ? '' : item)}
                aria-pressed={category === item}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary ${
                  category === item
                    ? 'border-primary bg-secondary'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
              >
                {item}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay categorías disponibles.</p>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-700">
          Talla
        </legend>
        <div className="flex flex-wrap gap-2">
          {sizes.length ? (
            sizes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSizeChange(size === item ? '' : item)}
                aria-pressed={size === item}
                className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary ${
                  size === item
                    ? 'border-primary bg-secondary'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
              >
                {item}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay tallas disponibles.</p>
          )}
        </div>
      </fieldset>
    </div>
  );
}

export function CatalogPage() {
  const { linea } = useParams();
  const navigate = useNavigate();
  const selectedLine = getLineFromSlug(linea)?.id || '';
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [sort, setSort] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError(null);

    catalogService
      .getProducts({ line: selectedLine || undefined, sort })
      .then((result) => {
        if (isCurrentRequest) setProducts(result);
      })
      .catch((requestError) => {
        if (isCurrentRequest) setError(requestError);
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey, selectedLine, sort]);

  useEffect(() => {
    setCategory('');
    setSize('');
    setVisibleCount(PAGE_SIZE);
  }, [linea]);

  useEffect(() => {
    if (!isMobileFiltersOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') setIsMobileFiltersOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMobileFiltersOpen]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products],
  );
  const sizes = useMemo(() => {
    const categoryProducts = category
      ? products.filter((product) => product.category === category)
      : products;
    return [
      ...new Set(
        categoryProducts.flatMap((product) =>
          (product.variants || []).map((variant) => variant.size).filter(Boolean),
        ),
      ),
    ].sort((first, second) => first.localeCompare(second, 'es'));
  }, [category, products]);
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (!category || product.category === category) &&
          (!size ||
            (product.variants || []).some(
              (variant) => String(variant.size).toLowerCase() === size.toLowerCase(),
            )),
      ),
    [category, products, size],
  );
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const activeFilters = [
    ...(selectedLine ? [{ type: 'line', label: getLineFromSlug(linea)?.fullName }] : []),
    ...(category ? [{ type: 'category', label: category }] : []),
    ...(size ? [{ type: 'size', label: `Talla ${size}` }] : []),
  ];

  function changeLine(lineId) {
    const line = STORE_LINES.find((item) => item.id === lineId);
    navigate(line ? `/catalogo/${line.slug}` : '/catalogo');
    setCategory('');
    setSize('');
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setCategory('');
    setSize('');
    setVisibleCount(PAGE_SIZE);
    if (selectedLine) navigate('/catalogo');
  }

  function removeFilter(type) {
    if (type === 'line') {
      changeLine('');
    } else if (type === 'category') {
      setCategory('');
      setSize('');
    } else {
      setSize('');
    }
    setVisibleCount(PAGE_SIZE);
  }

  const filterProps = {
    selectedLine,
    categories,
    sizes,
    category,
    size,
    onLineChange: changeLine,
    onCategoryChange: (value) => {
      setCategory(value);
      setSize('');
      setVisibleCount(PAGE_SIZE);
    },
    onSizeChange: (value) => {
      setSize(value);
      setVisibleCount(PAGE_SIZE);
    },
  };
  const lineTitle = getLineFromSlug(linea)?.fullName;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">{lineTitle || 'Catálogo'}</h1>
          <p className="page-subtitle mt-1" aria-live="polite">
            {isLoading
              ? 'Cargando productos…'
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? 'producto' : 'productos'
                }`}
          </p>
        </div>
        <label className="flex min-h-11 items-center gap-2 self-start rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium sm:self-auto">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span className="sr-only">Ordenar productos</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="min-h-11 bg-transparent pr-1 text-sm focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.type}
              className="inline-flex min-h-9 items-center gap-1 rounded-full border border-secondary-strong bg-secondary px-3 text-xs font-semibold"
            >
              {filter.label}
              <button
                type="button"
                onClick={() => removeFilter(filter.type)}
                aria-label={`Quitar filtro: ${filter.label}`}
                className="rounded-full p-1 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-9 rounded-lg px-2 text-xs font-bold text-gray-600 underline underline-offset-2 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="content-card hidden h-fit w-[260px] shrink-0 p-5 lg:block">
          <h2 className="mb-5 text-sm font-extrabold uppercase tracking-wider">Filtros</h2>
          <CatalogFilters {...filterProps} />
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          {isLoading ? (
            <CatalogGridSkeleton />
          ) : error ? (
            <EmptyState
              title="No pudimos cargar los productos"
              description={error.message || 'Revisa tu conexión e inténtalo nuevamente.'}
              actionLabel="Reintentar"
              onAction={() => setReloadKey((key) => key + 1)}
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="No encontramos productos."
              description="Prueba con otros filtros o restablece la selección."
              icon={Filter}
              actionLabel="Limpiar filtros"
              onAction={clearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id || product.slug} product={product} />
                ))}
              </div>
              {visibleCount < filteredProducts.length && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  >
                    Ver más
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsMobileFiltersOpen(true)}
        aria-expanded={isMobileFiltersOpen}
        aria-controls="mobile-catalog-filters"
        className="btn btn-primary btn-lg fixed bottom-5 left-1/2 z-30 -translate-x-1/2 shadow-lg lg:hidden"
      >
        <Filter className="h-4 w-4" aria-hidden="true" />
        Filtros
      </button>

      {isMobileFiltersOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setIsMobileFiltersOpen(false)}
            className="sidebar-backdrop border-0 p-0"
          />
          <aside
            id="mobile-catalog-filters"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-catalog-filters-title"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl lg:hidden"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="mobile-catalog-filters-title" className="text-lg font-bold">
                Filtros
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Cerrar filtros"
                className="btn btn-ghost btn-sm min-h-11 min-w-11"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <CatalogFilters {...filterProps} />
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Limpiar
              </Button>
              <Button className="flex-1" onClick={() => setIsMobileFiltersOpen(false)}>
                Ver {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </Button>
            </div>
          </aside>
        </>
      )}
    </section>
  );
}
