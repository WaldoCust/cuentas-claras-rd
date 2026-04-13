/**
 * Aggregates sales and purchases into a fiscal position dataset.
 * @param {Array} sales - Raw sales records (from 607 module)
 * @param {Array} purchases - Raw purchase records (from 606 module)
 * @returns {object} - Summarized fiscal data
 */
export const aggregateFiscalData = (sales, purchases) => {
  // Filter out voided or invalid records
  const activeSales = (sales || []).filter(s => s.status !== 'voided');
  const activePurchases = (purchases || []).filter(p => p.status !== 'archived');

  const summaries = {
    revenue: {
      gross: activeSales.reduce((acc, s) => acc + (parseFloat(s.amount_gross) || 0), 0),
      itbis: activeSales.reduce((acc, s) => acc + (parseFloat(s.amount_itbis) || 0), 0),
      count: activeSales.length
    },
    expenses: {
      gross: activePurchases.reduce((acc, p) => acc + (parseFloat(p.amount_gross) || 0), 0),
      itbis: activePurchases.reduce((acc, p) => acc + (parseFloat(p.amount_itbis) || 0), 0), // Total ITBIS paid
      deductible_itbis: activePurchases.reduce((acc, p) => {
        // Only count ITBIS if marked as deductible
        return acc + (p.is_deductible ? (parseFloat(p.amount_itbis) || 0) : 0);
      }, 0),
      count: activePurchases.length
    }
  };

  return summaries;
};

/**
 * Groups records by Month-Year for period analysis.
 */
export const groupByPeriod = (records, dateField = 'date_emission') => {
  return records.reduce((acc, rec) => {
    const date = new Date(rec[dateField]);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[period]) acc[period] = [];
    acc[period].push(rec);
    return acc;
  }, {});
};
