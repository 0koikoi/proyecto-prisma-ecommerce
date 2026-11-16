# Buenas prácticas

Los acuerdos del equipo para escribir código que otro pueda leer, cambiar y confiar en él. No son reglas por capricho: cada una nace de algo que ya pasó o de un problema que queremos evitar.

**En esta página:** [React](#react) · [Datos y servicios](#datos-y-servicios) · [Formularios](#formularios) · [Seguridad](#seguridad) · [Accesibilidad](#accesibilidad) · [Rendimiento](#rendimiento) · [Estilos](#estilos) · [Revisión de código](#revisión-de-código)

---

## React

**Componentes pequeños y con un solo trabajo.** Si un componente pasa de unas 150 líneas o hace dos cosas, probablemente son dos componentes. El checkout, por ejemplo, separa `OrderSummary` y `ChoiceChips` en lugar de mezclarlo todo en la página.

**Cancela lo que ya no importa.** Al pedir datos en un `useEffect`, protege contra respuestas que llegan tarde:

```jsx
useEffect(() => {
  let esLaPeticionActual = true;
  servicio.obtener(id).then((dato) => {
    if (esLaPeticionActual) setDato(dato);
  });
  return () => { esLaPeticionActual = false; };
}, [id]);
```

Sin esto, si el usuario cambia de pantalla rápido, una respuesta vieja puede pisar el estado nuevo.

**Los hooks no se llaman condicionalmente.** Si necesitas salir antes (por ejemplo, redirigir con carrito vacío), declara todos los hooks primero y haz el `return` después.

**Estado derivado se calcula, no se guarda.** El subtotal sale de los artículos del carrito; no es otro estado que haya que mantener sincronizado.

**`key` estable.** En listas usa un identificador real (`variantId`), nunca el índice si la lista puede cambiar de orden.

## Datos y servicios

1. **Nada de `fetch` ni JSON dentro de componentes.** Todo pasa por un servicio. Eso permite pasar de mock a API real sin tocar la interfaz.
2. **El servidor tiene la última palabra.** El formulario valida para ayudar al usuario; el servicio **vuelve a validar** y **recalcula los precios**, porque lo que viene del navegador no es de fiar.
3. **Cada pantalla contempla cuatro estados**: cargando, con datos, error (con "Reintentar") y vacío. Si falta uno, hay un hueco en la experiencia.
4. **Errores con sentido.** Un error de red y un "no existe" no se muestran igual: el segundo se detecta con `error.status === 404`.

## Formularios

- **Define las reglas en un esquema (Zod), no dentro del componente.** Así se prueban sin navegador y se reutilizan.
- **Sanitiza mientras escribe** lo que tenga formato fijo (teléfono, DNI). La validación nunca debería ver basura.
- **Evita el doble envío.** Deshabilita el botón mientras se envía y manda un `requestKey` único por intento.
- **No borres lo que el usuario escribió si hubo un error.** Y vacía el carrito solo cuando el pedido salió bien.
- **Mensajes que dicen qué hacer**, no solo qué está mal: "Ingresa un celular de 9 dígitos que empiece con 9".

## Seguridad

> [!WARNING]
> Esta es la sección que más cuesta si se descuida. Léela con calma.

**Secretos.** Nunca en el código ni en el repositorio. Las claves van en variables de entorno y en los *Secrets* de GitHub. El CI bloquea los archivos `.env` versionados y busca patrones de credenciales; si salta, **cambia la clave expuesta**, porque borrarla del repo no basta: queda en el historial.

**Variables `VITE_*` son públicas.** Todo lo que empieza con `VITE_` termina dentro del JavaScript que descarga el navegador. Nunca pongas ahí una clave privada.

**Nunca uses un valor del usuario como nombre de propiedad o método.** Este fue un hallazgo real de CodeQL en el proyecto:

```js
// Mal: un nombre como "constructor" podría alcanzar miembros heredados del objeto
return DEMO_ORDERS[codigo]();

// Bien: un Map solo contiene lo que tú le pusiste
if (DEMO_ORDERS.has(codigo)) return DEMO_ORDERS.get(codigo)();
```

**Valida en la frontera.** Toda entrada del usuario (formulario, URL, parámetros) se valida antes de usarse. Los códigos de pedido de la URL se normalizan y se codifican con `encodeURIComponent` al construir enlaces.

**Enlaces externos.** Los `target="_blank"` llevan `rel="noopener noreferrer"`.

**Dependencias.** Cada PR pasa por `npm audit`. Cuando una dependencia tiene una vulnerabilidad alta, se actualiza; así se subió `zod` a la v4. No desactives la auditoría para que "pase".

## Accesibilidad

La accesibilidad no es un extra: forma parte de que algo esté terminado.

- **Zonas táctiles de al menos 44 px.**
- **Usa el elemento correcto.** Un botón es `<button>`, un enlace es `<a>`/`<Link>`. No pongas `onClick` en un `<div>`.
- **Etiquetas en todos los campos** y errores con `role="alert"`.
- **El color no es el único mensaje.** Acompaña con texto o ícono.
- **Íconos decorativos con `aria-hidden="true"`**; botones solo con ícono con `aria-label`.
- **Desplegables:** `aria-expanded` y `aria-controls`.
- **Respeta `prefers-reduced-motion`.**
- **Pasos y progreso:** indica el actual con `aria-current="step"` (como hace el timeline del seguimiento).

## Rendimiento

- **Imágenes** con `loading="lazy"`, proporción fija (`aspect-[3/4]`) y un placeholder si no hay foto, para que la página no salte al cargar.
- **Esqueletos en lugar de pantallas en blanco.**
- **Presupuesto de bundle:** el JavaScript total no debe pasar de 900 KB. El CI lo mide en cada PR.
- **Animaciones baratas.** Anima `transform` y `opacity`, no propiedades que obliguen a recalcular el layout.
- **No importes una librería entera por una función.** Importa solo lo que usas (por ejemplo, íconos puntuales de `lucide-react`).

## Estilos

- **Todo sale de los tokens de `index.css`.** Nada de hexadecimales sueltos en componentes.
- **Móvil primero.** Escribe los estilos base para móvil y amplía con `sm:`, `md:` y `lg:`.
- **Reutiliza antes de crear.** Antes de un botón nuevo, mira `Button`; antes de un aviso, `Badge` o `Toast`.
- Detalle completo en la [Guía de estilo](Guia-de-Estilo).

## Revisión de código

**Quien abre el PR:**

- Revisa tu propio diff antes de pedir revisión: casi siempre encuentras algo.
- Mantén el PR enfocado en un issue. Si es grande, explica cómo leerlo en la descripción.
- Responde cada comentario: lo corriges, o explicas por qué no.

**Quien revisa:**

- Empieza por entender **qué problema resuelve**, no por criticar el estilo.
- Distingue lo que **bloquea** (un bug, un riesgo de seguridad) de lo que es **sugerencia**.
- Sé específico y amable: "esto puede romperse si el carrito está vacío, ¿lo probamos?" funciona mejor que "esto está mal".
- Aprueba cuando el cambio **mejora el código y es seguro**, aunque tú lo habrías escrito distinto.

---

Siguiente: [Decisiones técnicas](Decisiones-Tecnicas)
