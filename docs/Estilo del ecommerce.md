# Tienda Prisma — E-commerce: Guía de Estilo y Módulos del Frontend

Documento de referencia para cualquier persona que diseñe, maqueté o programe el frontend de la tienda online pública.

- **Fuente visual:** el backoffice (`frontend/src/index.css`). La tienda comparte marca con él, pero está pensada para el cliente final: más imagen, más aire, mismos tokens.
- **Alcance:** solo frontend. El backend y la base de datos no se tratan aquí.
- **Convención:** 🟦 **Heredado** = ya existe en el backoffice y se copia tal cual. 🟨 **Propuesto** = decisión nueva para la tienda, sujeta a ajuste del equipo.

**Contenido**

1. [Stack](#1-stack)
2. [Tokens de diseño](#2-tokens-de-diseño)
3. [Configuración Tailwind v4](#3-configuración-tailwind-v4)
4. [Componentes base](#4-componentes-base)
5. [Componentes de la tienda](#5-componentes-de-la-tienda)
6. [Movimiento](#6-movimiento)
7. [Accesibilidad y rendimiento](#7-accesibilidad-y-rendimiento)
8. [Instrucciones generales para mockups](#8-instrucciones-generales-para-mockups)
9. [Módulos: instrucciones por pantalla](#9-módulos-instrucciones-por-pantalla)
10. [Contrato de datos de referencia](#10-contrato-de-datos-de-referencia)
11. [Reglas generales de trabajo en el frontend](#11-reglas-generales-de-trabajo-en-el-frontend)
12. [Diferencias con el backoffice y qué no copiar](#12-diferencias-con-el-backoffice-y-qué-no-copiar)
13. [Decisiones abiertas](#13-decisiones-abiertas)

---

## 1. Stack

| Tema            | Valor                                 | Origen                |
| :-------------- | :------------------------------------ | :-------------------- |
| Framework       | React 19 + Vite                       | 🟦                    |
| Estilos         | Tailwind CSS v4 (`@tailwindcss/vite`) | 🟦                    |
| Íconos          | `lucide-react`                        | 🟦                    |
| Animación       | `motion` (`motion/react`)             | 🟦                    |
| Rutas           | `react-router-dom` v7                 | 🟦                    |
| Formularios     | `react-hook-form` + `zod`             | 🟦                    |
| Carga           | `react-loading-skeleton`              | 🟦                    |
| Búsqueda rápida | `cmdk`                                | 🟦 (el POS ya lo usa) |
| Moneda y fechas | `Intl` con `es-PE` y `PEN`            | 🟦 (`formatters.js`)  |
| Idioma          | `<html lang="es">`                    | 🟦                    |

---

## 2. Tokens de diseño

### 2.1 Color

**Marca**

| Token                      | Hex       | Uso                                                      |
| :------------------------- | :-------- | :------------------------------------------------------- |
| `--color-primary`          | `#1c1c1c` | Texto principal, botón primario, footer, drawers oscuros |
| `--color-secondary`        | `#d6efff` | "Hielo": acentos, foco, selección, botón secundario      |
| `--color-secondary-strong` | `#bce3ff` | Hover del hielo y borde de badge                         |
| `--color-bg`               | `#f5f5f5` | Fondo de página                                          |
| `--color-surface-hover`    | `#f2f8fd` | Hover de listas y filas                                  |
| Superficie                 | `#ffffff` | Tarjetas, modales, inputs                                |

**Neutros** (escala `gray` de Tailwind)

| Uso                            | Clase                |
| :----------------------------- | :------------------- |
| Texto secundario               | `text-gray-500`      |
| Texto de etiquetas             | `text-gray-700`      |
| Placeholder e íconos inactivos | `text-gray-400`      |
| Borde de tarjeta               | `border-gray-200/80` |
| Borde de input                 | `border-gray-300`    |
| Divisores internos             | `border-gray-100`    |

**Semánticos** 🟦

| Significado                  | Color     | Fondo suave | Borde de badge |
| :--------------------------- | :-------- | :---------- | :------------- |
| Éxito / disponible           | `#059669` | `#ecfdf5`   | `#a7f3d0`      |
| Advertencia / pocas unidades | `#d97706` | `#fffbeb`   | `#fde68a`      |
| Error / agotado              | `#dc2626` | `#fef2f2`   | `#fecaca`      |
| Info / enviado               | `#0891b2` | `#ecfeff`   | `#a5f3fc`      |
| Acento especial              | `#7c3aed` | `#f5f3ff`   | `#ddd6fe`      |

> ⚠️ **Contraste 🟨.** Sobre blanco, `#059669` y `#d97706` dan aproximadamente 3.8:1 y 3.2:1, por debajo del 4.5:1 que pide WCAG AA para texto pequeño. En la tienda pública, usar `#047857` (emerald-700) y `#b45309` (amber-700) cuando el texto mida menos de 18 px. Los colores originales siguen valiendo para íconos, bordes y fondos.

**Acento por línea de negocio** 🟨 (opcional, solo chips de categoría)

| Línea         | Badge           |
| :------------ | :-------------- |
| Moda Femenina | `badge-purple`  |
| Moda Urbana   | `badge-neutral` |
| Mascotas      | `badge-cyan`    |

### 2.2 Tipografía

- **Familia:** `Plus Jakarta Sans`, pesos 400, 500, 600, 700, 800. 🟦
- **Fallback:** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. 🟦
- **Render:** `antialiased`. Selección de texto con fondo `#d6efff` y texto `#1c1c1c`. 🟦

| Rol                   | Clases                                                                 | Origen  |
| :-------------------- | :--------------------------------------------------------------------- | :------ |
| H1 de página          | `text-2xl font-bold tracking-tight`                                    | 🟦      |
| H2                    | `text-xl font-semibold tracking-tight`                                 | 🟦      |
| H3                    | `text-base font-semibold`                                              | 🟦      |
| Hero (portada)        | `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight`       | 🟨      |
| Eyebrow (sobretítulo) | `text-[11px] font-extrabold tracking-[0.22em] text-gray-500 uppercase` | 🟦      |
| Etiqueta de campo     | `text-[11px] font-bold uppercase tracking-wider text-gray-700`         | 🟦      |
| Cuerpo                | `text-sm text-gray-700` (en detalle de producto `text-base`)           | 🟦 / 🟨 |
| Precio                | `font-extrabold tracking-tight`                                        | 🟨      |
| Texto de apoyo        | `text-xs text-gray-500`                                                | 🟦      |

### 2.3 Radios

| Elemento                         | Radio          |
| :------------------------------- | :------------- |
| Botones, inputs, chips de filtro | `rounded-xl`   |
| Tarjetas, tablas, modales        | `rounded-2xl`  |
| Tarjeta hero / login             | `rounded-3xl`  |
| Badges y avatares                | `rounded-full` |

### 2.4 Sombras y bordes

| Nivel    | Clase        | Uso                      |
| :------- | :----------- | :----------------------- |
| Reposo   | `shadow-sm`  | Tarjetas, botones        |
| Hover    | `shadow-md`  | Tarjeta de producto      |
| Flotante | `shadow-2xl` | Modales, drawers, toasts |

Toda tarjeta lleva `border border-gray-200/80`.

### 2.5 Espaciado y contenedores

- Escala de 4 px de Tailwind. Separación habitual: `gap-4` (16 px) y `gap-6` (24 px). 🟦
- Contenedor de página: `max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8`. 🟦
- 🟨 Contenido de lectura (detalle, checkout) en `max-w-6xl`. Portada y catálogo pueden usar el ancho completo.

### 2.6 Breakpoints

`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` (los de Tailwind). **Diseñar mobile-first**: el canal principal de venta ya es Instagram y WhatsApp. 🟦

---

## 3. Configuración Tailwind v4

En el backoffice los tokens viven en `:root` y las clases usan hex literales (`bg-[#1c1c1c]`). En la tienda se declaran en `@theme` para que Tailwind genere utilidades (`bg-primary`, `bg-secondary`). Se conservan los **mismos nombres** que en el backoffice. 🟨

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #1c1c1c;
  --color-secondary: #d6efff;
  --color-secondary-strong: #bce3ff;
  --color-bg: #f5f5f5;
  --color-surface-hover: #f2f8fd;

  --color-emerald: #059669;
  --color-emerald-soft: #ecfdf5;
  --color-amber: #d97706;
  --color-amber-soft: #fffbeb;
  --color-rose: #dc2626;
  --color-rose-soft: #fef2f2;
  --color-purple: #7c3aed;
  --color-purple-soft: #f5f3ff;
  --color-cyan: #0891b2;
  --color-cyan-soft: #ecfeff;

  --font-sans:
    "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
}

@layer base {
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }
  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  *::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 9999px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-primary);
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-primary);
    font-family: var(--font-sans);
    @apply antialiased selection:bg-secondary selection:text-primary;
  }

  h1 {
    @apply text-2xl font-bold tracking-tight;
  }
  h2 {
    @apply text-xl font-semibold tracking-tight;
  }
  h3 {
    @apply text-base font-semibold;
  }
}
```

En `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

---

## 4. Componentes base

Se copian del `@layer components` del backoffice. **Mantener los mismos nombres de clase** para poder mover componentes entre repos.

### 4.1 Botones 🟦

| Clase                             | Descripción                                                                                            |
| :-------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `.btn`                            | Base: `inline-flex gap-2 font-semibold uppercase tracking-wider rounded-xl border active:scale-[0.98]` |
| `.btn-sm` / `.btn-md` / `.btn-lg` | `px-3.5 py-1.5 text-xs` / `px-4 py-2.5 text-xs` / `px-6 py-3.5 text-sm`                                |
| `.btn-primary`                    | Fondo `#1c1c1c`, texto blanco, hover `#333333`                                                         |
| `.btn-secondary`                  | Fondo `#d6efff`, texto `#1c1c1c`, hover `#bce3ff`                                                      |
| `.btn-outline`                    | Fondo blanco, borde `gray-300`, hover `#f5f5f5`                                                        |
| `.btn-success`                    | Verde. 🟨 Reservado para **WhatsApp** y confirmaciones                                                 |
| `.btn-danger`                     | Rojo, solo acciones destructivas (quitar del carrito)                                                  |
| `.btn-ghost`                      | Transparente, acciones terciarias                                                                      |

Reglas para la tienda 🟨:

- Altura táctil mínima de **44 px** en móvil. `.btn-md` mide cerca de 36 px, así que en botones de compra usar `.btn-lg` o `min-h-11`.
- **Un solo CTA primario por pantalla.**
- Botones a ancho completo en móvil: `w-full sm:w-auto`.

### 4.2 Formularios 🟦

| Clase                | Uso                                                                                                      |
| :------------------- | :------------------------------------------------------------------------------------------------------- |
| `.input-field-group` | Contenedor `flex flex-col gap-1.5`                                                                       |
| `.input-label`       | Etiqueta en mayúsculas pequeñas                                                                          |
| `.input-wrapper-ice` | **Variante de la tienda**: foco con anillo hielo (`ring-3 ring-[#d6efff]`), como el login del backoffice |
| `.input-element`     | `h-10 text-sm font-medium`                                                                               |

🟨 En móvil: `h-12` y `text-base` (16 px) para evitar el zoom automático de iOS.

Validaciones del proyecto (reutilizar `validators.js`):

- Celular Perú: `^9\d{8}$`, con sanitización en tiempo real.
- DNI 8 dígitos, RUC 11 dígitos.
- Nombres: mínimo 3 caracteres, letras, tildes y espacios.

### 4.3 Badges 🟦

Base: `inline-flex rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider`.
Variantes: `badge-neutral`, `badge-ice`, `badge-emerald`, `badge-amber`, `badge-rose`, `badge-purple`, `badge-cyan`.

### 4.4 Tarjetas y modales 🟦

- `.content-card`: `bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md`.
- `.modal-overlay`: `bg-[#1c1c1c]/60 backdrop-blur-md`, `z-50`.
- `.modal-content`: `bg-white rounded-2xl shadow-2xl border border-gray-100`.

### 4.5 Skeletons 🟦

`<SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">`. Toda grilla o ficha que dependa de datos remotos muestra skeleton, no spinner.

### 4.6 Toasts 🟦

Fondo `#1c1c1c`, texto blanco en mayúsculas pequeñas (`text-xs font-semibold uppercase tracking-wider`), `rounded-2xl shadow-2xl`, esquina superior derecha, 3.5 s. Íconos de `lucide-react`: éxito `#059669`, advertencia `#d97706`, error `#dc2626`, info `#d6efff`.

---

## 5. Componentes de la tienda 🟨

Clases nuevas con prefijo `store-` para no chocar con las del backoffice.

### 5.1 Header público

- `h-16`, `bg-white/95 backdrop-blur-md border-b border-gray-200/80`, `sticky top-0 z-30` (mismo patrón que `.navbar`).
- Izquierda: botón de menú (móvil) y logo `brand-badge`.
- Centro (desde `md`): navegación por línea: **Femenina · Urbana · Mascotas**.
- Derecha: buscador (abre `cmdk`) y carrito con contador.
- Contador: badge redondo `bg-[#1c1c1c] text-white`.

### 5.2 Menú móvil

Panel lateral **oscuro** `bg-[#1c1c1c] text-white`, `w-72`, `shadow-2xl`, con `sidebar-backdrop`. Enlace activo con fondo hielo (`.nav-item-active`). Replica el sidebar del backoffice para que el cliente reconozca la marca.

### 5.3 Tarjeta de producto

Basada en la del POS, ahora con imagen.

| Parte             | Especificación                                                                 |
| :---------------- | :----------------------------------------------------------------------------- |
| Contenedor        | `bg-white border border-gray-200 rounded-2xl overflow-hidden`                  |
| Hover             | `border-gray-900 shadow-md`, `whileHover={{ y: -2 }}`                          |
| Tap               | `whileTap={{ scale: 0.96 }}`                                                   |
| Transición        | `{ type: 'spring', stiffness: 500, damping: 30 }`                              |
| Imagen            | `aspect-[3/4] object-cover bg-gray-100`, `loading="lazy"`, `alt` con el nombre |
| Sin foto          | Fondo `bg-gray-100` con ícono `Package` en `text-gray-400`                     |
| Chip de categoría | Badge pequeño, `truncate`                                                      |
| Nombre            | `text-sm font-semibold line-clamp-2`                                           |
| Precio            | `text-base font-extrabold`, con `formatCurrency` (`S/ 59.90`)                  |
| Grilla            | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`                         |

**Estados de stock** (umbral bajo ≤ 3, como en el POS):

| `availableStock` | UI                                                                    |
| :--------------- | :-------------------------------------------------------------------- |
| `> 3`            | Sin badge de stock                                                    |
| `1–3`            | `badge-amber` "Últimas N unidades"                                    |
| `0`              | Tarjeta con `opacity-60`, `badge-rose` "Agotado", botón deshabilitado |

> Se muestra la **disponibilidad** (lo que se puede vender), nunca el stock bruto.

### 5.4 Selector de talla o variante

- Chips `rounded-xl border border-gray-300 px-4 h-11 text-sm font-semibold`.
- Seleccionado: `bg-[#1c1c1c] text-white border-[#1c1c1c]`.
- Sin stock: `opacity-40 line-through cursor-not-allowed`.
- Foco visible: `ring-3 ring-[#d6efff]`.

### 5.5 Estados vacíos y de error

Círculo `w-14 h-14 bg-gray-100 rounded-full` con ícono `text-gray-400`, título `text-sm font-semibold`, ayuda `text-xs text-gray-500`, y botón de acción cuando aplique. 🟦 (patrón del POS)

### 5.6 Footer

Fondo `#1c1c1c`, texto `text-gray-300`, títulos blancos `text-xs uppercase tracking-wider`, divisores `border-white/10`. Incluye WhatsApp, Instagram, dirección en Huánuco y métodos de pago.

### 5.7 Textos de interfaz (microcopy) 🟨

Español de Perú, trato de "tú", frases cortas. Los botones aparecen en mayúsculas por el estilo de `.btn`.

| Situación          | Texto                                               |
| :----------------- | :-------------------------------------------------- |
| Agregar al carrito | Agregar al carrito                                  |
| Ir al checkout     | Ir a pagar                                          |
| Confirmar          | Confirmar pedido                                    |
| Stock bajo         | Últimas N unidades                                  |
| Sin stock          | Agotado                                             |
| Catálogo vacío     | No encontramos productos. Prueba con otros filtros. |
| Error de red       | No pudimos cargar la información. Reintentar        |
| Carrito vacío      | Tu carrito está vacío                               |

---

## 6. Movimiento

| Regla              | Valor                                                                  |
| :----------------- | :--------------------------------------------------------------------- |
| Color y sombra     | `duration-200 ease-in-out` 🟦                                          |
| Drawers y modales  | `duration-300` 🟦                                                      |
| Interacción táctil | Spring `stiffness: 500, damping: 30` 🟦                                |
| Presión de botón   | `active:scale-[0.98]` 🟦                                               |
| Accesibilidad 🟨   | Respetar `prefers-reduced-motion`: sin `whileHover` ni desplazamientos |
| Prohibido 🟨       | Animaciones de entrada que retrasen ver el catálogo                    |

---

## 7. Accesibilidad y rendimiento 🟨

- Contraste AA en texto (ver nota en 2.1).
- Foco visible en todo elemento interactivo (`ring-3 ring-[#d6efff]` con borde `#1c1c1c`).
- Áreas táctiles de 44 px mínimo.
- Imágenes con `alt`, y `width`/`height` o `aspect-*` para evitar saltos de layout. `loading="lazy"` fuera del primer pantallazo.
- Botones de solo ícono con `aria-label` en español.
- Fuente con `display=swap` (ya incluido en la URL).

---

## 8. Instrucciones generales para mockups

Aplican a todos los módulos de la sección 9.

**Tamaños de pantalla (frames)**

| Dispositivo | Ancho     | Prioridad                        |
| :---------- | :-------- | :------------------------------- |
| Móvil       | 360 × 800 | **Principal**: se diseña primero |
| Tablet      | 768       | Secundaria                       |
| Escritorio  | 1440      | Secundaria                       |

**Qué debe incluir cada módulo**

1. La pantalla en estado normal, en móvil y en escritorio (tablet solo si el layout cambia de forma relevante).
2. Los estados que la guía lista en el módulo: cargando (skeleton), vacío, error y, si aplica, agotado o con errores de validación.
3. Estados interactivos de los componentes nuevos: reposo, hover, foco, deshabilitado.

**Cómo diseñar**

- Usar **solo** los tokens de las secciones 2 a 5. Si hace falta un color o tamaño nuevo, proponerlo en la sección 13 antes de usarlo.
- Contenido realista, no _lorem ipsum_: nombres de prendas en español, precios en soles (`S/ 59.90`), datos del contrato de la sección 10.
- Fotos de producto: placeholder en relación 3:4 (ver 5.3).
- Nombrar capas y componentes igual que en código: `Header`, `ProductCard`, `SizeSelector`, `CartDrawer`.

**Entrega**

- Exportar PNG por frame y guardar en `docs/mockups/<modulo>/`, con nombre `<modulo>-<dispositivo>-<estado>.png` (ejemplo: `catalogo-movil-vacio.png`). Si se usa Figma u otra herramienta, agregar el enlace en `docs/mockups/README.md`.
- Anotar en el mismo README cualquier decisión nueva (colores, tamaños, textos) para que quien programe no tenga que adivinarla.

---

## 9. Módulos: instrucciones por pantalla

Para cada módulo: **ruta**, **objetivo**, **datos que usa**, **composición**, **estados** y **qué debe mostrar el mockup**. Las rutas son una propuesta 🟨.

### M0. Layout global

- **Ruta:** envuelve todas las páginas.
- **Objetivo:** que el cliente se ubique y llegue al carrito desde cualquier lugar.
- **Composición:** Header (5.1), menú móvil (5.2), Footer (5.6). El contenido de cada página va entre ambos, dentro del contenedor de 2.5.
- **Estados:** menú abierto/cerrado; carrito con 0 y con N artículos; header sobre fondo claro con scroll.
- **Mockup:** header y footer en móvil y escritorio, menú móvil abierto y buscador abierto.

### M1. Portada

- **Ruta:** `/`
- **Objetivo:** presentar las tres líneas y los productos nuevos.
- **Datos:** líneas (fijas), lista corta de productos recientes.
- **Composición:**
  1. Hero con el degradado de marca `bg-gradient-to-br from-[#f5f5f5] via-white to-[#d6efff]`, eyebrow, título, subtítulo y un CTA primario ("Ver catálogo").
  2. Tres tarjetas de colección (Femenina, Urbana, Mascotas): `rounded-3xl`, imagen de fondo, título `font-extrabold`.
  3. Carrusel o grilla de novedades con la tarjeta de 5.3.
  4. Bloque de confianza: envíos a todo el Perú, pagos con Yape/Plin/tarjeta, atención por WhatsApp.
- **Estados:** novedades cargando (skeleton), sin novedades (ocultar el bloque).
- **Mockup:** móvil (colecciones apiladas) y escritorio (colecciones en 3 columnas).

### M2. Catálogo

- **Rutas:** `/catalogo` y `/catalogo/:linea` (`femenina`, `urbana`, `mascotas`).
- **Objetivo:** explorar y encontrar productos con pocos toques.
- **Datos:** lista de productos con `line`, `category`, `variants` (tallas y disponibilidad).
- **Composición:**
  - Encabezado de página (`.page-title`, `.page-subtitle`) y contador de resultados ("24 productos").
  - Filtros: línea, categoría, talla. Escritorio: columna izquierda de 260 px en `content-card`. Móvil: botón "Filtros" que abre un drawer.
  - Orden: más nuevos, precio menor a mayor, precio mayor a menor.
  - Chips de filtros activos, cada uno con botón para quitarlo, y enlace "Limpiar filtros".
  - Grilla de tarjetas (5.3). Para listas largas, botón "Ver más" (`.btn-outline`) en lugar de scroll infinito 🟨.
- **Estados:** cargando (grilla de skeletons), vacío con filtros, error de red con "Reintentar", productos agotados visibles pero marcados.
- **Mockup:** móvil con y sin drawer de filtros abierto, escritorio con la columna de filtros, estado vacío y estado de carga.

### M3. Detalle de producto

- **Ruta:** `/producto/:slug`
- **Objetivo:** que el cliente elija talla y agregue al carrito con confianza.
- **Datos:** un producto con `images`, `description`, `variants`.
- **Composición:**
  - Escritorio: dos columnas (galería 7/12, información 5/12) dentro de `max-w-6xl`. Móvil: galería arriba, información debajo.
  - Información: chip de categoría, nombre (H1), precio, selector de talla/color (5.4), selector de cantidad, descripción.
  - CTA: "Agregar al carrito" (`.btn-primary .btn-lg`). Debajo, "Consultar por WhatsApp" (`.btn-success`).
  - Móvil: barra inferior fija con precio y CTA.
  - Productos relacionados al final (misma línea).
- **Estados:** cargando, producto no encontrado (página 404 de M9), variante agotada (chip tachado), producto totalmente agotado (CTA deshabilitado y mensaje), talla no elegida (error al intentar agregar).
- **Mockup:** móvil con barra fija, escritorio en 2 columnas, estados de talla (normal, seleccionada, agotada) y producto agotado.

### M4. Carrito

- **Ruta:** drawer derecho, disponible en toda la tienda.
- **Objetivo:** revisar el pedido y pasar al pago.
- **Datos:** líneas del carrito con nombre, talla, color, precio, cantidad y disponibilidad.
- **Composición:** drawer `bg-white rounded-l-3xl shadow-2xl` con `sidebar-backdrop`. Cada línea: miniatura, nombre, talla, control de cantidad (− / +), subtotal y botón de quitar. Pie fijo con total y CTA "Ir a pagar".
- **Estados:** vacío ("Tu carrito está vacío" con enlace al catálogo), cantidad mayor al stock disponible (aviso en la línea y ajuste), línea que dejó de estar disponible.
- **Mockup:** drawer con 1, varias líneas y vacío; móvil a pantalla completa.

### M5. Checkout

- **Ruta:** `/checkout`
- **Objetivo:** capturar los datos de entrega y pago con la menor fricción posible.
- **Datos:** carrito y formulario. Los datos del formulario siguen el contrato de pedido de la sección 10.
- **Composición:**
  - Móvil: una columna (resumen colapsable, formulario, CTA). Desde `lg`: formulario a la izquierda y resumen a la derecha.
  - Campos: nombre, celular, dirección, referencia, ámbito de entrega (Local / Nacional), método de pago (chips: Efectivo, Yape, Plin, Tarjeta).
  - Formulario en `content-card` con `.input-label` y `.input-wrapper-ice`.
  - Resumen: líneas, subtotal, envío (a confirmar) y total.
  - Un CTA primario: "Confirmar pedido".
- **Validaciones:** las de 4.2. Errores bajo cada campo en `text-xs text-red-600`.
- **Estados:** formulario con errores, enviando (botón deshabilitado con indicador), error al enviar con opción de reintentar, carrito vacío (redirigir al catálogo).
- **Mockup:** móvil y escritorio, formulario vacío, con errores y enviando.

### M6. Confirmación de pedido

- **Ruta:** `/checkout/confirmacion`
- **Objetivo:** dar tranquilidad y siguiente paso.
- **Datos:** código de pedido y resumen.
- **Composición:** ícono de éxito, título "¡Recibimos tu pedido!", código del pedido destacado, resumen de lo comprado, mensaje de que se coordinará por WhatsApp, botones "Seguir comprando" y "Ver estado del pedido".
- **Mockup:** móvil y escritorio.

### M7. Seguimiento de pedido

- **Ruta:** `/pedido/:codigo`
- **Objetivo:** que el cliente sepa en qué etapa está su compra.
- **Datos:** estado del pedido, líneas, datos de envío (courier y guía cuando existan).
- **Composición:** badge de estado actual, línea de tiempo vertical con las etapas, resumen del pedido, botón de contacto por WhatsApp.

| Código      | Etiqueta             | Badge           |
| :---------- | :------------------- | :-------------- |
| `PENDING`   | Recibimos tu pedido  | `badge-neutral` |
| `PREPARING` | Preparando tu pedido | `badge-amber`   |
| `SHIPPED`   | En camino            | `badge-cyan`    |
| `DELIVERED` | Entregado            | `badge-emerald` |
| `CANCELLED` | Cancelado            | `badge-rose`    |

- **Estados:** cargando, pedido no encontrado, error de red.
- **Mockup:** una pantalla por cada estado de la tabla, en móvil.

### M8. Búsqueda

- **Ruta:** ventana sobre cualquier página (se abre desde el header o con `/`).
- **Objetivo:** llegar a un producto escribiendo pocas letras.
- **Composición:** paleta `cmdk` sobre `modal-overlay`, con campo de búsqueda, resultados con miniatura, nombre y precio, y atajo para cerrar con `Esc`.
- **Estados:** sin texto (sugerencias: las tres líneas), sin resultados, cargando.
- **Mockup:** móvil y escritorio, con resultados y sin resultados.

### M9. Páginas de sistema

- **404:** estado vacío (5.5) con botón "Volver al inicio".
- **Error de red:** mensaje y botón "Reintentar".
- **Mockup:** una sola versión por tipo, en móvil.

---

## 10. Contrato de datos de referencia

Es **provisional**: sirve para que diseño y frontend trabajen con los mismos campos. Cuando exista la API pública se compara con el contrato real y se ajusta.

**Producto**

```json
{
  "id": 1,
  "slug": "polera-oversize-negra",
  "name": "Polera oversize negra",
  "line": "URBANA",
  "category": "Poleras",
  "description": "...",
  "images": [],
  "variants": [
    {
      "id": 101,
      "size": "M",
      "color": "Negro",
      "salePrice": 59.9,
      "availableStock": 4
    }
  ]
}
```

`line` toma los valores `FEMENINA`, `URBANA` o `MASCOTAS`. Al cliente nunca se le muestra costo, proveedor, SKU interno ni stock bruto.

**Pedido** (lo que envía el formulario del checkout)

```json
{
  "requestKey": "<uuid generado por intento de checkout>",
  "customerName": "...",
  "customerPhone": "9XXXXXXXX",
  "shippingAddress": "...",
  "reference": "...",
  "deliveryScope": "LOCAL",
  "requestedPaymentMethod": "YAPE",
  "items": [{ "variantId": 101, "quantity": 2 }]
}
```

El precio, el costo de envío y el canal los define el servidor; el frontend no los envía como autoridad.

---

## 11. Reglas generales de trabajo en el frontend

**Estructura.** Cada módulo vive en su propia carpeta dentro de `feature/`, igual que en el backoffice:

```
src/
├── core/                 # API, contextos (carrito, toasts), rutas
├── feature/
│   └── <modulo>/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── <Modulo>Page.jsx
│       └── index.js
└── shared/
    ├── components/       # Button, Input, Modal, Header, Footer, ProductCard…
    ├── constants/
    └── utils/            # formatters.js, validators.js
```

**Reglas**

1. **Los estilos globales y las clases semánticas viven solo en `src/index.css`.** En los componentes se usan clases de Tailwind o las clases de `@layer components`. No se crean otros archivos CSS.
2. **Colores, radios, sombras y tipografía salen de los tokens.** Nada de hex sueltos que no estén en la sección 2.
3. **Los datos entran siempre por `services/`.** Un componente nunca importa un JSON ni llama a `fetch` directo. Así, cambiar de datos simulados a la API real no toca la interfaz.
4. **Todo lo que dependa de datos tiene los tres estados:** cargando (skeleton), vacío y error con "Reintentar".
5. **Lo reutilizable va en `shared/`.** Si dos módulos usan un componente, se mueve allí.
6. **Interfaz en español de Perú.** Los textos nuevos siguen la tabla de 5.7.
7. **Solo se muestra información de cliente:** disponibilidad, precio y variantes. Nada interno.
8. **Mobile-first.** Se prueba primero a 360 px de ancho.

**Para agregar un módulo nuevo**

1. Revisar si ya está descrito en la sección 9. Si no, agregarlo ahí (ruta, datos, composición, estados, mockup) antes de programarlo.
2. Crear su carpeta en `feature/` con la estructura de arriba.
3. Registrar su ruta en `core/routes`.
4. Si necesita clases nuevas, agregarlas en `index.css` con prefijo `store-` y un comentario de cabecera.

**Antes de dar un cambio por terminado**

- [ ] Se ve bien a 360, 768 y 1440 px.
- [ ] Usa solo tokens y clases de esta guía.
- [ ] Tiene estados de carga, vacío y error.
- [ ] Zonas táctiles de 44 px en acciones de compra.
- [ ] Foco visible, `alt` en imágenes y `aria-label` en botones de ícono.
- [ ] `npm run lint` y `npm run build` pasan sin errores.

---

## 12. Diferencias con el backoffice y qué no copiar

**Diferencias intencionales**

| Aspecto                 | Backoffice                        | Tienda                                |
| :---------------------- | :-------------------------------- | :------------------------------------ |
| Público                 | Operadores (ADMIN / VENDEDOR)     | Cliente final, mayormente móvil       |
| Densidad                | Alta (tablas, KPIs)               | Baja (imagen y espacio)               |
| Imagen                  | Casi sin fotos                    | Protagonista (relación 3:4)           |
| Navegación              | Sidebar oscuro                    | Header claro y drawer oscuro en móvil |
| Altura táctil           | 36–40 px                          | 44 px mínimo                          |
| Badges de texto pequeño | Colores originales                | Tonos 700                             |
| Datos visibles          | Stock físico, costos, proveedores | Disponibilidad, precio y variantes    |

**Inconsistencias del backoffice que no se deben arrastrar**

1. `inventario.tailwind.css` redefine el ámbar (`#e68170` y `#f8fcab`), distinto al global. Usar solo los de `index.css`.
2. `MetricCard` usa `blue` donde el resto del sistema usa `cyan` para "info". Usar `cyan`.
3. Las clases usan hex literales (`bg-[#1c1c1c]`) en vez de tokens. En la tienda usar `bg-primary`.
4. El `<title>` del backoffice dice "Sistema de Gestión". La tienda lleva su propio título y favicon.

---

## 13. Decisiones abiertas

- [ ] Logo definitivo y versión del `brand-badge` para el header público.
- [ ] Banco de fotos: relación 3:4 para prendas y tratamiento para la línea Mascotas.
- [ ] Acento por línea de negocio (2.1) o todo en hielo y negro.
- [ ] Subir ya el contraste de badges (tonos 700) o tolerarlo como en el backoffice.
- [ ] Paginación del catálogo: "Ver más" o paginación numerada.
- [ ] Rutas definitivas (sección 9).
- [ ] Dominio y favicon de la tienda pública.
- [ ] Extraer los tokens a un paquete compartido entre ambos repos más adelante.
