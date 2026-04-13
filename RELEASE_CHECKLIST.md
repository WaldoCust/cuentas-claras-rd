# Release Checklist: Production Readiness

Perform these checks before marking a version as "Production Ready."

## 1. Security & Identity
- [ ] No hardcoded credentials in `src/lib/data/` or `src/lib/auth/`.
- [ ] Middleware correctly redirects unauthenticated users to `/login`.
- [ ] Role-based access (RBAC) hides "Configuración" for `viewer` roles.
- [ ] Supabase RLS policies are enabled on all active tables (clients, invoices, purchases, sales).

## 2. Fiscal Integrity (The "Dominican Test")
- [ ] NCF generation follows the correct format (B01, B02, etc.).
- [ ] ITBIS calculations on the dashboard match manual aggregation of 606/607 data.
- [ ] 606/607 exports generate valid `.txt` patterns (header code, RNC length, date formats).

## 3. Operations & Observability
- [ ] `validateEnv()` passes in a production-like local environment.
- [ ] Vision API successfully parses a test business receipt.
- [ ] Global Error Boundary (`src/app/error.js`) renders correctly when a crash is simulated.
- [ ] Custom 404 page is active for non-existent routes.

## 4. UI/UX Resilience
- [ ] Loading states are visible when fetching dashboard summaries.
- [ ] Responsive design verified for mobile/tablet resolutions.
- [ ] No "Demo Data" or "Placeholder" text remains in core accounting modules.

## 5. Metadata & Documentation
- [ ] `activity_summary.json` reflects the latest step completion.
- [ ] `.env.example` is sync'd with any new config keys.
- [ ] README accurately describes the current platform capabilities.
