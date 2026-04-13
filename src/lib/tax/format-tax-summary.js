import { calculateITBISPosition } from './calculate-itbis';
import { aggregateFiscalData } from './aggregate-data';

/**
 * Orchestrates the full tax summary generation for the dashboard.
 * @param {Array} sales 
 * @param {Array} purchases 
 * @returns {object} - The complete summary object
 */
export const getTaxSummary = (sales, purchases) => {
  const normalizedSales = sales || [];
  const normalizedPurchases = purchases || [];

  const aggregation = aggregateFiscalData(normalizedSales, normalizedPurchases);
  
  const itbisPosition = calculateITBISPosition({
    collectedITBIS: aggregation.revenue.itbis,
    deductibleITBIS: aggregation.expenses.deductible_itbis
  });

  return {
    revenue: {
      gross: aggregation.revenue.gross,
      itbis: aggregation.revenue.itbis,
      count: aggregation.revenue.count
    },
    expenses: {
      gross: aggregation.expenses.gross,
      itbis: aggregation.expenses.itbis,
      deductible_itbis: aggregation.expenses.deductible_itbis,
      count: aggregation.expenses.count
    },
    tax: itbisPosition,
    period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  };
};
