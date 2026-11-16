# Solución de problemas

Las preguntas que más se repiten, con su causa real y la salida. Si algo no está aquí y te costó más de media hora, agrégalo cuando lo resuelvas.

**En esta página:** [Entorno local](#entorno-local) · [Pruebas y cobertura](#pruebas-y-cobertura) · [CI en rojo](#ci-en-rojo) · [Git y PRs](#git-y-prs) · [Issues](#issues) · [Despliegue](#despliegue)

---

## Entorno local

### La pantalla de confirmación dice "No encontramos tu pedido" después de refrescar

**Causa.** En modo mock, los pedidos viven en memoria de la sesión. Al refrescar la página, se pierden.

**Salida.** Es el comportamiento esperado en mock. Para probar el seguimiento sin hacer una compra, usa los pedidos demo: `/#/pedido/WEB-2026-00003`. Con la API real no ocurre.

### Las rutas dan 404 al recargar en producción

**Causa.** Con `BrowserRouter`, el servidor debe devolver `index.html` para cualquier ruta.

**Salida.** El proyecto usa `HashRouter` justamente para evitarlo: las rutas son `/#/ruta`. Si cambiaste a `BrowserRouter`, configura la redirección en el hosting.

### El botón de WhatsApp abre un número que no es de la tienda

**Causa.** El número por defecto (`51999999999`) es un placeholder.

**Salida.** Define `VITE_WHATSAPP_NUMBER` en `.env` y en las variables del repositorio, con formato internacional y sin `+`.

### `npm ci` falla o instala versiones distintas

**Causa.** El `package-lock.json` no está sincronizado con `package.json`, o tienes otra versión de Node.

**Salida.** Usa Node 20 o 22. Si cambiaste dependencias, corre `npm install` una vez y sube el `package-lock.json` actualizado.

---

## Pruebas y cobertura

### El CI falla con "Coverage ... does not meet global threshold"

**Causa.** Agregaste lógica a la cobertura sin suficientes pruebas, o las pruebas no ejercitan todas las funciones. Un caso real: unos pedidos demo se definían como funciones y la prueba solo ejecutaba una; las otras contaban como sin cubrir.

**Salida.** Corre `npm run test:coverage` y revisa qué archivo baja el promedio. Agrega pruebas para las ramas y funciones sin ejecutar. Una tabla con `it.each` suele ser la forma más corta.

### Las pruebas pasan en mi máquina y fallan en el CI

**Causa habitual.** Diferencia de versión de Node (el CI prueba 20 y 22) o un archivo que no subiste.

**Salida.** Corre `npm ci` en lugar de `npm install`, prueba con la otra versión de Node y revisa `git status` para ver si olvidaste un archivo nuevo.

---

## CI en rojo

### "Dependency audit" falla con una vulnerabilidad alta

**Causa.** Una dependencia tiene un aviso de seguridad. Así pasó con Zod 3.

**Salida.** Mira qué paquete es en el log, actualízalo (`npm update paquete` o la versión mayor que lo corrige) y corre las pruebas. No desactives la auditoría.

### CodeQL marca un problema en el código nuevo

**Causa.** El análisis estático encontró un patrón inseguro. Un caso real fue usar un valor del usuario como nombre de método (`objeto[codigo]()`).

**Salida.** Abre el comentario en línea del PR: indica la línea y el motivo. El comentario está en inglés porque lo escribe GitHub. Corrige el patrón (por ejemplo, usando un `Map`) y agrega una prueba.

### "Política de ramas" falla

**Causa.** Abriste un PR hacia `main` desde una rama que no es `develop`.

**Salida.** Cierra ese PR y ábrelo hacia `develop`. Solo `develop` puede ir a `main`.

### "Higiene del PR" falla

**Causa.** El título no sigue Conventional Commits.

**Salida.** Edita el título del PR con el formato `tipo(alcance): descripción`, por ejemplo `feat(checkout): agrega formulario (#9)`.

### Aparecen advertencias de "Node.js 20 is deprecated"

**Causa.** No es tu código: son las acciones de GitHub que usa el pipeline, hechas para el runtime Node 20, que GitHub está retirando.

**Salida.** Subir las acciones a su última versión mayor. Dependabot lo propone cada semana.

### No aparece el comentario del bot en mi PR

**Causas posibles.** El PR viene de un fork (el token es de solo lectura), el CI todavía no terminó, o el job *Reporte en el PR* no se ejecutó.

**Salida.** Espera a que termine el CI y revisa la pestaña *Checks*. Si el PR es de un fork, mira el resultado directamente en *Checks*.

---

## Git y PRs

### Mi PR dice que está desactualizado respecto a `develop`

**Causa.** `develop` avanzó desde que creaste tu rama.

**Salida.** Usa el botón *Update branch* del PR, o en local `git merge origin/develop` y vuelve a subir. Espera de nuevo al CI.

### Git dice "Your local changes would be overwritten by checkout"

**Causa.** Tienes cambios sin guardar en archivos que también difieren en la otra rama.

**Salida.** Guárdalos con un commit o con `git stash`, cambia de rama y recupéralos con `git stash pop`.

### Subí un commit con un secreto

**Causa.** Un `.env` o una clave quedó dentro de un commit.

**Salida.** Lo primero es **cambiar la clave**: aunque borres el archivo, queda en el historial. Después avisa al equipo para decidir si hace falta limpiar el historial.

### Mi PR apilado muestra commits de otro PR

**Causa.** Tu rama parte de la rama de otro PR que aún no se fusionó, así que su diff incluye esos commits.

**Salida.** Es normal. Se reduce a lo tuyo cuando el PR anterior se fusiona. Fusiona siempre en orden y con **merge commit**, no con squash.

---

## Issues

### Fusioné el PR con `Closes #N` y el issue sigue abierto

**Causa.** GitHub solo cierra issues cuando el PR llega a la **rama por defecto** del repositorio. Si esa rama es `main` y el PR fue a `develop`, no se cierra solo.

**Salida.**

| Opción | Cómo |
| :--- | :--- |
| **A mano** | Cierra el issue dejando el PR: `gh issue close 10 --reason completed --comment "Resuelto en #19."` |
| **Con el PR a `main`** | Repite `Closes #N` en la descripción del PR de `develop` a `main` |
| **Definitiva** | Que el administrador cambie la rama por defecto a `develop` (Settings, Branches) |

### El issue no muestra el PR en "Development"

**Causa.** Es el mismo motivo: sin la rama por defecto, GitHub no registra el vínculo automático.

**Salida.** Enlázalo a mano desde el panel derecho del issue (*Development*, *Link a pull request*).

---

## Despliegue

### El job de despliegue aparece como "omitido"

**Causa.** Los despliegues están apagados hasta que se define `VERCEL_DEPLOY=true`.

**Salida.** Un administrador debe agregar esa variable y los tres secretos de Vercel. Ver [CI/CD](CI-CD).

### El despliegue falla al descargar la configuración de Vercel

**Causa habitual.** El token o los identificadores son incorrectos, o el proyecto tiene un *Root Directory* configurado.

**Salida.** Verifica `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`, y deja el *Root Directory* del proyecto de Vercel **vacío**.

---

Siguiente: [Equipo y reparto](Equipo-y-Reparto)
