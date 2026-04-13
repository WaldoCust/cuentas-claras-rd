-- Step 9: Hardening Sales for 607
ALTER TABLE public.invoices
    ADD COLUMN IF NOT EXISTS revenue_type TEXT DEFAULT '01', -- DGII 607 Revenue Category Codes (01-07)
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid', -- pending, paid, partial
    ADD COLUMN IF NOT EXISTS reporting_status TEXT DEFAULT 'pending'; -- pending, reported, excluded

-- Ensure direction for existing Sales entries
UPDATE public.invoices SET direction = 'issued' WHERE type = '607';

-- Add index for revenue reporting
CREATE INDEX IF NOT EXISTS idx_invoices_607_report ON public.invoices(direction, date_emission, revenue_type);
