import { createClient as getSupabase } from '@/lib/supabase/client';

/**
 * Fetches sales records for the current user.
 * Includes both manually entered sales and issued invoices.
 * @param {object} filters 
 * @returns {Promise<Array>}
 */
export const getSales = async (filters = {}) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('invoices')
    .select(`
      *,
      client:client_id (
        business_name,
        rnc_or_cedula
      )
    `)
    .eq('user_id', user.id)
    .eq('direction', 'issued'); // Direction 'issued' covers Sales/607

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.revenueType) {
    query = query.eq('revenue_type', filters.revenueType);
  }

  const { data, error } = await query.order('date_emission', { ascending: false });

  if (error) {
    console.error("Error fetching sales:", JSON.stringify(error, null, 2));
    return [];
  }
  return data;
};

/**
 * Creates a new manual sale record.
 * @param {object} saleData 
 * @returns {Promise<object>}
 */
export const createSale = async (saleData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Auth required');

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      ...saleData,
      user_id: user.id,
      direction: 'issued',
      type: '607',
      status: saleData.status || 'issued',
      source_type: saleData.source_type || 'manual'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates an existing sale record.
 */
export const updateSale = async (id, updates) => {
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

/**
 * Archives a sale record.
 */
export const archiveSale = async (id) => {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('invoices')
    .update({ 
      status: 'voided', // 607 records use 'voided' status for archival
      archived_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};
