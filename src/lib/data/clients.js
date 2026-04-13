import { createClient as getSupabase } from '@/lib/supabase/client';
import { normalizeIdentity } from '@/lib/validation/clients';

export const getClients = async (filters = {}) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id);

  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    query = query.eq('status', 'active');
  }

  if (filters.type) {
    query = query.eq('fiscal_type', filters.type);
  }

  const { data, error } = await query.order('business_name', { ascending: true });
  
  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  
  return data;
};

export const createClient = async (clientData) => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");

  const normalizedRnc = normalizeIdentity(clientData.rnc_or_cedula);

  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...clientData,
      user_id: user.id,
      rnc_or_cedula: normalizedRnc,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error("Ya existe un cliente con este RNC/Cédula");
    throw error;
  }
  return data;
};

export const updateClient = async (id, updates) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('clients')
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

export const archiveClient = async (id) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('clients')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Utility to sync unique clients from existing invoices.
 * Useful for migrating legacy data to the new structured system.
 */
export const syncClientsFromInvoices = async () => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0 };

  // Fetch unique invoice targets
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('rnc_target, target_name')
    .eq('user_id', user.id);

  if (error || !invoices) return { count: 0 };

  const uniqueTargets = [...new Map(invoices.map(item => [item['rnc_target'], item])).values()];
  
  let count = 0;
  for (const target of uniqueTargets) {
    try {
      await createClient({
        business_name: target.target_name || 'Nuevo Cliente',
        rnc_or_cedula: target.rnc_target,
        fiscal_type: 'Crédito Fiscal',
        document_type: target.rnc_target.length > 9 ? 'Cédula' : 'RNC'
      });
      count++;
    } catch (e) {
      // Ignore duplicates or errors during migration
    }
  }

  return { count };
};
