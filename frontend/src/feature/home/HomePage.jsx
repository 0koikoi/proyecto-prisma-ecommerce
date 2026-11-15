import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  ArrowRight,
  CreditCard,
  HeartHandshake,
  MessageCircle,
  PawPrint,
  Shirt,
  Sparkles,
  Truck,
} from 'lucide-react';
import { catalogService } from '../catalog/services/catalogService';
import { Badge, ProductCard } from '../../shared/components';
import { STORE_CONTACT, STORE_LINES } from '../../shared/constants/storeLines';

const NEW_ARRIVALS_LIMIT = 8;

const COLLECTION_DETAILS = {
  FEMENINA: {
    eyebrow: 'Tendencia & Estilo',
    description:
      'Blusas, vestidos, conjuntos sastre y prendas versátiles diseñadas para destacar en cada ocasión.',
    highlights: ['Blusas y tops', 'Vestidos midi', 'Conjuntos y sastrería'],
    icon: Sparkles,
    gradientClass: 'bg-gradient-to-br from-purple-soft via-white to-secondary/50',
  },
  URBANA: {
    eyebrow: 'Streetwear & Confort',
    description:
      'Poleras oversize, polos boxy fit, joggers cargo y casacas cortaviento con cortes modernos.',
    highlights: ['Poleras oversize', 'Polos algodón pesado', 'Joggers y casacas'],
    icon: Shirt,
    gradientClass: 'bg-gradient-to-br from-bg via-white to-secondary/60',
  },
  MASCOTAS: {
    eyebrow: 'Cuidado & Paseo',
    description:
      'Ropa térmica, impermeables, arneses antitirones y camas relajantes para consentir a tu compañero.',
    highlights: ['Abrigos y poleras', 'Arneses de paseo', 'Camas descanso'],
    icon: PawPrint,
    gradientClass: 'bg-gradient-to-br from-cyan-soft via-white to-secondary/50',
  },
};

function NewArrivalsSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        aria-label="Cargando novedades"
        aria-busy="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white"
          >
            <div className="aspect-[3/4] w-full">
              <Skeleton height="100%" containerClassName="block h-full w-full leading-none" />
            </div>
            <div className="space-y-2.5 p-3 sm:p-4">
              <Skeleton width={80} height={20} borderRadius={9999} />
              <Skeleton count={2} height={16} />
              <Skeleton width="50%" height={20} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [newProducts, setNewProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);

    catalogService
      .getProducts({ sort: 'newest' })
      .then((products) => {
        if (isCurrentRequest && Array.isArray(products)) {
          setNewProducts(products.slice(0, NEW_ARRIVALS_LIMIT));
        }
      })
      .catch(() => {
        // Manejo silencioso si ocurre un error o no hay novedades disponibles
        if (isCurrentRequest) {
          setNewProducts([]);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const whatsappMessage = encodeURIComponent(
    'Hola Tienda Prisma, vengo desde la tienda web y quisiera consultar por sus productos disponibles.',
  );
  const whatsappDirectUrl = `${STORE_CONTACT.whatsappUrl}?text=${whatsappMessage}`;

  return (
    <div className="space-y-12 sm:space-y-16 pb-6">
      {/* 1. Sección Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-[#f5f5f5] via-white to-[#d6efff] p-6 sm:p-10 lg:p-14 shadow-sm"
      >
        <div className="max-w-3xl space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase">
              Tienda Prisma · Nueva Temporada
            </p>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary"
            >
              Estilo que se adapta a tu ritmo todos los días
            </h1>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl leading-relaxed">
              Descubre nuestras colecciones de{' '}
              <strong className="font-semibold text-primary">Moda Femenina</strong>,{' '}
              <strong className="font-semibold text-primary">Moda Urbana</strong> y accesorios
              para <strong className="font-semibold text-primary">Mascotas</strong>. Compra
              fácil y recibe tu pedido en Huánuco o en cualquier ciudad del Perú.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <Link
              to="/catalogo"
              className="btn btn-primary btn-lg w-full sm:w-auto"
            >
              <span>Ver catálogo</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {STORE_LINES.map((line) => (
              <Badge key={line.id} variant={line.badgeVariant}>
                {line.fullName}
              </Badge>
            ))}
            <Badge variant="ice">Envíos a todo el Perú</Badge>
          </div>
        </div>
      </section>

      {/* 2. Tarjetas de Colección (3 Líneas) */}
      <section aria-labelledby="collections-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase">
              Líneas de negocio
            </p>
            <h2 id="collections-heading" className="text-xl font-semibold tracking-tight mt-1">
              Explora nuestras colecciones
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Elige una línea para ver sus prendas y accesorios disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STORE_LINES.map((line) => {
            const detail = COLLECTION_DETAILS[line.id] || COLLECTION_DETAILS.URBANA;
            const IconComponent = detail.icon;

            return (
              <motion.article
                key={line.id}
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="h-full"
              >
                <Link
                  to={`/catalogo/${line.slug}`}
                  aria-label={`Explorar colección ${line.fullName}`}
                  className={`group flex h-full flex-col justify-between rounded-3xl border border-gray-200/80 ${detail.gradientClass} p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-gray-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-secondary`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={line.badgeVariant}>{detail.eyebrow}</Badge>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-secondary shadow-sm">
                        <IconComponent className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold tracking-tight text-primary">
                        {line.fullName}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {detail.description}
                      </p>
                    </div>

                    <ul className="flex flex-wrap gap-1.5 pt-1" aria-label={`Categorías de ${line.fullName}`}>
                      {detail.highlights.map((item) => (
                        <li
                          key={item}
                          className="rounded-xl border border-gray-200/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex min-h-11 items-center justify-between border-t border-gray-200/70 pt-4 text-sm font-bold text-primary">
                    <span>Explorar {line.label}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-gray-200/80 transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 3. Sección de Novedades (manejo silencioso si no hay novedades) */}
      {(isLoading || newProducts.length > 0) && (
        <section aria-labelledby="new-arrivals-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase">
                Recién llegados
              </p>
              <h2
                id="new-arrivals-heading"
                className="text-xl font-semibold tracking-tight mt-1"
              >
                Novedades de la tienda
              </h2>
            </div>

            <Link
              to="/catalogo"
              className="btn btn-outline btn-md w-full sm:w-auto"
            >
              <span>Ver todo el catálogo</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {isLoading ? (
            <NewArrivalsSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {newProducts.map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Bloque de Confianza y Beneficios */}
      <section aria-labelledby="trust-heading" className="space-y-6">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase">
            Compra con tranquilidad
          </p>
          <h2 id="trust-heading" className="text-xl font-semibold tracking-tight mt-1">
            Beneficios y canales de atención
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Envíos a todo el Perú */}
          <article className="content-card flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Truck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary">
                Envíos a todo el Perú
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Realizamos entregas locales rápidas en{' '}
                <strong className="font-semibold text-primary">Huánuco</strong> ({STORE_CONTACT.address}) y
                envíos nacionales a todas las provincias del Perú mediante agencia.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="emerald">Entrega local Huánuco</Badge>
              <Badge variant="cyan">Envíos nacionales</Badge>
            </div>
          </article>

          {/* Medios de pago */}
          <article className="content-card flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <CreditCard className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary">
                Medios de pago flexibles
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Elige cómo pagar al finalizar tu pedido. Aceptamos billeteras digitales,
                tarjetas y pago en efectivo para entregas locales.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2" aria-label="Métodos de pago aceptados">
              {STORE_CONTACT.paymentMethods.map((method) => (
                <Badge key={method} variant="neutral">
                  {method}
                </Badge>
              ))}
            </div>
          </article>

          {/* Canal directo por WhatsApp */}
          <article className="content-card flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-soft text-emerald-text">
                <HeartHandshake className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary">
                Atención directa por WhatsApp
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                ¿Tienes dudas sobre tallas, medidas o tiempos de envío? Nuestro equipo te
                asesora en tiempo real por WhatsApp ({STORE_CONTACT.whatsapp}).
              </p>
            </div>

            <div className="pt-2">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success btn-lg w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
