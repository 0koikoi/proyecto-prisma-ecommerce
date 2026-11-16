import { useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CornerDownLeft,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { catalogService } from '../../feature/catalog/services/catalogService';
import { STORE_LINES } from '../constants/storeLines';
import { formatCurrency } from '../utils/formatters';
import { getProductImages, getProductPrice, getProductStock } from '../utils/productUtils';
import { Badge } from './Badge';
import { Button } from './Button';

const SEARCH_DEBOUNCE_MS = 250;

function isEditableElement(element) {
  if (!element) return false;
  const tagName = element.tagName;
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    element.isContentEditable
  );
}

function SearchResultsSkeleton() {
  return (
    <div
      className="space-y-2 p-2"
      aria-label="Buscando productos"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3.5 rounded-xl border border-gray-100 p-2.5"
        >
          <div className="aspect-[3/4] w-12 shrink-0 animate-pulse rounded-xl bg-gray-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-16 shrink-0 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export function SearchPalette({ isOpen, onOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const trimmedQuery = query.trim();

  // Atajo global "/" para abrir y "Escape" para cerrar
  useEffect(() => {
    function handleGlobalKeyDown(event) {
      if (event.key === '/' && !isOpen) {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          isEditableElement( document.activeElement )
        ) {
          return;
        }
        event.preventDefault();
        onOpen?.();
        return;
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        onClose?.();
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onOpen, onClose]);

  // Enfocar el input al abrir y limpiar estado al cerrar
  useEffect(() => {
    if (isOpen) {
      const frameId = window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setQuery('');
    setResults([]);
    setIsLoading(false);
    setError(null);
    return undefined;
  }, [isOpen]);

  // Búsqueda interactiva en tiempo real con debounce
  useEffect(() => {
    if (!isOpen) return undefined;

    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    let isCurrentRequest = true;
    setIsLoading(true);
    setError(null);

    const timerId = window.setTimeout(() => {
      catalogService
        .getProducts({ search: trimmedQuery })
        .then((data) => {
          if (isCurrentRequest) {
            setResults(Array.isArray(data) ? data : []);
          }
        })
        .catch((requestError) => {
          if (isCurrentRequest) {
            setError(requestError);
          }
        })
        .finally(() => {
          if (isCurrentRequest) {
            setIsLoading(false);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timerId);
    };
  }, [isOpen, trimmedQuery, reloadKey]);

  if (!isOpen) return null;

  function handleNavigate(path) {
    onClose?.();
    navigate(path);
  }

  return (
    <div
      className="modal-overlay items-start pt-14 sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-label="Buscador global de productos"
      onClick={onClose}
    >
      <div
        className="modal-content max-w-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Command
          label="Buscador global de productos"
          shouldFilter={false}
          loop
          className="flex flex-col"
        >
          {/* Cabecera con campo de búsqueda */}
          <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />

            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Buscar por nombre o categoría (ej. polera, blusa, mascotas)..."
              aria-label="Buscar productos por nombre o categoría"
              className="input-element flex-1"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Limpiar texto de búsqueda"
                className="btn btn-ghost btn-sm min-h-11 min-w-11 p-2 rounded-xl text-gray-500 hover:text-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar buscador"
              className="btn btn-outline btn-sm min-h-11 sm:min-h-8 px-2.5 py-1 text-[11px] font-bold text-gray-600"
            >
              Esc
            </button>
          </div>

          {/* Lista de sugerencias o resultados */}
          <Command.List className="max-h-[65vh] overflow-y-auto p-3 sm:max-h-[420px]">
            {!trimmedQuery ? (
              <Command.Group
                heading={
                  <span className="block px-2 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500">
                    Sugerencias rápidas por línea
                  </span>
                }
              >
                <div className="space-y-1.5">
                  {STORE_LINES.map((line) => (
                    <Command.Item
                      key={line.id}
                      value={`linea-${line.slug}`}
                      onSelect={() => handleNavigate(`/catalogo/${line.slug}`)}
                      className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-surface-hover data-[selected=true]:border-secondary-strong data-[selected=true]:bg-secondary/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-primary">
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {line.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Explorar colección {line.label.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={line.badgeVariant}>{line.label}</Badge>
                        <ArrowRight
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </Command.Item>
                  ))}

                  <Command.Item
                    value="catalogo-completo"
                    onSelect={() => handleNavigate('/catalogo')}
                    className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-surface-hover data-[selected=true]:border-secondary-strong data-[selected=true]:bg-secondary/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary">
                        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          Ver todo el catálogo
                        </p>
                        <p className="text-xs text-gray-500">
                          Todas las prendas y accesorios disponibles
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </Command.Item>
                </div>
              </Command.Group>
            ) : isLoading ? (
              <Command.Loading label="Buscando productos">
                <SearchResultsSkeleton />
              </Command.Loading>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <Package className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-primary">
                    No pudimos cargar la información.
                  </p>
                  <p className="text-xs text-gray-500">
                    {error.message || 'Revisa tu conexión e inténtalo nuevamente.'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setReloadKey((current) => current + 1)}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reintentar
                </Button>
              </div>
            ) : results.length === 0 ? (
              <Command.Empty className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-primary">
                    No encontramos productos. Prueba con otros filtros.
                  </p>
                  <p className="text-xs text-gray-500">
                    Sin coincidencias para &ldquo;{trimmedQuery}&rdquo; en nombres o categorías.
                  </p>
                </div>
              </Command.Empty>
            ) : (
              <Command.Group
                heading={
                  <span className="block px-2 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-500">
                    Resultados ({results.length})
                  </span>
                }
              >
                <div className="space-y-1.5">
                  {results.map((product) => {
                    const image = getProductImages(product)[0];
                    const price = getProductPrice(product);
                    const stock = getProductStock(product);

                    return (
                      <Command.Item
                        key={product.id || product.slug}
                        value={`${product.name} ${product.category} ${product.slug}`}
                        onSelect={() =>
                          handleNavigate(`/producto/${encodeURIComponent(product.slug)}`)
                        }
                        className={`flex min-h-16 cursor-pointer items-center justify-between gap-3.5 rounded-xl border border-transparent p-2.5 transition-colors hover:bg-surface-hover data-[selected=true]:border-secondary-strong data-[selected=true]:bg-secondary/60 ${
                          stock === 0 ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200/80 bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge variant="neutral" className="truncate">
                                {product.category}
                              </Badge>
                              {stock > 0 && stock <= 3 && (
                                <Badge variant="amber">
                                  Últimas {stock} unidades
                                </Badge>
                              )}
                              {stock === 0 && (
                                <Badge variant="rose">Agotado</Badge>
                              )}
                            </div>
                            <p className="truncate text-sm font-semibold text-primary">
                              {product.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5 pl-2">
                          <span className="text-sm font-extrabold tracking-tight text-primary">
                            {formatCurrency(price)}
                          </span>
                          <CornerDownLeft
                            className="hidden h-4 w-4 text-gray-400 sm:block"
                            aria-hidden="true"
                          />
                        </div>
                      </Command.Item>
                    );
                  })}
                </div>
              </Command.Group>
            )}
          </Command.List>

          {/* Pie informativo de atajos de teclado */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-bg/60 px-4 py-2.5 text-xs text-gray-500">
            <div className="hidden items-center gap-3 sm:flex">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                  ↑
                </kbd>
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                  ↓
                </kbd>
                <span>Navegar</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                  Enter
                </kbd>
                <span>Seleccionar</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                  Esc
                </kbd>
                <span>Cerrar</span>
              </span>
            </div>
            <span className="sm:ml-auto">
              Atajo rápido:{' '}
              <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                /
              </kbd>
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

