-- Step 8: Hardening Purchases for 606
ALTER TABLE public.invoices
    ADD COLUMN IF NOT EXISTS is_deductible BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Transferencia', -- Efectivo, Tarjeta, Transferencia, Permuta, etc.
    ADD COLUMN IF NOT EXISTS expense_type TEXT DEFAULT '02'; -- DGII 606 Category Codes (01-11)

-- Update direction for existing 606 entries if needed
UPDATE public.invoices SET direction = 'purchase' WHERE type = '606';

-- Add specific index for 606 reporting lookups
CREATE INDEX IF NOT EXISTS idx_invoices_606_report ON public.invoices(direction, date_emission, status);
