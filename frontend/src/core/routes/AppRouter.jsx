import { HashRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../../shared/components';
import { HomePage } from '../../feature/home';
import { CatalogPage, ProductDetailPage } from '../../feature/catalog';
import { CheckoutPage, OrderConfirmationPage } from '../../feature/checkout';
import { OrderTrackingPage } from '../../feature/tracking';
import { NotFoundPage } from '../../feature/system';

/**
 * NOTA DE DESPLIEGUE:
 * Se usa `HashRouter` para que el proyecto funcione directamente como sitio estático
 * sin requerir configuración de reescritura en el servidor.
 *
 * Para pasar a `BrowserRouter` cuando se despliegue con un servidor o CDN que soporte
 * fallback a `index.html` (por ejemplo Nginx `try_files $uri /index.html` o reglas SPA):
 * 1. Reemplazar `HashRouter` por `BrowserRouter` en el import de `react-router-dom`.
 * 2. Cambiar `<HashRouter>` por `<BrowserRouter>` en el retorno de `AppRouter`.
 */
export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* M1. Portada */}
          <Route path="/" element={<HomePage />} />

          {/* M2. Catálogo */}
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/catalogo/:linea" element={<CatalogPage />} />

          {/* M3. Detalle de producto */}
          <Route path="/producto/:slug" element={<ProductDetailPage />} />

          {/* M5. Checkout */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* M6. Confirmación de pedido */}
          <Route path="/checkout/confirmacion" element={<OrderConfirmationPage />} />

          {/* M7. Seguimiento de pedido */}
          <Route path="/pedido/:codigo" element={<OrderTrackingPage />} />

          {/* M9. Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
