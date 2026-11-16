# CI/CD (GitHub Actions + Vercel)

## Modelo de ramas

`feature/*` → PR a `develop` → PR `develop` → `main`. Nada llega a `main` sin pasar por `develop`.

## Workflows

| Archivo | Para qué sirve |
| --- | --- |
| `.github/workflows/ci.yml` | Pipeline principal (verificaciones, despliegues y release) |
| `.github/workflows/vercel-deploy.yml` | Despliegue reutilizable a Vercel con prueba de humo |
| `.github/workflows/codeql.yml` | Análisis estático con CodeQL (PRs, pushes y semanal) |
| `.github/actions/setup-frontend` | Acción compuesta: Node + `npm ci` con caché |
| `.github/dependabot.yml` | Actualizaciones semanales de npm y Actions hacia `develop` |
| `.github/pull_request_template.md` | Plantilla de PR con `Closes #` |

## Jobs de `ci.yml`

| Job | Cuándo | Qué hace |
| --- | --- | --- |
| Política de ramas | PRs | Rechaza PRs a `main` que no vengan de `develop` |
| Higiene del PR | PRs | Título con Conventional Commits (bloquea); `Closes #N` presente (advertencia) |
| Lint | siempre | `oxlint` |
| Pruebas | siempre | Vitest en Node 20 y 22, umbrales de cobertura, reportes JUnit y lcov, resumen |
| Compilación | siempre | `vite build`, presupuesto de JS (`BUNDLE_BUDGET_KB`), artefacto `dist` |
| Lighthouse | siempre | Reporte de rendimiento y accesibilidad (no bloquea) |
| Auditoría de dependencias | siempre | `npm audit --omit=dev --audit-level=high` |
| Revisión de dependencias | PRs, opcional | Señala dependencias nuevas vulnerables; requiere el grafo de dependencias y `DEPENDENCY_REVIEW=true` |
| Escaneo de secretos | siempre | Patrones de credenciales y archivos `.env` versionados |
| Lint de workflows | siempre | `actionlint` sobre los workflows |
| **CI aprobado** | siempre | Agrupa los jobs requeridos: es el único check obligatorio |
| Reporte en el PR | PRs del mismo repo | Comenta qué falló, en qué paso y cómo corregirlo (o avisa que todo pasó) |
| Vista previa del PR | PRs del mismo repo | Vista previa en Vercel y comentario con la URL |
| Desplegar staging | push a `develop` | Vista previa en Vercel + prueba de humo |
| Desplegar producción | push a `main` | Producción en Vercel + prueba de humo, con aprobación del entorno `production` |
| Release en GitHub | tras producción | Tag `release-AAAAMMDD-N` con notas generadas |

## Reporte de fallos en el PR

Al terminar el CI de un PR, el job `Reporte en el PR` publica (y luego actualiza) un único comentario con:

- los jobs que fallaron, el paso exacto y el enlace a sus logs;
- una pista para corregirlo (por ejemplo, el comando local que conviene correr);
- un aviso corto cuando todo queda en verde.

Corre dentro del propio workflow, así que funciona desde cualquier rama sin depender de la rama por defecto. En PRs desde forks no comenta, porque ese token es de solo lectura.

## Configuración

1. Secretos: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
2. Variable `VERCEL_DEPLOY=true` para activar los despliegues (sin ella solo corre CI). Opcionales: `VITE_API_URL`, `VITE_USE_MOCK`, `VITE_WHATSAPP_NUMBER`, `DEPENDENCY_REVIEW`.
3. Settings → Environments: `production` (con revisores obligatorios) y `staging`.
4. Protección de ramas en `develop` y `main`: exigir `CI aprobado` y `Política de ramas`, exigir PR y bloquear force push.
5. Proyecto de Vercel con el **Root Directory vacío** (la CLI corre dentro de `frontend/`). `frontend/vercel.json` define caché y cabeceras de seguridad; la app usa `HashRouter`, así que no hacen falta rewrites.
6. CodeQL requiere GitHub Advanced Security en repos privados (gratis en públicos).

## Equivalente local

```bash
cd frontend && npm ci && npm run lint && npm run test:coverage && npm run build
```
