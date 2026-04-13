import { createClient as getSupabase } from '@/lib/supabase/client';

/**
 * Fetches issued invoices for the current user.
 * @param {object} filters 
 * @returns {Promise<Array>}
 */
export const getIssuedInvoices = async (filters = {}) => {
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
    .eq('direction', 'issued');

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  const { data, error } = await query.order('date_emission', { ascending: false });
  
  if (error) {
    console.error("Error fetching issued invoices:", error);
    return [];
  }
  
  return data;
};

/**
 * Creates a new issued invoice.
 * @param {object} invoiceData 
 * @returns {Promise<object>}
 */
export const createIssuedInvoice = async (invoiceData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required");

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      ...invoiceData,
      user_id: user.id,
      direction: 'issued',
      status: invoiceData.status || 'draft',
      dgii_sync_status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates an invoice status.
 */
export const updateInvoiceStatus = async (id, status) => {
  const supabase = getSupabase();
  const updates = { status };
  
  if (status === 'voided') {
    updates.voided_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Deletes a draft invoice (hard delete allowed only for drafts).
 */
export const deleteDraftInvoice = async (id) => {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('status', 'draft');

  if (error) throw error;
};
