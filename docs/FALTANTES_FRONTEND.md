# Plan de Trabajo y Reparto de Tareas Frontend — Tienda Prisma

Este documento organiza y divide las tareas pendientes de implementación del frontend de **Tienda Prisma** de forma equilibrada entre **4 desarrolladores**, considerando la carga técnica, componentes UI a construir, integración con servicios y reglas de estilo estipuladas en `docs/ESTILO_ECOMMERCE.md`.

---

## Matriz de Distribución General

| Desarrollador | Módulos Principales | Componentes / UI Clave | Servicios y Estado Clave | Carga Estimada |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1** | **M1. Portada** y **M8. Búsqueda Global** | Hero, Colecciones, Grilla Novedades, Paleta `cmdk` | `catalogService.getProducts()`, debounce de búsqueda | UI Marca + Interactividad global |
| **Dev 2** | **M2. Catálogo** y **M3. Detalle (Base y Galería)** | `ProductCard`, Drawer/Sidebar Filtros, Galería 3:4 | `catalogService.getProducts()` con query params, filtros | Grilla, filtros y maquetación visual |
| **Dev 3** | **M3. Detalle (Variantes/CTA)** y **M4. Carrito Drawer** | `SizeSelector`, Barra móvil fija, `CartDrawer` | `CartContext`, gestión de inventario y límites de stock | Estado de compra y flujo interactivo |
| **Dev 4** | **M5. Checkout**, **M6. Confirmación** y **M7. Seguimiento** | Formularios reactivos, Resumen, Timeline de estados | `react-hook-form` + `zod`, `orderService` (crear y consultar) | Formularios, validación y trazabilidad |

---

## Dev 1: Experiencia de Descubrimiento (Portada y Búsqueda Global)

### Responsabilidades
1. **M1. Portada (`frontend/src/feature/home/HomePage.jsx`)**:
   - [ ] **Sección Hero**:
     - Fondo con gradiente de marca: `bg-gradient-to-br from-[#f5f5f5] via-white to-[#d6efff]`.
     - Sobretítulo (eyebrow) en `text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase`.
     - Título hero H1 (`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight`).
     - Botón principal de llamada a la acción ("Ver catálogo") hacia `/catalogo`.
   - [ ] **Tarjetas de Colección (3 Líneas)**:
     - Tarjetas grandes con `rounded-3xl` para **Moda Femenina**, **Moda Urbana** y **Mascotas**.
     - Apiladas verticalmente en móvil y distribuidas en 3 columnas en escritorio (`lg:grid-cols-3`).
     - Enlaces directos a `/catalogo/femenina`, `/catalogo/urbana` y `/catalogo/mascotas`.
   - [ ] **Sección de Novedades**:
     - Carga de los últimos productos consumiendo `catalogService.getProducts()`.
     - Grilla responsiva usando el componente `ProductCard` (desarrollado por Dev 2).
     - Estado de carga con esqueletos (`react-loading-skeleton`) y manejo silencioso si no hay novedades.
   - [ ] **Bloque de Confianza y Beneficios**:
     - Garantía de envíos a todo el Perú (nacional y local en Huánuco).
     - Medios de pago (Yape, Plin, Tarjeta, Efectivo).
     - Canal de atención directa por WhatsApp con enlace preformateado.

2. **M8. Búsqueda Global (`frontend/src/feature/search/` o `shared/components/SearchPalette.jsx`)**:
   - [ ] Implementar la paleta de comandos con la librería `cmdk` sobre `.modal-overlay`.
   - [ ] Atajo de apertura mediante la tecla `/` y click en el icono de lupa del `Header`.
   - [ ] Estado inicial sin texto: sugerencias rápidas por línea de producto.
   - [ ] Búsqueda interactiva en tiempo real sobre nombres y categorías mediante `catalogService.getProducts({ search })`.
   - [ ] Resultados con imagen en miniatura, nombre, precio (`formatCurrency`) y navegación con teclado (`Enter` / flechas) o cierre con `Esc`.

---

## Dev 2: Exploración de Catálogo y Ficha de Producto

