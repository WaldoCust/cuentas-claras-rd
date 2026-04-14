-- ==========================================
-- LAUNCH READINESS: FINAL STRUCTURAL HARDENING
-- Step 22: Resolving QA Critical Blockers
-- ==========================================

-- 1. Ensure Profiles has correct columns
DO $$ 
BEGIN
    -- Fix: Ensure profiles has user_id (not just id)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        -- If id was used as user_id, we might need a data migration, but safely just add it.
    END IF;

    -- Ensure business_name and rnc exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_name') THEN
        ALTER TABLE public.profiles ADD COLUMN business_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rnc') THEN
        ALTER TABLE public.profiles ADD COLUMN rnc TEXT;
    END IF;
END $$;

-- 2. Ensure Invoices (Fiscal Engine) has correct columns
ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS itbis NUMERIC(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total NUMERIC(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'purchase',
    ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '606',
    ADD COLUMN IF NOT EXISTS rnc_target TEXT,
    ADD COLUMN IF NOT EXISTS target_name TEXT,
    ADD COLUMN IF NOT EXISTS expense_type TEXT DEFAULT '02',
    ADD COLUMN IF NOT EXISTS revenue_type TEXT DEFAULT '01',
    ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual',
    ADD COLUMN IF NOT EXISTS is_deductible BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Transferencia',
    ADD COLUMN IF NOT EXISTS ncf_number TEXT;

-- 3. Ensure Clients table is also aligned
ALTER TABLE public.clients
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS rnc_or_cedula TEXT,
    ADD COLUMN IF NOT EXISTS business_name TEXT;

-- 4. Correct Constraints & Indexes
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- 5. RLS Policies Verification
-- Ensure users can only see their own data
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Invoices Policies
    DROP POLICY IF EXISTS "Users can manage their own invoices" ON public.invoices;
    CREATE POLICY "Users can manage their own invoices" ON public.invoices 
        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Profiles Policies
    DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.profiles;
    CREATE POLICY "Users can manage their own profiles" ON public.profiles 
        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Clients Policies
    DROP POLICY IF EXISTS "Users can manage their own clients" ON public.clients;
    CREATE POLICY "Users can manage their own clients" ON public.clients 
        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
END $$;
