-- Refine invoices table for Step 7
ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS ncf_type TEXT,
    ADD COLUMN IF NOT EXISTS ncf_number TEXT,
    ADD COLUMN IF NOT EXISTS invoice_number_internal TEXT,
    ADD COLUMN IF NOT EXISTS due_date DATE,
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS itbis NUMERIC(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total NUMERIC(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'DOP',
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft', -- draft, issued, paid, voided, rejected
    ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS dgii_sync_status TEXT DEFAULT 'pending', -- pending, synced, error
    ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'purchase'; -- purchase (606), issued (Sale/607)

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_direction ON public.invoices(direction);

-- RLS Update (Optional but good)
-- Policies usually exist for invoices, but let's ensure 'client_id' doesn't break anything.
-- Existing policies on user_id should be enough.