### Responsabilidades
1. **Componente Compartido `ProductCard` (`frontend/src/shared/components/ProductCard.jsx`)**:
   - [x] Contenedor `rounded-2xl` con borde `border-gray-200` y efecto `hover:border-gray-900 hover:shadow-md`.
   - [x] Microinteracciones táctiles con `motion`: `whileHover={{ y: -2 }}` y `whileTap={{ scale: 0.96 }}` (respetando `prefers-reduced-motion`).
   - [x] Imagen en relación de aspecto `aspect-[3/4]`, `object-cover` y `loading="lazy"` con placeholder de `Package` si no hay foto.
   - [x] Badges automáticos de stock:
     - Sin badge si `availableStock > 3`.
     - `badge-amber` "Últimas N unidades" si `1 <= availableStock <= 3`.
     - Opacidad reducida (`opacity-60`) y `badge-rose` "Agotado" si `availableStock === 0`.
   - [x] Visualización de chip de categoría, nombre (`line-clamp-2`) y precio con `formatCurrency`.

2. **M2. Catálogo (`frontend/src/feature/catalog/CatalogPage.jsx`)**:
   - [x] Encabezado con título de línea o catálogo general y contador reactivo de resultados ("N productos").
   - [x] Panel lateral de filtros en escritorio (columna fija de 260 px en `content-card`): filtro por línea (`FEMENINA`, `URBANA`, `MASCOTAS`), categorías dinámicas y tallas.
   - [x] Drawer móvil de filtros: activable mediante botón inferior/flotante con `sidebar-backdrop`.
   - [x] Barra de ordenamiento: Más nuevos, Precio menor a mayor, Precio mayor a menor.
   - [x] Chips de filtros aplicados con botón de eliminación individual y botón global "Limpiar filtros".
   - [x] Grilla de productos responsiva (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`).
   - [x] Paginación por bloques mediante botón "Ver más" (`.btn-outline`).
   - [x] Estados: cargando con grilla de esqueletos (`CatalogGridSkeleton`), error de red con botón "Reintentar" y estado vacío con `EmptyState` y sugerencia de resetear filtros.

3. **M3. Detalle de Producto - Parte Visual y Galería (`frontend/src/feature/catalog/ProductDetailPage.jsx`)**:
   - [x] Layout a 2 columnas en escritorio (Galería 7/12, Información 5/12) dentro de contenedor `max-w-6xl`.
   - [x] Galería multimedia: visualizador principal en formato 3:4 con selector de miniaturas (carrusel deslizable en móvil).
   - [x] Sección inferior de "Productos relacionados" de la misma categoría o línea.

---

## Dev 3: Carrito, Variantes y Flujo de Intención de Compra

### Responsabilidades
1. **Componente Compartido `SizeSelector` (`frontend/src/shared/components/SizeSelector.jsx`)**:
   - [x] Chips de selección con altura táctil mínima de 44 px (`h-11 rounded-xl px-4 text-sm font-semibold border`).
   - [x] Estados del selector:
     - Reposo: borde neutro `border-gray-300 hover:border-gray-900`.
     - Seleccionado: activo `bg-primary text-white border-primary`.
     - Sin stock: tachado `line-through opacity-40 cursor-not-allowed` y selección bloqueada.
     - Foco accesible: anillo hielo `ring-3 ring-[#d6efff]`.

2. **M3. Detalle de Producto - Lógica Comercial y Conversión**:
   - [x] Integración de datos con `catalogService.getProductBySlug(slug)`.
   - [x] Selector interactivo de cantidad (respetando el máximo disponible de la variante elegida).
   - [x] CTA principal "Agregar al carrito" (`.btn-primary .btn-lg w-full`):
     - Validación de talla antes de agregar (mostrar feedback si el cliente no ha marcado variante).
     - Conexión con `CartContext.addItem(variantId, quantity)`.
     - Apertura automática del drawer del carrito o notificación mediante `ToastContext`.
   - [x] Botón "Consultar por WhatsApp" (`.btn-success w-full min-h-11`) con mensaje dinámico prellenado con el nombre del producto, talla y enlace.
   - [x] Barra inferior fija en pantalla móvil (`sticky bottom-0 bg-white/95 border-t p-3`) con precio y botón de compra para conversión inmediata.
   - [x] Manejo de producto agotado en su totalidad (botón deshabilitado y mensaje aclaratorio).

3. **M4. Drawer del Carrito (`frontend/src/feature/cart/CartDrawer.jsx`)**:
   - [x] Panel lateral deslizable derecho `bg-white shadow-2xl rounded-l-3xl z-50` con `sidebar-backdrop`.
   - [x] Conexión global al icono del carrito en el `Header` y cierre con tecla `Esc` o botón de cierre.
   - [x] Listado de artículos en el carrito consumiendo `CartContext`:
     - Miniatura de producto, nombre, talla, color y precio unitario.
     - Controles de cantidad (`−` / `+`) invocando `updateQuantity(variantId, nextQty)`.
     - Ajuste automático o advertencia si la cantidad supera el inventario real.
     - Botón para eliminar artículo (`removeItem(variantId)`) con estilo `.btn-ghost`.
   - [x] Pie fijo del drawer:
     - Detalle de subtotal (`formatCurrency`).
     - Nota de "Envío calculado en el checkout".
     - Botón primario "Ir a pagar" (`/checkout`) que cierra el drawer.
   - [x] Estado de carrito vacío: icono `ShoppingBag`, mensaje "Tu carrito está vacío" y botón "Explorar catálogo".

---

## Dev 4: Checkout, Confirmación y Seguimiento de Pedidos

### Responsabilidades
1. **M5. Proceso de Checkout (`frontend/src/feature/checkout/CheckoutPage.jsx`)**:
   - [ ] Estructura visual responsive en `max-w-6xl`:
     - Escritorio: formulario a la izquierda (7/12) y resumen de orden a la derecha (5/12).
     - Móvil: resumen de compra colapsable en la parte superior y formulario continuo.
   - [ ] Construcción del formulario con `react-hook-form` y esquema de validación estricto con `zod`:
     - Nombre completo: mínimo 3 caracteres, letras y tildes (`validateName`).
     - Teléfono celular: sanitización en tiempo real y validación peruana `^9\d{8}$` (`validatePhone`).
     - Dirección de entrega y referencia opcional.
     - Selector de ámbito de entrega: `LOCAL` (Huánuco) o `NACIONAL` (provincias).
     - Selector visual de método de pago (chips con radio buttons): `YAPE`, `PLIN`, `TARJETA`, `EFECTIVO`.
   - [ ] Resumen de pedido: detalle de ítems del carrito, subtotal, aviso de gastos de envío y total final.
   - [ ] Manejo de envío con `orderService.createOrder(payload)`:
     - Deshabilitar botón durante el envío con indicador de carga.
     - Generación de `requestKey` único para prevenir doble envío.
     - Vaciado del carrito con `clear()` al completar con éxito.
     - Redirección automática a `/checkout/confirmacion` pasando el código de orden.
     - Protección de ruta: redireccionar al catálogo si el carrito está vacío.

2. **M6. Confirmación de Pedido (`frontend/src/feature/checkout/OrderConfirmationPage.jsx`)**:
   - [ ] Pantalla de recepción con icono de confirmación en `emerald`.
   - [ ] Destacado visual del código de pedido generado (`WEB-2026-XXXXX`).
   - [ ] Resumen completo de los datos del cliente, método de pago y productos pedidos.
   - [ ] Card de instrucciones con llamada directa a la acción para enviar el comprobante o coordinar entrega por WhatsApp.
   - [ ] Botones de navegación: "Seguir comprando" (`/catalogo`) y "Ver estado del pedido" (`/pedido/:codigo`).

3. **M7. Seguimiento de Pedido (`frontend/src/feature/tracking/OrderTrackingPage.jsx`)**:
   - [ ] Consulta dinámica del código recibido por URL con `orderService.getOrderByCode(code)`.
   - [ ] Buscador integrado para ingresar manualmente cualquier código de pedido.
   - [ ] Cabecera con badge de estado actual (`PENDING`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
   - [ ] Línea de tiempo vertical (`Timeline`) interactiva con las etapas del pedido (completadas, actual y pendientes).
   - [ ] Detalle de productos adquiridos y datos de envío (courier y número de tracking si aplica).
   - [ ] Estados: cargando con skeleton, error de red y "Pedido no encontrado" con opción de reintentar.

---

## Criterios de Calidad y Coordinación Transversal (Obligatorio para los 4)

- **Tokens e Interfaces**: Todo color, radio y tipografía debe originarse en `src/index.css` (sin estilos hexadecimales sueltos en componentes).
- **Zonas Táctiles**: Altura táctil mínima de 44 px en cualquier botón o chip interactivo móvil.
- **Validación de Código**: Antes de hacer commit, cada desarrollador debe ejecutar dentro de `frontend/`:
  ```bash
  npm run lint
  npm run build
  ```
- **Ramas de Trabajo**:
  - Dev 1: `feat/home-search`
  - Dev 2: `feat/catalog-product-card`
  - Dev 3: `feat/cart-size-selector`
  - Dev 4: `feat/checkout-tracking`
- Todas las ramas se integran a `develop` mediante Pull Request y revisión entre pares.
