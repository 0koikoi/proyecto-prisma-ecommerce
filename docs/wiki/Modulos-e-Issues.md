# Módulos e issues

El mapa completo del trabajo: qué issue construye qué pantalla, quién lo lleva y cómo saber si está terminado.

> [!NOTE]
> El estado de la tabla corresponde a GitHub al **16 de noviembre de 2026**. Para el estado en vivo, mira los [issues del repositorio](https://github.com/LeoSle4/proyecto-prisma-ecommerce/issues).

**En esta página:** [Resumen](#resumen-de-issues) · [Hito 1](#hito-m1-descubrimiento-y-búsqueda) · [Hito 2](#hito-m2-catálogo-y-ficha-visual) · [Hito 3](#hito-m3-carrito-y-conversión) · [Hito 4](#hito-m4-checkout-y-seguimiento) · [Criterios comunes](#criterios-comunes-de-aceptación)

---

## Resumen de issues

| # | Issue | Módulo | Hito | Responsable | Estado |
| :-: | :--- | :-: | :-: | :--- | :--- |
| 1 | Portada: Hero, colecciones y novedades | M1 | M1 | Melissa-stars | Abierto (PR en revisión) |
| 2 | Paleta de búsqueda con `cmdk` | M8 | M1 | Melissa-stars | Abierto (PR en revisión) |
| 3 | Componente `ProductCard` con estados de stock | Compartido | M2 | O3rosamateo | Abierto (trabajo integrado en `develop`, PR #14) |
| 4 | Catálogo con filtros y ordenamiento | M2 | M2 | O3rosamateo | Abierto (trabajo integrado en `develop`, PR #14) |
| 5 | Galería multimedia 3:4 en el detalle | M3 | M2 | O3rosamateo | Abierto (trabajo integrado en `develop`, PR #14) |
| 6 | Componente `SizeSelector` accesible | Compartido | M3 | Luis-Mauricio765 | Cerrado |
| 7 | Variantes, botón de WhatsApp y barra fija móvil | M3 | M3 | Luis-Mauricio765 | Cerrado |
| 8 | `CartDrawer` lateral con `CartContext` | M4 | M3 | Luis-Mauricio765 | Cerrado |
| 9 | Checkout con react-hook-form y Zod | M5 | M4 | LeoSle4 | Abierto (trabajo integrado en `develop`, PR #17) |
| 10 | Confirmación de pedido con código correlativo | M6 | M4 | LeoSle4 | Cerrado |
| 11 | Seguimiento con timeline de estados | M7 | M4 | LeoSle4 | Cerrado |

> [!IMPORTANT]
> Algunos issues siguen abiertos aunque su trabajo ya está integrado en `develop`. Pasa porque la rama por defecto del repositorio es `main`, y GitHub solo cierra un issue automáticamente cuando el `Closes #N` llega a esa rama. Se cierran con el PR de `develop` a `main`, o a mano dejando un comentario con el PR que los resolvió. Más detalle en [Solución de problemas](Solucion-de-Problemas).

---

## Hito M1: Descubrimiento y Búsqueda

**Responsable:** Melissa-stars · **Objetivo:** que el cliente encuentre productos desde el primer minuto.

### Issue 1. Portada

Ruta `/`. Archivo: `feature/home/HomePage.jsx`.

- [ ] **Hero** con gradiente de marca, sobretítulo, título H1 y botón "Ver catálogo" hacia `/catalogo`.
- [ ] **Tres tarjetas de colección** (`rounded-3xl`): Moda Femenina, Moda Urbana y Mascotas. Apiladas en móvil y en tres columnas desde `lg`. Enlazan a `/catalogo/femenina`, `/catalogo/urbana` y `/catalogo/mascotas`.
- [ ] **Novedades**: últimos productos desde `catalogService.getProducts()`, con `ProductCard`, esqueletos al cargar y sin ruido si no hay datos.
- [ ] **Bloque de confianza**: envíos a todo el Perú, medios de pago (Yape, Plin, Tarjeta, Efectivo) y WhatsApp con enlace prellenado.

### Issue 2. Búsqueda global

Paleta de comandos con `cmdk`, sobre `.modal-overlay`.

- [ ] Se abre con la tecla `/` y con el ícono de lupa del `Header`.
- [ ] Sin texto: sugerencias rápidas por línea de producto.
- [ ] Con texto: búsqueda en tiempo real sobre nombres y categorías con `catalogService.getProducts({ search })`.
- [ ] Resultados con miniatura, nombre y precio, navegables con flechas y `Enter`; se cierra con `Esc`.

---

## Hito M2: Catálogo y Ficha Visual

**Responsable:** O3rosamateo · **Objetivo:** explorar y entender un producto de un vistazo.

### Issue 3. `ProductCard`

Componente compartido: `shared/components/ProductCard.jsx`.

| Condición de stock | Lo que se muestra |
| :--- | :--- |
| `availableStock > 3` | Sin badge |
| `1 a 3` unidades | Badge ámbar "Últimas N unidades" |
| `0` | Tarjeta atenuada (`opacity-60`) con badge rojo "Agotado" |

Además: imagen `aspect-[3/4]` con `loading="lazy"`, placeholder si no hay foto, nombre con `line-clamp-2`, precio con `formatCurrency` y microinteracciones con `motion` que respetan `prefers-reduced-motion`.

### Issue 4. Catálogo

Rutas `/catalogo` y `/catalogo/:linea`.

- [ ] Título según la línea y contador de resultados ("N productos").
- [ ] Filtros en panel lateral (escritorio) y en drawer (móvil): línea, categorías y tallas.
- [ ] Ordenamiento: más nuevos, precio menor a mayor, precio mayor a menor.
- [ ] Chips de filtros aplicados, cada uno removible, y "Limpiar filtros".
- [ ] Grilla `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` y paginación por bloques con "Ver más".
- [ ] Estados: esqueletos al cargar, error de red con "Reintentar" y vacío con `EmptyState`.

### Issue 5. Galería del detalle

Ruta `/producto/:slug`.

- [ ] Dos columnas en escritorio (galería 7/12, información 5/12) dentro de `max-w-6xl`.
- [ ] Visor principal 3:4 con miniaturas (carrusel deslizable en móvil).
- [ ] Sección "Productos relacionados" de la misma categoría o línea.

---

## Hito M3: Carrito y Conversión

**Responsable:** Luis-Mauricio765 · **Objetivo:** que el cliente llegue del producto al carrito sin fricción.

### Issue 6. `SizeSelector`

| Estado | Apariencia |
| :--- | :--- |
| Reposo | Borde neutro, `hover:border-gray-900` |
| Seleccionado | `bg-primary text-white` |
| Sin stock | Tachado, `opacity-40`, no seleccionable |
| Foco | Anillo hielo `ring-3` (accesible) |

Altura táctil mínima de 44 px (`h-11`).

### Issue 7. Variantes y conversión

- [ ] Datos con `catalogService.getProductBySlug(slug)`.
- [ ] Selector de cantidad limitado al stock de la variante elegida.
- [ ] "Agregar al carrito" valida que haya talla elegida y llama a `CartContext.addItem`.
- [ ] "Consultar por WhatsApp" con mensaje prellenado (producto, talla y enlace).
- [ ] Barra inferior fija en móvil con precio y botón de compra.
- [ ] Producto totalmente agotado: botón deshabilitado y mensaje claro.

### Issue 8. `CartDrawer`

- [ ] Panel lateral derecho conectado al ícono del `Header`; cierra con `Esc` o con su botón.
- [ ] Lista con miniatura, nombre, talla, color y precio; controles `−` y `+`; eliminar artículo.
- [ ] Pie fijo con subtotal, nota "Envío calculado en el checkout" y botón "Ir a pagar" hacia `/checkout`.
- [ ] Carrito vacío: ícono, "Tu carrito está vacío" y botón "Explorar catálogo".

---

## Hito M4: Checkout y Seguimiento

**Responsable:** LeoSle4 · **Objetivo:** convertir el carrito en un pedido y poder seguirlo.

Los tres issues están explicados con todo detalle en [Checkout y seguimiento](Checkout-y-Seguimiento). En resumen:

| Issue | Pantalla | Lo esencial |
| :-: | :--- | :--- |
| 9 | `/checkout` | Formulario validado con Zod, resumen colapsable en móvil, `requestKey` contra doble envío |
| 10 | `/checkout/confirmacion` | Código `WEB-2026-XXXXX` destacado, resumen y llamada a WhatsApp |
| 11 | `/pedido/:codigo` | Buscador, badge de estado, timeline y detalle de envío |

---

## Criterios comunes de aceptación

Aplican a **todos** los issues, sin excepción:

| Criterio | Cómo se verifica |
| :--- | :--- |
| Colores, radios y tipografía salen de los tokens de `index.css` | Revisión del PR: no debe haber hexadecimales sueltos |
| Zonas táctiles de al menos 44 px en móvil | Probar en una pantalla de 375 px |
| `npm run lint` sin errores | CI (job *Lint*) |
| `npm run build` compila | CI (job *Compilación*) |
| Pruebas y cobertura en verde | CI (jobs *Pruebas*) |
| Estados de cargando, error y vacío contemplados | Revisión del PR |

---

Siguiente: [Checkout y seguimiento](Checkout-y-Seguimiento)
