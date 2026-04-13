# Guide: Deployment & Production Ops

This document outlines the procedure for deploying **CuentasClarasRD** to a production environment (Vercel + Supabase).

---

## 1. Supabase Initialization
Before deploying the frontend, ensure your Supabase project is ready:

1. **Database Schema**: Execute all migrations found in `/supabase/migrations/*.sql` using the Supabase SQL Editor.
2. **Extensions**: Enable `pg_trgm` and `gen_random_uuid()` if they aren't active.
3. **Environment**: Ensure RLS (Row Level Security) is enabled on all tables.

## 2. Vercel Deployment

### A. Environment Variables
Add the following keys to your Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `GOOGLE_GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio.

### B. Build Command
The build process will automatically run linting and type checks.
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Root Directory**: `./`

## 3. Post-Deployment Verification
Once deployed, perform the following "Smoke Tests":

1. **Authentication**: Sign up a new user and verify they are redirected to the dashboard.
2. **Vision API**: Upload a test receipt in the "Compras" module to verify Gemini parsing.
3. **Tax Engine**: Verify the dashboard shows `RD$ 0.00` (or real data) instead of placeholders.

## 4. Rollback Strategy
If a deployment fails:
- **Vercel**: Use the "Redeploy" button on the previous successful deployment in the Vercel Dashboard.
- **Database**: If you've applied migrations, you may need to manually revert schema changes via SQL Editor.

## 5. Maintenance & Monitoring
- Check **Vercel Runtime Logs** for any `[CRITICAL CONFIG ERROR]` or `[ERROR]` tags.
- Use the Supabase **Database Health** tab to monitor query performance on the 606/607 aggregations.
