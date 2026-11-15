# Decisiones Técnicas de la Base — Tienda Prisma E-commerce

Este documento registra las decisiones adoptadas al construir el template base del frontend público cuando la guía de estilo (`docs/ESTILO_ECOMMERCE.md`) dejaba opciones abiertas o detalles de implementación.

## 1. Contraste de texto en Badges (Sección 2.1 y 13)
- **Contexto:** La guía advierte que `#059669` (emerald) y `#d97706` (amber) sobre fondo claro tienen contraste menor a 4.5:1 para texto pequeño, y propone usar `#047857` (emerald-700) y `#b45309` (amber-700).
- **Decisión:** Se declararon en `@theme` los tokens `--color-emerald-text: #047857` y `--color-amber-text: #b45309` para el texto de `.badge-emerald` y `.badge-amber`, manteniendo `--color-emerald` y `--color-amber` para íconos y botones. También se declararon los bordes de badge (`--color-*-border`) en `@theme` para evitar hexadecimales sueltos fuera del bloque `@theme`.

## 2. Resolución de precios y variantes en `CartContext` (Sección 7 y 10)
- **Contexto:** La firma requerida para `CartContext` es `addItem(variantId, quantity)` y debe exponer `subtotal` y `totalItems` sin que los componentes importen los JSON directamente.
- **Decisión:** `catalogService` expone una función auxiliar `findVariantInCatalog(variantId)` que permite a `CartContext` y `orderService` resolver el precio unitario (`salePrice`), nombre, talla y stock disponible de una variante a partir de su `variantId`. Si el almacenamiento local (`localStorage`) está bloqueado o vacío, `CartContext` opera en memoria sin lanzar errores.

## 3. Pedido de demostración para seguimiento en modo Mock
- **Contexto:** El enlace de seguimiento de pedido (`/pedido/:codigo`) requiere un código válido para pruebas rápidas antes de pasar por el checkout completo.
- **Decisión:** Además de conservar en memoria de sesión todos los pedidos creados con `orderService.createOrder(payload)` (generando códigos correlativos `WEB-2026-00001`, `WEB-2026-00002`, etc.), `getOrderByCode('WEB-2026-00001')` devuelve un pedido simulado por defecto si aún no se ha creado uno en la sesión actual.

## 4. Altura táctil en móvil (Sección 4.1 y 4.2)
- **Contexto:** Se exige un área táctil mínima de 44 px (`min-h-11`) en móvil y tamaño de texto `16px` (`text-base`) en inputs móviles para evitar zoom automático en iOS.
- **Decisión:** `.btn-md` y `.btn-lg` garantizan `min-h-11` en pantallas móviles (`sm:min-h-0` en `.btn-md` para conservar proporción en escritorio), y `.input-element` aplica `h-12 text-base sm:h-10 sm:text-sm`.

## 5. Nombre del archivo de guía de estilo
- **Contexto:** El repositorio tenía inicialmente `docs/Estilo del ecommerce.md`, mientras que las instrucciones referencian `docs/ESTILO_ECOMMERCE.md`.
- **Decisión:** Se conservaron ambos nombres en `docs/` con el mismo contenido para evitar enlaces rotos en herramientas o referencias del equipo.

## 6. Dev 3: variantes y carrito
- **Selección:** `SizeSelector` identifica cada combinación talla/color por `variant.id`. La cantidad máxima para agregar descuenta las unidades de esa variante que ya están en el carrito. El precio y el mensaje de WhatsApp cambian con la selección; el enlace conserva la ruta del `HashRouter`.
- **Inventario y persistencia:** `cartState.js` valida cantidades enteras, agrupa duplicados y recupera precios y disponibilidad mediante `findVariantInCatalog`. Revalida al restaurar, modificar y abrir el carrito. Las cantidades excesivas se ajustan con aviso; los artículos agotados o eliminados permanecen visibles para quitarlos y bloquean el CTA al checkout. Su importe no forma parte del subtotal.
- **Accesibilidad:** el drawer usa `dialog.showModal()` para mantener el foco dentro y hacer inerte el fondo. Se cierra con Escape, botón o backdrop; recupera el foco y bloquea el scroll del documento. Ocupa todo el ancho en móvil y respeta movimiento reducido y áreas seguras.
- **Integración:** se conserva la firma `addItem(variantId, quantity)` y se añaden `isOpen`, `openCart`, `closeCart` y `canCheckout`. La imagen principal es una base para la galería de Dev 2; checkout sigue siendo responsabilidad de Dev 4. Este flujo está validado con el catálogo mock existente; la consulta actualizada de inventario contra un backend queda sujeta al contrato público pendiente.
- **Verificación:** `npm run lint`, `npm run build` y `node --test src/core/context/cartState.test.js`. Flujo probado en navegador a 360, 768 y 1440 px: selección requerida, límites de cantidad, apertura/cierre, persistencia, eliminación, carrito vacío, producto agotado, 404 y navegación a `/checkout`.
