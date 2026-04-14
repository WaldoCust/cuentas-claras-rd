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
import { validateForm } from "@/lib/validation/core";
import { normalizePayload } from "@/lib/validation/normalize";

export const createIssuedInvoice = async (invoiceData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");

  // Re-validate consistency
  const { isValid, errors } = validateForm(invoiceData, ['client_id', 'date_emission', 'subtotal']);
  if (!isValid) {
    throw new Error(`Datos inválidos: ${Object.values(errors).join(", ")}`);
  }

  // Normalize and validate payload
  const normalized = normalizePayload(invoiceData, {
    client_id: 'string',
    direction: 'string',
    type: 'string',
    date_emission: 'string',
    subtotal: 'number',
    itbis: 'number',
    total: 'number',
    ncf_number: 'ncf',
    status: 'string',
    notes: 'string',
    currency: 'string',
    payment_status: 'string'
  });

  const payload = {
    user_id: user.id,
    client_id: normalized.client_id,
    direction: 'issued',
    type: normalized.type || '607',
    date_emission: normalized.date_emission,
    subtotal: normalized.subtotal,
    itbis: normalized.itbis,
    total: normalized.total || (normalized.subtotal + normalized.itbis),
    ncf_number: normalized.ncf_number || null,
    status: normalized.status || 'draft',
    notes: normalized.notes || null,
    currency: normalized.currency || 'DOP',
    payment_status: normalized.payment_status || 'pending',
    reporting_status: 'pending'
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (Invoice Creation):", error);
    throw new Error("No pudimos generar la factura. Revisa el cliente y los montos.");
  }
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
