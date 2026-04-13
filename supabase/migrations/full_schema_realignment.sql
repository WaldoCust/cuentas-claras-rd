-- Full Schema Realignment & Security Hardening
-- Ensures the 'invoices' table is perfectly aligned with the fiscal engine

-- 1. Table Columns
ALTER TABLE public.invoices 
    -- Core Identity & Relations
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id),
    
    -- Direction & Document Type
    ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'issued', -- issued (sales/607), purchase (purchases/606)
    ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '607', -- 606, 607, e-CF
    
    -- Fiscal Data
    ADD COLUMN IF NOT EXISTS date_emission DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS ncf_number TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'issued', -- issued, voided, pending_signature
    ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'DOP',
    
    -- Accounting
    ADD COLUMN IF NOT EXISTS subtotal DECIMAL(14,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS itbis DECIMAL(14,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total DECIMAL(14,2) DEFAULT 0,
    
    -- Reporting Metadata (606 specific)
    ADD COLUMN IF NOT EXISTS is_deductible BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Transferencia',
    ADD COLUMN IF NOT EXISTS expense_type TEXT DEFAULT '02',
    
    -- Reporting Metadata (607 specific)
    ADD COLUMN IF NOT EXISTS revenue_type TEXT DEFAULT '01',
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid',
    ADD COLUMN IF NOT EXISTS reporting_status TEXT DEFAULT 'pending';

-- 2. Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies (Owner Only)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;
END$$;

CREATE POLICY "Users can view their own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON public.invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON public.invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" ON public.invoices
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Foreign Key Relationships (Manual synchronization if schema cache is stale)
ALTER TABLE public.invoices 
    DROP CONSTRAINT IF EXISTS invoices_client_id_fkey,
    ADD CONSTRAINT invoices_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- 5. Profiles Safety Backfill
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'admin',
    ADD COLUMN IF NOT EXISTS email TEXT;

-- 6. Optimized Reporting Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_dashboard_query 
    ON public.invoices(user_id, direction, date_emission DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_reporting 
    ON public.invoices(direction, type, status);
