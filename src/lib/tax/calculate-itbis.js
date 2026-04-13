/**
 * Calculates the ITBIS position from a set of summarized records.
 * @param {object} totals - Summed data from Sales and Purchases
 * @returns {object} - Detailed ITBIS breakdown
 */
export const calculateITBISPosition = (totals) => {
  const { 
    collectedITBIS = 0, 
    deductibleITBIS = 0,
    exemptRevenue = 0,
    nonDeductibleExpenses = 0
  } = totals;

  const netPayable = collectedITBIS - deductibleITBIS;

  return {
    collected: collectedITBIS,           // ITBIS from Sales (607)
    deductible: deductibleITBIS,         // ITBIS from Purchases (606)
    payable: Math.max(0, netPayable),    // Amount to pay to DGII
    credit: Math.abs(Math.min(0, netPayable)), // Tax credit if deductible > collected
    exemptRevenue,
    nonDeductibleExpenses,
    status: netPayable > 0 ? 'liability' : netPayable < 0 ? 'credit' : 'neutral'
  };
};

/**
 * Validates a single record's ITBIS contribution.
 */
export const validateRecordITBIS = (record) => {
  const gross = parseFloat(record.amount_gross) || 0;
  const itbis = parseFloat(record.amount_itbis) || 0;
  
  // Basic sanity check: ITBIS shouldn't be more than 18% (usually)
  const isSuspicious = itbis > (gross * 0.181);
  
  return {
    isValid: !isNaN(gross) && !isNaN(itbis),
    isSuspicious
  };
};
