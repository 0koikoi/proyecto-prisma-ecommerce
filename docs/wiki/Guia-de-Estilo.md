# Guía de estilo

El resumen práctico del diseño de la tienda. La fuente de verdad completa es [`docs/ESTILO_ECOMMERCE.md`](https://github.com/LeoSle4/proyecto-prisma-ecommerce/blob/develop/docs/ESTILO_ECOMMERCE.md); aquí está lo que necesitas a mano mientras programas.

**En esta página:** [Principios](#principios) · [Color](#color) · [Tipografía](#tipografía) · [Botones y formularios](#botones-y-formularios) · [Layout](#layout-y-espaciado) · [Movimiento](#movimiento) · [Accesibilidad](#accesibilidad)

---

## Principios

1. **Móvil primero.** La mayoría de los clientes compra desde el celular. Diseña para 375 px y luego amplía.
2. **Todo sale de un token.** Si necesitas un color, un radio o una sombra, ya existe en `src/index.css`. Si no existe, se agrega ahí, no en el componente.
3. **Claridad antes que decoración.** La tienda tiene que dejar ver el catálogo rápido y cerrar la venta.
4. **Cada pantalla contempla sus tres estados**: cargando, error y vacío.

## Color

Los tokens viven en el bloque `@theme` de `frontend/src/index.css`.

| Token | Valor | Uso |
| :--- | :--- | :--- |
| `primary` | `#1c1c1c` | Texto principal, botones principales |
| `primary-hover` | `#333333` | Estado hover del primario |
| `secondary` | `#d6efff` | Color hielo de marca: foco, fondos suaves, selección |
| `secondary-strong` | `#bce3ff` | Variante más intensa del hielo |
| `bg` | `#f5f5f5` | Fondo general de la página |
| `surface-hover` | `#f2f8fd` | Hover de elementos de navegación |

**Colores semánticos** (cada uno con variante `-soft` para fondos y `-border` para bordes):

| Color | Cuándo usarlo |
| :--- | :--- |
| `emerald` | Éxito, confirmaciones y WhatsApp |
| `amber` | Advertencias y stock bajo |
| `rose` | Errores y "Agotado" |
| `purple` | Estado "Enviado" |
| `cyan` | Estado "En preparación" |

> [!IMPORTANT]
> **Contraste del texto.** El verde `#059669` y el ámbar `#d97706` no alcanzan 4.5:1 sobre fondo blanco para texto pequeño. Para texto se usan `emerald-text` (`#047857`) y `amber-text` (`#b45309`). Los tonos originales quedan para íconos y botones.

## Tipografía

- **Familia:** Plus Jakarta Sans, pesos 400, 500, 600, 700 y 800.
- **Títulos de página:** clase `page-title` (`text-2xl font-bold tracking-tight`).
- **Texto de apoyo:** `text-xs text-gray-500`.
- **Cifras y precios:** `font-extrabold tracking-tight`, siempre con `formatCurrency` (soles, formato `es-PE`).

## Botones y formularios

### Botones

Se usa el componente `Button` con la prop `variant` y `size`.

| Variante | Cuándo |
| :--- | :--- |
| `primary` | La acción principal de la pantalla (una sola) |
| `secondary` / `outline` | Acciones secundarias |
| `success` | Reservado para **WhatsApp** y confirmaciones |
| `danger` | Acciones destructivas |
| `ghost` | Acciones discretas (cerrar, eliminar un artículo) |

Tamaños `sm`, `md` y `lg`. En móvil, `md` y `lg` garantizan **44 px de alto** mínimo.

### Formularios

- Usa el componente `Input`: ya trae etiqueta, ícono opcional y mensaje de error con `role="alert"`.
- En móvil los campos miden `h-12` y `text-base` (16 px) para que iOS **no haga zoom** al enfocar.
- El mensaje de error va debajo del campo y dice **qué hacer**, no solo qué está mal.

### Badges

`Badge` con variantes `neutral`, `ice`, `emerald`, `amber`, `rose`, `purple` y `cyan`. Se usan para estado (stock, estado del pedido), no como decoración.

## Layout y espaciado

- Escala de 4 px de Tailwind; separaciones habituales `gap-4` (16 px) y `gap-6` (24 px).
- Contenedor general: `max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8`.
- Contenido de lectura (detalle, checkout): `max-w-6xl`.
- Breakpoints de Tailwind: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

## Movimiento

| Elemento | Duración |
| :--- | :--- |
| Color y sombra | `duration-200 ease-in-out` |
| Drawers y modales | `duration-300` |
| Interacción táctil (`motion`) | Spring con `stiffness: 500` y `damping: 30` |
| Presión de botón | `active:scale-[0.98]` |

> [!WARNING]
> **Respeta `prefers-reduced-motion`.** Si el usuario pidió menos movimiento, sin `whileHover` ni desplazamientos. Y nada de animaciones de entrada que retrasen ver el catálogo.

## Accesibilidad

Checklist rápido para cada componente nuevo:

- [ ] Se puede usar solo con teclado y el foco se ve (anillo hielo).
- [ ] Los controles interactivos miden al menos 44 px en móvil.
- [ ] Los íconos decorativos llevan `aria-hidden="true"`.
- [ ] Los errores se anuncian (`role="alert"`) y los estados se comunican con texto, no solo con color.
- [ ] Los botones solo con ícono tienen `aria-label`.
- [ ] Los acordeones y desplegables usan `aria-expanded` y `aria-controls`.

---

Siguiente: [Flujo de trabajo con Git](Flujo-de-Trabajo-Git)
