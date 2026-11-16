# CI/CD (GitHub Actions + Vercel)

## Branch model

`feature/*` -> PR to `develop` -> PR `develop` -> `main`. Nothing reaches `main` without passing through `develop`.

## Workflows

| File | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Main pipeline (checks, deploys, release) |
| `.github/workflows/vercel-deploy.yml` | Reusable Vercel deploy + smoke test |
| `.github/workflows/codeql.yml` | CodeQL static analysis (PRs, pushes, weekly) |
| `.github/actions/setup-frontend` | Composite action: Node + `npm ci` with cache |
| `.github/dependabot.yml` | Weekly npm and Actions updates, targeting `develop` |
| `.github/pull_request_template.md` | PR template with `Closes #` |

## Jobs in `ci.yml`

| Job | When | What |
| --- | --- | --- |
| Branch policy | PRs | Rejects PRs to `main` that do not come from `develop` |
| PR hygiene | PRs | Conventional Commit title (blocking); `Closes #N` present (warning) |
| Lint | always | `oxlint` |
| Tests | always | Vitest on Node 20 and 22, coverage thresholds, JUnit + lcov artifacts, summary |
| Build | always | `vite build`, JS budget (`BUNDLE_BUDGET_KB`), `dist` artifact |
| Lighthouse | always | Performance/a11y report on the build (non-blocking) |
| Dependency audit | always | `npm audit --omit=dev --audit-level=high` |
| Dependency review | PRs | Flags vulnerable new dependencies (non-blocking) |
| Secret scan | always | Credential patterns and tracked `.env` files |
| Workflow lint | always | `actionlint` over the workflows |
| **CI passed** | always | Aggregates the required jobs: the single required check |
| Preview for PR | same-repo PRs | Vercel preview + sticky PR comment with the URL |
| Deploy staging | push `develop` | Vercel preview + smoke test |
| Deploy production | push `main` | Vercel production + smoke test, behind the `production` environment |
| GitHub Release | after production | Tag `release-YYYYMMDD-N` with generated notes |

## Setup

1. Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
2. Variable `VERCEL_DEPLOY=true` enables deploys (otherwise only CI runs). Optional: `VITE_API_URL`, `VITE_USE_MOCK`, `VITE_WHATSAPP_NUMBER`.
3. Settings > Environments: `production` (required reviewers) and `staging`.
4. Branch protection on `develop` and `main`: require `CI passed` and `Branch policy`, require PRs, block force pushes.
5. Vercel project with **Root Directory empty** (the CLI runs inside `frontend/`). `frontend/vercel.json` sets caching and security headers; the app uses `HashRouter`, so no SPA rewrites are needed.
6. CodeQL needs GitHub Advanced Security on private repos (free on public ones).

## Local equivalent

```bash
cd frontend && npm ci && npm run lint && npm run test:coverage && npm run build
```
