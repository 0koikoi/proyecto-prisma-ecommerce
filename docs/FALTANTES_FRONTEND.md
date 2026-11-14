# Diagnóstico y Faltantes Detectadas del Frontend — Tienda Prisma

Este documento recopila las faltantes, elementos incompletos y siguientes pasos técnicos detectados tras el análisis comparativo entre la guía de requerimientos (`docs/ESTILO_ECOMMERCE.md`) y la base de código actual (`frontend/`).

---

## 1. Módulos y Pantallas de Negocio (Placeholders actuales)
La base incluye las rutas registradas con `EmptyState` ("Módulo en construcción"), pero están pendientes de implementación real:

- [ ] **M1. Portada (`frontend/src/feature/home/HomePage.jsx`)**:
  - Hero con gradiente de marca (`from-[#f5f5f5] via-white to-[#d6efff]`), eyebrow, título, subtítulo y CTA hacia catálogo.
  - Bloque de colecciones destacadas (3 tarjetas: Femenina, Urbana, Mascotas) con `rounded-3xl` e imágenes de fondo.
  - Grilla o carrusel de novedades consumiendo `catalogService.getProducts()`.
  - Bloque de confianza (envíos a todo el Perú, pagos locales/nacionales y atención vía WhatsApp).
- [ ] **M2. Catálogo (`frontend/src/feature/catalog/CatalogPage.jsx`)**:
  - Filtro interactivo por línea (`/catalogo/:linea`), categoría y talla.
  - Barra lateral de filtros en escritorio (260 px en `content-card`) y drawer móvil de filtros.
  - Selector de ordenamiento (más nuevos, precio menor/mayor).
  - Chips de filtros aplicados con acción individual para remover y botón de "Limpiar filtros".
  - Grilla de tarjetas responsive con botón "Ver más" (paginación por bloques).
- [ ] **M3. Detalle de Producto (`frontend/src/feature/catalog/ProductDetailPage.jsx`)**:
  - Galería visual (7/12 en escritorio con miniaturas y fotos en relación 3:4; carrusel en móvil).
  - Información comercial: nombre, categoría, precio destacado con `formatCurrency`.
  - Selector de variantes/tallas con feedback visual (chip activo, chip deshabilitado/tachado cuando stock = 0).
  - Selector de cantidad con límite según `availableStock`.
  - Barra de acción fija inferior en dispositivos móviles con CTA "Agregar al carrito" (`min-h-11`).
  - Botón de consulta directa por WhatsApp con enlace prearmado.
  - Bloque de productos relacionados de la misma línea.
- [ ] **M5. Checkout (`frontend/src/feature/checkout/CheckoutPage.jsx`)**:
  - Formulario con `react-hook-form` + validación `zod` y regex peruanas (`validators.js`).
  - Captura de datos: nombre del cliente, celular de 9 dígitos (`^9\d{8}$`), dirección, referencia opcional.
  - Selector de ámbito de entrega: `LOCAL` (Huánuco) o `NACIONAL`.
  - Selector visual de método de pago (chips: Yape, Plin, Tarjeta, Efectivo).
  - Columna de resumen de pedido con subtotal, cálculo/aviso de costo de envío y total.
  - Redirección automática al catálogo si el carrito está vacío.
- [ ] **M6. Confirmación (`frontend/src/feature/checkout/OrderConfirmationPage.jsx`)**:
  - Lectura del código de pedido generado (`WEB-2026-XXXXX`).
  - Resumen visual de artículos confirmados y datos de entrega.
  - Instrucciones claras para el pago/coordinación vía WhatsApp.
  - Botones "Seguir comprando" y "Ver estado del pedido".
- [ ] **M7. Seguimiento de Pedido (`frontend/src/feature/tracking/OrderTrackingPage.jsx`)**:
  - Búsqueda y consulta de pedido por código mediante `orderService.getOrderByCode(codigo)`.
  - Línea de tiempo con los estados definidos: `PENDING`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
  - Badges semánticos por estado (`badge-neutral`, `badge-amber`, `badge-cyan`, `badge-emerald`, `badge-rose`).
  - Información de courier y código de guía si existen.

---

## 2. Componentes UI Específicos Pendientes

- [ ] **`ProductCard` (`frontend/src/shared/components/` o `feature/catalog/components/`)**:
  - Contenedor con `aspect-[3/4]`, `loading="lazy"`, badge de stock (`badge-amber` si stock 1–3, `badge-rose` si agotado con opacidad al 60%).
  - Microinteracciones con `motion` (`whileHover={{ y: -2 }}`, `whileTap={{ scale: 0.96 }}`).
  - Integración con `CartContext` o navegación a `/producto/:slug`.
- [ ] **`SizeSelector`**:
  - Componente reutilizable para selección de talla/color con chip en estado activo (`bg-primary text-white`), inactivo y sin stock (`line-through cursor-not-allowed`).
- [ ] **`CartDrawer` (M4)**:
  - Drawer lateral deslizable con `sidebar-backdrop`.
  - Lista de productos agregados con miniatura, nombre, talla, control incremental `−` / `+`, botón para eliminar y cálculo de subtotal.
  - Integración para abrirlo desde el botón de bolsa en `Header` y desde cualquier CTA "Agregar al carrito".
- [ ] **Búsqueda rápida con `cmdk` (M8)**:
  - Modal o paleta de comandos activable desde el botón de lupa del `Header` o mediante atajo de teclado (`/`).
  - Listado de resultados instantáneos con foto miniatura, precio y enlace directo al producto.
- [ ] **Skeleton Loaders específicos**:
  - Diseñar skeletons con `react-loading-skeleton` para la tarjeta de producto (`ProductCardSkeleton`), el catálogo (`CatalogGridSkeleton`) y la ficha de detalle.

---

## 3. Integración y Backend

- [ ] **Contrato definitivo de API Pública**:
  - Reemplazar las rutas provisionales comentadas en `catalogService.js` y `orderService.js` (`/api/public/...`) por las rutas definitivas que el backend del e-commerce provea.
  - Definir si el cálculo del costo de envío se resuelve dinámicamente vía API antes de enviar la orden.
- [ ] **Imágenes de Producto**:
  - Configurar CDN, bucket de almacenamiento o rutas estáticas de fotos reales en relación de aspecto 3:4.
- [ ] **Pasarelas de Pago o Enlaces Directos**:
  - Integrar SDK de pagos (Niubiz/Izipay/Culqi) o generación de QR de Yape/Plin si el flujo comercial evoluciona más allá de la coordinación por WhatsApp.

---

## 4. Pruebas y Auditoría

- [ ] Pruebas responsive completas en viewport de 360 px (Android / iPhone) para validación de áreas táctiles mínimas de 44 px en formularios y selectores de talla.
- [ ] Auditoría de accesibilidad WCAG AA con Lighthouse (contrastes de texto, etiquetas ARIA en inputs dinámicos y navegación por teclado en modales y drawers).

