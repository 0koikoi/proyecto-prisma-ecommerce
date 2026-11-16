# Decisiones técnicas

El registro de **por qué** el proyecto es como es. El código dice qué hace; esta página guarda el motivo, para no tener que redescubrirlo (ni discutirlo de nuevo) cada seis meses.

**Cómo se lee cada decisión:** contexto (qué pasaba), decisión (qué se eligió) y consecuencias (qué implica).

**En esta página:** [Base del proyecto](#base-del-proyecto) · [Checkout y seguimiento](#checkout-y-seguimiento) · [Proceso y CI/CD](#proceso-y-cicd) · [Cómo agregar una decisión](#cómo-agregar-una-decisión)

---

## Base del proyecto

### D1. Contraste de texto en badges

- **Contexto.** El verde `#059669` y el ámbar `#d97706` sobre fondo claro dan un contraste menor a 4.5:1 para texto pequeño.
- **Decisión.** Se declararon los tokens `--color-emerald-text` (`#047857`) y `--color-amber-text` (`#b45309`) para el texto de los badges. Los tonos originales se mantienen para íconos y botones. Los bordes también son tokens, para no tener hexadecimales fuera de `@theme`.
- **Consecuencias.** Los badges cumplen contraste de accesibilidad sin perder la paleta de marca.

### D2. Precios y variantes resueltos desde el catálogo

- **Contexto.** `CartContext` debe exponer `addItem(variantId, quantity)`, `subtotal` y `totalItems` sin que los componentes importen los JSON.
- **Decisión.** `catalogService` expone `findVariantInCatalog(variantId)`. El carrito y el servicio de pedidos lo usan para obtener precio, nombre, talla y stock a partir del `variantId`. Si `localStorage` está bloqueado, el carrito funciona en memoria sin errores.
- **Consecuencias.** Hay una sola fuente de verdad para los precios, y el carrito no se rompe en navegadores con almacenamiento restringido.

### D3. Área táctil y tamaño de texto en móvil

- **Contexto.** Se exige un mínimo de 44 px de alto táctil y texto de 16 px en los campos para evitar el zoom automático de iOS.
- **Decisión.** `.btn-md` y `.btn-lg` garantizan `min-h-11` en móvil; `.input-element` usa `h-12 text-base sm:h-10 sm:text-sm`.
- **Consecuencias.** Los formularios son cómodos con el pulgar y no saltan al enfocar.

### D4. `HashRouter` como enrutador

- **Contexto.** El sitio se despliega como estático y no siempre se controla la configuración del servidor.
- **Decisión.** Se usa `HashRouter` (`/#/ruta`).
- **Consecuencias.** Funciona en cualquier hosting sin reglas de redirección. A cambio, las URLs llevan `#`. Si se pasa a `BrowserRouter`, el hosting debe redirigir todo a `index.html`.

---

## Checkout y seguimiento

### D5. Esquema Zod propio y resolver mínimo

- **Contexto.** `react-hook-form` necesita un "resolver" para usar Zod. La librería oficial (`@hookform/resolvers`) es una dependencia más.
- **Decisión.** Se escribió `shared/utils/zodResolver.js`, de unas 20 líneas, que convierte los errores de Zod al formato de `react-hook-form`.
- **Consecuencias.** Una dependencia menos que mantener. El costo es mantener ese archivo si Zod cambia su formato de errores; está cubierto por pruebas.

### D6. Zod 4

- **Contexto.** `npm audit` marcó una vulnerabilidad alta en Zod 3 (consumo excesivo de memoria con colecciones grandes, GHSA-mrhx-c7xc-m3w5).
- **Decisión.** Se actualizó a Zod 4.6.x. El único cambio de código fue la forma de declarar el mensaje en `z.enum` (`error` en lugar de `errorMap`).
- **Consecuencias.** Sin vulnerabilidades conocidas. Quien agregue esquemas nuevos debe usar la sintaxis de la v4.

### D7. El código de pedido viaja en la URL

- **Contexto.** Tras confirmar, hay que mostrar el pedido. Pasarlo solo por el estado de navegación se pierde al refrescar.
- **Decisión.** La confirmación vive en `/checkout/confirmacion?codigo=WEB-2026-XXXXX`; el estado de navegación queda como respaldo.
- **Consecuencias.** La página sobrevive a un refresco y se puede compartir. En modo mock, el pedido sigue en memoria de sesión, así que tras refrescar no se encuentra; con la API real esto no pasa.

### D8. `requestKey` contra el doble envío

- **Contexto.** Un doble clic, o reintentar tras un error de red, podría crear dos pedidos.
- **Decisión.** Se genera un `requestKey` (UUID) una vez por visita al checkout y se envía con el pedido. Los reintentos reutilizan la misma clave. El botón se deshabilita mientras envía.
- **Consecuencias.** El backend puede detectar duplicados (idempotencia). El backend **debe** implementar esa comprobación para que la protección sea completa.

### D9. Pedidos demo en modo mock

- **Contexto.** Probar el seguimiento exigía hacer una compra completa cada vez, y solo se veía el estado `PENDING`.
- **Decisión.** El servicio mock incluye cinco pedidos fijos (`WEB-2026-00001` a `00005`), uno por estado.
- **Consecuencias.** Se puede revisar cada variante del timeline directamente por URL. Ojo: los pedidos creados en la sesión tienen prioridad sobre los demo, y el correlativo mock también empieza en `00001`. Si creas un pedido nuevo, su código puede coincidir con uno demo y se mostrará el pedido nuevo. Es una limitación aceptada del modo mock.

### D10. `Map` para los pedidos demo

- **Contexto.** CodeQL detectó que buscar un pedido con `DEMO_ORDERS[codigo]()` permitía que un nombre controlado por el usuario alcanzara miembros heredados.
- **Decisión.** Los pedidos demo viven en un `Map`, que solo contiene lo que se le agrega.
- **Consecuencias.** Se eliminó la alerta y hay pruebas que vigilan nombres como `constructor` o `__proto__`.

### D11. Los precios los calcula el servicio

- **Contexto.** El navegador manda el precio en el carrito, pero no se debe confiar en él.
- **Decisión.** `createOrder` recalcula cada precio desde el catálogo y valida los datos otra vez, aunque el formulario ya lo haya hecho.
- **Consecuencias.** Un precio manipulado en el navegador no llega al pedido. Con la API real, el backend debe hacer lo mismo.

---

## Proceso y CI/CD

### D12. GitHub Actions en lugar de Jenkins

- **Contexto.** Se evaluó Jenkins para el CI/CD. Exige un servidor propio, plugins y mantenimiento, y requiere configurar tokens para ver los PRs.
- **Decisión.** El pipeline se implementó en **GitHub Actions**, integrado de forma nativa con los PRs, los checks y los entornos.
- **Consecuencias.** Sin servidor que mantener. Los workflows viven en el repositorio y se revisan como cualquier código.

### D13. Flujo `feature` → `develop` → `main`

- **Contexto.** Hacía falta un lugar donde integrar el trabajo del equipo antes de tocar producción.
- **Decisión.** Todo entra primero a `develop`; solo `develop` llega a `main`. El job *Política de ramas* lo hace cumplir en los PRs.
- **Consecuencias.** `main` siempre es publicable. Si la rama por defecto del repositorio es `main`, el cierre automático de issues no funciona en los PRs a `develop` (ver [Solución de problemas](Solucion-de-Problemas)).

### D14. Un PR por issue, con merge commit

- **Contexto.** Los PRs apilados (uno parte de la rama del otro) se rompen con *squash*, porque la segunda rama arrastra los commits ya reescritos.
- **Decisión.** Un PR por issue, con `Closes #N`, y fusionados con **merge commit** y en orden.
- **Consecuencias.** La historia se conserva, cada PR muestra solo lo suyo y es fácil rastrear qué PR resolvió qué issue.

### D15. Un check único para la protección de ramas

- **Contexto.** Exigir diez checks por separado es frágil: renombrar un job rompe la protección.
- **Decisión.** El job `CI aprobado` resume a los demás y es el único check requerido (junto con `Política de ramas`).
- **Consecuencias.** Se puede agregar o renombrar jobs sin tocar la configuración de GitHub.

### D16. El reporte de fallos vive dentro del pipeline

- **Contexto.** La primera versión del comentario del PR usaba un workflow aparte (`workflow_run`), que GitHub solo ejecuta si el archivo está en la rama por defecto.
- **Decisión.** Se movió a un job más de `ci.yml`.
- **Consecuencias.** Funciona desde cualquier rama. No comenta en PRs desde forks, porque ese token es de solo lectura.

### D17. Despliegues opcionales

- **Contexto.** Al configurar el CI aún no existían las credenciales de Vercel.
- **Decisión.** Los despliegues se activan con la variable `VERCEL_DEPLOY=true`.
- **Consecuencias.** El pipeline sirve desde el primer día para verificar; el despliegue se enciende cuando todo está configurado.

---

## Cómo agregar una decisión

Cuando tomes una decisión que otro tendría que preguntarte "¿y por qué así?", agrégala aquí con el siguiente formato:

```markdown
### D18. Título corto de la decisión

- **Contexto.** Qué problema o duda había.
- **Decisión.** Qué se eligió.
- **Consecuencias.** Qué mejora y qué costo trae.
```

Una buena regla: si dudaste más de diez minutos, merece una entrada.

---

Siguiente: [Solución de problemas](Solucion-de-Problemas)
