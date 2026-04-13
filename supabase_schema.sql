-- CuentasClarasRD Database Schema

-- 1. Profiles Table (Business Information)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  rnc TEXT,
  business_name TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Invoices Table (606 and 607 Data)
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('606', '607')) NOT NULL,
  ncf TEXT NOT NULL,
  rnc_target TEXT NOT NULL, -- The RNC of the supplier or client
  target_name TEXT,
  date_emission DATE NOT NULL,
  date_payment DATE,
  amount_gross DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount_itbis DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices." ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices." ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices." ON invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices." ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- 3. NCF Sequences (Optional: to track used vs available NCFs)
CREATE TABLE ncf_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type_code TEXT NOT NULL, -- e.g. '01', '02', '31'
  prefix TEXT NOT NULL, -- e.g. 'B' or 'E'
  current_sequence BIGINT DEFAULT 1,
  max_sequence BIGINT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for ncf_sequences
ALTER TABLE ncf_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sequences." ON ncf_sequences
  FOR SELECT USING (auth.uid() = user_id);
