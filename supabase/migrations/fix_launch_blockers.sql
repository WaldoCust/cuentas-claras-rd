-- Step 19: Fix Launch Blockers & Schema Alignment
-- This migration ensures the 'invoices' table has the exact columns required by the 606/607 engine
-- and the components currently in the codebase.

ALTER TABLE public.invoices 
    -- Fiscal alignment for 606
    ADD COLUMN IF NOT EXISTS rnc_target TEXT, -- The RNC of the supplier (for purchases) or client (for sales)
    ADD COLUMN IF NOT EXISTS target_name TEXT, -- The name of the supplier/client for one-off entries
    
    -- Source tracking
    ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual', -- 'manual', 'ai_parsed', 'invoice_linked'
    
    -- Date Archival tracking
    ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Ensure numeric columns are decimal for precision
ALTER TABLE public.invoices 
    ALTER COLUMN subtotal SET DATA TYPE DECIMAL(14,2),
    ALTER COLUMN itbis SET DATA TYPE DECIMAL(14,2),
    ALTER COLUMN total SET DATA TYPE DECIMAL(14,2);

-- Fix direction defaults if missing
UPDATE public.invoices SET direction = 'purchase' WHERE type = '606' AND direction IS NULL;
UPDATE public.invoices SET direction = 'issued' WHERE (type = '607' OR type = 'e-CF') AND direction IS NULL;

-- Soft-fix for legacy field mapping in code
-- Some parts of the app might still look for 'expense_type' vs 'revenue_type'
-- We've already ensured both exist in invoices table.
