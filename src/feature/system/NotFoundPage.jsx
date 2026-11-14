import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../../shared/components';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="max-w-2xl mx-auto py-8 space-y-6">
      <div>
        <span className="text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase">
          Error 404
        </span>
        <h1 className="page-title mt-1">Página no encontrada</h1>
      </div>

      <EmptyState
        icon={Compass}
        title="No encontramos la página que buscas"
        description="Es posible que el enlace haya cambiado o que la dirección no exista en Tienda Prisma."
        actionLabel="Volver al inicio"
        onAction={() => navigate('/')}
      />
    </section>
  );
}
