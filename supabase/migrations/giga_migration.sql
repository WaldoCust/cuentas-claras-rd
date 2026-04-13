-- ==========================================
-- GIGA-MIGRATION: The Definitive Structural Fix
-- CuentasClarasRD | Production Schema v1.3 (Elite Edition)
-- ==========================================

-- 1. UTILITIES & TYPES
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'accountant', 'viewer');
    END IF;
END$$;

-- 2. PROFILES TABLE (User metadata & roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role user_role NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Backfill Elite fields for Profiles
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS business_name TEXT,
    ADD COLUMN IF NOT EXISTS rnc TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL; END $$;

-- 3. CLIENTS TABLE (606/607 entity tracking)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    display_name TEXT,
    rnc_or_cedula TEXT NOT NULL,
    document_type TEXT NOT NULL DEFAULT 'RNC',
    fiscal_type TEXT NOT NULL DEFAULT 'Crédito Fiscal',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_active_client_rnc UNIQUE (user_id, rnc_or_cedula)
);

-- Backfill Elite fields for Clients (Fixes the 400 Bad Request)
ALTER TABLE public.clients 
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS behavior TEXT DEFAULT 'Óptima',
    ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
    DROP POLICY IF EXISTS "Users can create their own clients" ON public.clients;
    DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
    DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
    
    CREATE POLICY "Users can view their own clients" ON public.clients FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can create their own clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own clients" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own clients" ON public.clients FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL; END $$;

-- 4. INVOICES TABLE (The central fiscal engine)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    direction TEXT DEFAULT 'issued',
    type TEXT DEFAULT '607',
    date_emission DATE DEFAULT CURRENT_DATE,
    ncf_number TEXT,
    status TEXT DEFAULT 'issued',
    currency TEXT DEFAULT 'DOP',
    subtotal DECIMAL(14,2) DEFAULT 0,
    itbis DECIMAL(14,2) DEFAULT 0,
    total DECIMAL(14,2) DEFAULT 0,
    is_deductible BOOLEAN DEFAULT TRUE,
    payment_method TEXT DEFAULT 'Transferencia',
    expense_type TEXT DEFAULT '02',
    revenue_type TEXT DEFAULT '01',
    payment_status TEXT DEFAULT 'paid',
    reporting_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sync columns and constraints for existing Invoices
ALTER TABLE public.invoices 
    ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'issued',
    ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'issued',
    ADD COLUMN IF NOT EXISTS type TEXT DEFAULT '607',
    ADD COLUMN IF NOT EXISTS date_emission DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS total DECIMAL(14,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS revenue_type TEXT DEFAULT '01';

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;

    CREATE POLICY "Users can view their own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own invoices" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own invoices" ON public.invoices FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL; END $$;

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_invoices_dashboard_query ON public.invoices(user_id, direction, date_emission DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_reporting ON public.invoices(direction, type, status);

-- 6. TIMESTAMPS AUTOMATION
DO $$ BEGIN
    -- Profiles Trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    
    -- Clients Trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_clients_updated_at') THEN
        CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    -- Invoices Trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoices_updated_at') THEN
        CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
EXCEPTION WHEN others THEN NULL; END $$;
