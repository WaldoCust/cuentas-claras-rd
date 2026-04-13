/**
 * Aggregates invoice data to calculate ITBIS balance.
 * @param {Array} invoices - Array of invoice objects from Supabase.
 * @returns {Object} - Aggregated tax data.
 */
export function calculateTaxStats(invoices) {
  const stats = {
    salesGross: 0,
    salesITBIS: 0,
    purchasesGross: 0,
    purchasesITBIS: 0,
    netITBIS: 0,
    efficiency: 0,
  };

  invoices.forEach((inv) => {
    const amount = parseFloat(inv.amount_gross) || 0;
    const itbis = parseFloat(inv.amount_itbis) || 0;

    if (inv.type === "607") {
      stats.salesGross += amount;
      stats.salesITBIS += itbis;
    } else if (inv.type === "606") {
      stats.purchasesGross += amount;
      stats.purchasesITBIS += itbis;
    }
  });

  stats.netITBIS = stats.salesITBIS - stats.purchasesITBIS;
  
  // Efficiency: What percentage of sales ITBIS is covered by purchase ITBIS
  if (stats.salesITBIS > 0) {
    stats.efficiency = (stats.purchasesITBIS / stats.salesITBIS) * 100;
  }

  return stats;
}

/**
 * Formats currency in DOP style.
 */
export function formatDOP(amount) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(amount);
}
