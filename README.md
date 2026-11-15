# Tienda Prisma — E-commerce (Base Frontend)

Esqueleto base (template) del frontend público de **Tienda Prisma** (Moda Femenina, Moda Urbana y Mascotas), construido siguiendo la guía de diseño y arquitectura en `docs/ESTILO_ECOMMERCE.md`.

## Stack tecnológico

- **Framework:** React 19 + Vite (JavaScript / JSX)
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Rutas:** `react-router-dom` v7 (`HashRouter` por defecto para despliegue estático)
- **Íconos y UI:** `lucide-react`, `motion`, `react-loading-skeleton`, `cmdk`
- **Formularios y validación:** `react-hook-form` + `zod`
- **Linter:** `oxlint`

## Requisitos e instalación

1. Clonar el repositorio, entrar a la carpeta `frontend` e instalar dependencias:

```bash
cd frontend
npm install
```

2. Configurar las variables de entorno copiando el archivo de ejemplo dentro de `frontend`:

```bash
cp .env.example .env
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Scripts disponibles (dentro de `frontend/`)

- `npm run dev` — Inicia el servidor local de desarrollo con Vite.
- `npm run build` — Genera el empaquetado de producción en `frontend/dist/`.
- `npm run preview` — Sirve localmente el build de producción.
- `npm run lint` — Ejecuta `oxlint` sobre `src/`.

## Variables de entorno

Definidas en `frontend/.env.example`:

| Variable        | Valor por defecto       | Descripción                                                                                   |
| :-------------- | :---------------------- | :-------------------------------------------------------------------------------------------- |
| `VITE_API_URL`  | `http://localhost:3000` | URL base del backend para las peticiones de `apiClient.js`.                                   |
| `VITE_USE_MOCK` | `true`                  | Si es `true`, los servicios usan datos locales simulados con latencia de 300–600 ms.          |

## Cómo pasar de modo Mock a API real

Toda la entrada de datos pasa por los servicios (`frontend/src/feature/catalog/services/catalogService.js` y `frontend/src/feature/checkout/services/orderService.js`). Ningún componente importa archivos JSON ni llama a `fetch` directamente.

Para conectar con el backend real:

1. En tu archivo `frontend/.env`, define la URL del servidor y desactiva el modo mock:

```env
VITE_API_URL=https://tu-dominio-api.com
VITE_USE_MOCK=false
```

2. Verifica en `catalogService.js` y `orderService.js` que las rutas provisionales (`/api/public/...`) coincidan con los endpoints definitivos expuestos por el backend.

## Cómo desplegar como sitio estático

1. Ejecuta el build de producción desde `frontend/`:

```bash
cd frontend
npm run build
```

2. Sube el contenido de la carpeta `frontend/dist/` a cualquier proveedor de hosting estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.).
3. Por defecto se utiliza `HashRouter` (`frontend/src/core/routes/AppRouter.jsx`), por lo que las rutas (`/#/catalogo`, `/#/checkout`, etc.) funcionan de inmediato sin configurar redirecciones en el servidor.
4. Si despliegas con un servidor que redirija todas las rutas a `index.html`, sigue el comentario dentro de `frontend/src/core/routes/AppRouter.jsx` para cambiar `HashRouter` por `BrowserRouter`.

## Estructura del proyecto

```text
frontend/
├── src/
│   ├── core/
│   │   ├── api/            # apiClient.js y control de VITE_USE_MOCK
│   │   ├── context/        # CartContext y ToastContext
│   │   └── routes/         # AppRouter.jsx (HashRouter)
│   ├── feature/
│   │   ├── home/           # Portada (placeholder)
│   │   ├── catalog/        # Catálogo, detalle de producto y catalogService + mockCatalog.json
│   │   ├── checkout/       # Checkout, Confirmación (placeholders) y orderService
│   │   ├── tracking/       # Seguimiento de pedido (placeholder)
│   │   └── system/         # Página 404 terminada
│   └── shared/
│       ├── components/     # Button, Input, Modal, Badge, EmptyState, ProductCard, Header, MobileMenu, Footer, MainLayout
│       ├── constants/      # Líneas de negocio y datos de contacto
│       └── utils/          # formatters.js (PEN / es-PE) y validators.js
docs/
├── ESTILO_ECOMMERCE.md     # Guía oficial y fuente de verdad de estilos y componentes
├── DECISIONES.md           # Registro de decisiones técnicas tomadas en la base
└── FALTANTES_FRONTEND.md   # Diagnóstico de módulos y componentes pendientes de desarrollo
```
