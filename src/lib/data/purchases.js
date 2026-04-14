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

import { validateForm } from "@/lib/validation/core";
import { normalizePayload } from "@/lib/validation/normalize";

export const createPurchase = async (purchaseData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required");

  // Re-validate consistency
  const { isValid, errors } = validateForm({
    ...purchaseData,
    subtotal: purchaseData.amount_gross || purchaseData.subtotal,
    itbis: purchaseData.amount_itbis || purchaseData.itbis,
    total: purchaseData.total || (parseFloat(purchaseData.amount_gross || 0) + parseFloat(purchaseData.amount_itbis || 0))
  }, ['ncf', 'rnc_target', 'total']);

  if (!isValid) {
    throw new Error(`Datos inválidos: ${Object.values(errors).join(", ")}`);
  }

  // Normalize and validate payload
  const normalized = normalizePayload(purchaseData, {
    date_emission: 'string',
    document_date: 'string',
    ncf: 'ncf',
    ncf_number: 'ncf',
    amount_gross: 'number',
    subtotal: 'number',
    amount_itbis: 'number',
    itbis: 'number',
    total: 'number',
    rnc_target: 'rnc',
    rnc_supplier: 'rnc',
    supplier_name: 'string',
    target_name: 'string',
    expense_type: 'string',
    revenue_type: 'string',
    payment_method: 'string',
    is_deductible: 'boolean',
    status: 'string',
    source_type: 'string',
    notes: 'string',
    client_id: 'string'
  });

  const payload = {
    user_id: user.id,
    direction: 'purchase',
    type: '606',
    date_emission: normalized.date_emission || normalized.document_date,
    ncf_number: normalized.ncf || normalized.ncf_number,
    subtotal: normalized.subtotal || normalized.amount_gross || 0,
    itbis: normalized.itbis || normalized.amount_itbis || 0,
    total: normalized.total || (normalized.subtotal + normalized.itbis),
    rnc_target: normalized.rnc_target || normalized.rnc_supplier,
    target_name: normalized.supplier_name || normalized.target_name,
    expense_type: normalized.expense_type || normalized.revenue_type || '02',
    payment_method: normalized.payment_method || 'Transferencia',
    is_deductible: normalized.is_deductible !== undefined ? normalized.is_deductible : true,
    status: normalized.status || 'confirmed',
    source_type: normalized.source_type || 'manual',
    notes: normalized.notes || null,
    client_id: normalized.client_id || null
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (Purchase Creation):", error);
    throw new Error("No pudimos registrar la compra. Verifica el NCF y los montos.");
  }
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
  return purchases.reduce((sum, p) => sum + (parseFloat(p.itbis) || 0), 0);
};
