-- Hotfix: Add missing date_emission column to invoices table
ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS date_emission DATE DEFAULT CURRENT_DATE;

-- Backfill data: If issue_date existed in any form or created_at
UPDATE public.invoices 
SET date_emission = COALESCE(
    CAST(NULLIF(created_at::text, '') AS DATE), 
    CURRENT_DATE
)
WHERE date_emission IS NULL;

-- Re-apply or ensure indexes exist for the dashboard queries
CREATE INDEX IF NOT EXISTS idx_invoices_date_emission ON public.invoices(date_emission DESC);

-- Cleanup (optional): If issue_date was used, we can keep it for safety or redirect it
-- For this project, we are standardizing on date_emission.
