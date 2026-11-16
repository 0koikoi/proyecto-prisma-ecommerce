import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { EmptyState } from '../../shared/components';
import { OrderCustomerInfo, OrderItems } from '../../shared/components/OrderDetails';
import { buildWhatsAppUrl } from '../../shared/constants/store';
import { orderService } from './services/orderService';

export function OrderConfirmationPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('codigo') || location.state?.code || '';

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(code));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return undefined;
    let isCurrentRequest = true;
    setIsLoading(true);
    setError(null);

    orderService
      .getOrderByCode(code)
      .then((loaded) => {
        if (isCurrentRequest) setOrder(loaded);
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
  }, [code]);

  if (!code || error) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <EmptyState
          title="No encontramos tu pedido"
          description={
            code
              ? `No pudimos cargar el pedido ${code}. Revisa el código o consulta su estado.`
              : 'Aún no registraste ningún pedido.'
          }
        />
        <div className="text-center">
          <Link to="/catalogo" className="btn btn-primary btn-lg">
            Ir al catálogo
          </Link>
        </div>
      </section>
    );
  }

  if (isLoading || !order) {
    return (
      <section className="mx-auto max-w-3xl space-y-4" aria-busy="true">
        <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </section>
    );
  }

  const whatsappMessage = `Hola, acabo de realizar el pedido ${order.code}. Quiero enviar mi comprobante de pago / coordinar la entrega.`;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="content-card flex flex-col items-center gap-3 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-soft">
          <CheckCircle2 className="h-9 w-9 text-emerald" aria-hidden="true" />
        </span>
        <h1 className="page-title">¡Pedido recibido!</h1>
        <p className="page-subtitle">Guarda tu código para consultar el estado de tu pedido.</p>
        <p
          className="rounded-xl border border-emerald-border bg-emerald-soft px-5 py-3 font-mono text-xl font-extrabold tracking-wider text-emerald-text"
          aria-label={`Código de pedido ${order.code}`}
        >
          {order.code}
        </p>
      </div>

      <div className="content-card space-y-6">
        <OrderCustomerInfo order={order} />
        <OrderItems order={order} />
      </div>

      <div className="content-card space-y-3 border-emerald-border bg-emerald-soft/40">
        <h2 className="text-sm font-bold text-primary">Siguientes pasos</h2>
        <p className="text-sm text-gray-600">
          Envíanos tu comprobante de pago o coordina la entrega con nosotros por WhatsApp
          indicando tu código de pedido.
        </p>
        <a
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success btn-lg w-full sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Escribir por WhatsApp
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/catalogo" className="btn btn-outline btn-lg flex-1">
          Seguir comprando
        </Link>
        <Link to={`/pedido/${encodeURIComponent(order.code)}`} className="btn btn-primary btn-lg flex-1">
          Ver estado del pedido
        </Link>
      </div>
    </section>
  );
}
