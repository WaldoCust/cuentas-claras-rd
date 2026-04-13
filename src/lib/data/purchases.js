import { createClient as getSupabase } from '@/lib/supabase/client';

export const getPurchases = async (filters = {}) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .eq('direction', 'purchase');

  if (filters.rnc) {
    query = query.ilike('rnc_target', `%${filters.rnc}%`);
  }

  if (filters.category) {
    query = query.eq('revenue_type', filters.category);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('date_emission', { ascending: false });

  if (error) {
    console.error("Error fetching purchases:", JSON.stringify(error, null, 2));
    return [];
  }
  return data;
};

export const createPurchase = async (purchaseData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required");

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      ...purchaseData,
      user_id: user.id,
      direction: 'purchase',
      type: '606', // Keep for backward compatibility/reporting
      status: purchaseData.status || 'confirmed'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePurchase = async (id, updates) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('invoices')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const archivePurchase = async (id) => {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('invoices')
    .update({ 
      status: 'archived',
      archived_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};

export const getITBISAdelantadoTotal = async () => {
  const purchases = await getPurchases();
  return purchases.reduce((sum, p) => sum + (parseFloat(p.amount_itbis) || 0), 0);
};
