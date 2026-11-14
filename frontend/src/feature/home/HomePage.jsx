import { EmptyState } from '../../shared/components';

export function HomePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="page-title">Portada</h1>
      </div>
      <EmptyState title="Módulo en construcción" />
    </section>
  );
}
