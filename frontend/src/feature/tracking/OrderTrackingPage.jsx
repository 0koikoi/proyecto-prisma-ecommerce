import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Truck } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Badge, Button, EmptyState, Input } from '../../shared/components';
import { OrderCustomerInfo, OrderItems } from '../../shared/components/OrderDetails';
import { ORDER_STATUS } from '../../shared/constants/orders';
import { formatDate } from '../../shared/utils/formatters';
import { orderService } from '../checkout';
import { OrderTimeline } from './components/OrderTimeline';

function TrackingSearch({ initialCode = '' }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialCode);

  function handleSubmit(event) {
    event.preventDefault();
    const code = value.trim().toUpperCase();
    if (code) navigate(`/pedido/${encodeURIComponent(code)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end" role="search">
      <Input
        className="flex-1"
        label="Código de pedido"
        icon={Search}
        placeholder="WEB-2026-00001"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
      />
      <Button type="submit" size="lg" disabled={!value.trim()}>
        Buscar pedido
      </Button>
    </form>
  );
}

function TrackingSkeleton() {
  return (
    <div className="content-card space-y-4" aria-busy="true" aria-label="Cargando pedido">
      <Skeleton height={28} width="40%" />
      <Skeleton count={4} height={20} />
      <Skeleton height={120} />
    </div>
  );
}

export function OrderTrackingPage() {
  const { codigo } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(codigo));
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!codigo) return undefined;
    let isCurrentRequest = true;
    setIsLoading(true);
    setError(null);
    setOrder(null);

    orderService
      .getOrderByCode(codigo)
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
  }, [codigo, reloadKey]);

  const isNotFound = error?.status === 404;
  const status = order ? ORDER_STATUS[order.status] || ORDER_STATUS.PENDING : null;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="page-title">Seguimiento de pedido</h1>
        <p className="page-subtitle">Consulta el estado de tu pedido con tu código.</p>
      </div>

      <div className="content-card">
        <TrackingSearch key={codigo || 'empty'} initialCode={codigo || ''} />
      </div>

      {isLoading && <TrackingSkeleton />}

      {!isLoading && error && (
        <EmptyState
          title={isNotFound ? 'Pedido no encontrado' : 'No pudimos cargar tu pedido'}
          description={
            isNotFound
              ? `No existe un pedido con el código ${codigo}. Verifica el código e inténtalo de nuevo.`
              : 'Hubo un problema de conexión. Revisa tu red e inténtalo nuevamente.'
          }
          actionLabel="Reintentar"
          onAction={() => setReloadKey((prev) => prev + 1)}
        />
      )}

      {!isLoading && !error && !codigo && (
        <EmptyState
          title="Ingresa tu código de pedido"
          description="Lo encuentras en la pantalla de confirmación, con el formato WEB-2026-XXXXX."
        />
      )}

      {order && status && (
        <>
          <div className="content-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500">Pedido</p>
              <p className="font-mono text-lg font-extrabold text-primary">{order.code}</p>
              {order.createdAt && (
                <p className="text-xs text-gray-500">Realizado el {formatDate(order.createdAt)}</p>
              )}
            </div>
            <Badge variant={status.badge} className="text-sm">
              {status.label}
            </Badge>
          </div>

          <div className="content-card space-y-4">
            <h2 className="text-sm font-bold text-primary">Estado del pedido</h2>
            <OrderTimeline status={order.status} />
          </div>

          <div className="content-card space-y-6">
            <OrderItems order={order} />
            <OrderCustomerInfo order={order} />
            {(order.courier || order.trackingNumber) && (
              <div className="space-y-2">
                <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Datos de envío
                </h2>
                <dl className="space-y-1 text-sm">
                  {order.courier && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Courier</dt>
                      <dd className="font-medium text-primary">{order.courier}</dd>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">N° de tracking</dt>
                      <dd className="font-mono font-medium text-primary">{order.trackingNumber}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/catalogo" className="btn btn-outline btn-lg">
              Seguir comprando
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
