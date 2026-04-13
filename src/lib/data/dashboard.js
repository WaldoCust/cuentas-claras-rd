import { getPurchases } from './purchases';
import { getSales } from './sales';
import { createClient } from '@/lib/supabase/client';
import { getTaxSummary } from '@/lib/tax/format-tax-summary';

export const getDashboardSummary = async () => {
  const [purchases, sales] = await Promise.all([getPurchases(), getSales()]);

  const summary = getTaxSummary(sales, purchases);

  return {
    income: summary.revenue.gross,
    expenses: summary.expenses.gross,
    itbis: summary.tax.payable,
    ncf_count: summary.revenue.count + summary.expenses.count, // Actual count of fiscal documents
    details: summary // Provide full engine output for detailed cards
  };
};

export const getRecentActivity = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return [];
  return data;
};
