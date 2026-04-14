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
import { validateForm } from "@/lib/validation/core";
import { normalizePayload } from "@/lib/validation/normalize";

export const createSale = async (saleData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Auth required');

  // Re-validate consistency
  const { isValid, errors } = validateForm({
    ...saleData,
    subtotal: saleData.amount_gross || saleData.subtotal,
    itbis: saleData.amount_itbis || saleData.itbis,
    total: saleData.total || (parseFloat(saleData.amount_gross || 0) + parseFloat(saleData.amount_itbis || 0))
  }, ['date_emission', 'total']);

  if (!isValid) {
    throw new Error(`Datos inválidos: ${Object.values(errors).join(", ")}`);
  }

  // Normalize and validate payload
  const normalized = normalizePayload(saleData, {
    date_emission: 'string',
    ncf: 'ncf',
    ncf_number: 'ncf',
    amount_gross: 'number',
    subtotal: 'number',
    amount_itbis: 'number',
    itbis: 'number',
    total: 'number',
    revenue_type: 'string',
    status: 'string',
    source_type: 'string',
    client_id: 'string',
    notes: 'string',
    payment_status: 'string',
    reporting_status: 'string'
  });

  const payload = {
    user_id: user.id,
    direction: 'issued',
    type: '607',
    date_emission: normalized.date_emission,
    ncf_number: normalized.ncf || normalized.ncf_number || null,
    subtotal: normalized.subtotal || normalized.amount_gross || 0,
    itbis: normalized.itbis || normalized.amount_itbis || 0,
    total: normalized.total || (normalized.subtotal + normalized.itbis),
    revenue_type: normalized.revenue_type || '01',
    status: normalized.status || 'issued',
    source_type: normalized.source_type || 'manual',
    client_id: normalized.client_id || null,
    notes: normalized.notes || null,
    payment_status: normalized.payment_status || 'paid',
    reporting_status: normalized.reporting_status || 'pending'
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (Sale Creation):", error);
    throw new Error("No pudimos registrar la venta. Revisa el NCF y los montos.");
  }
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
