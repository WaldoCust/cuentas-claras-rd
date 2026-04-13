/**
 * DGII 607 Revenue Categories
 */
export const REVENUE_CATEGORIES = {
  "01": "Ingresos por Operaciones (No Financieros)",
  "02": "Ingresos Financieros",
  "03": "Ingresos Extraordinarios",
  "04": "Ingresos por Arrendamientos",
  "05": "Ingresos por Venta de Activos Depreciables",
  "06": "Otros Ingresos",
  "07": "Ingresos de Exportaciones"
};

/**
 * Validates a sale record for 607 eligibility.
 * @param {object} sale 
 * @returns {{isValid: boolean, errors: string[]}}
 */
export const validateSaleFor607 = (sale) => {
  const errors = [];
  
  if (!sale.date_emission) errors.push("Fecha de venta es requerida");
  if (!sale.amount_gross) errors.push("Monto bruto es requerido");
  if (sale.amount_itbis === undefined) errors.push("Monto ITBIS es requerido (puede ser 0)");
  if (!sale.document_type) errors.push("Tipo de documento es requerido");
  
  // If NCF is provided, check basic format
  if (sale.ncf && !/^[BE][0-9]{10}$/.test(sale.ncf)) {
    errors.push("Formato de NCF inválido");
  }

  // If Credit Fiscal (01), check if client RNC is present
  if (sale.ncf_type === '01' && !sale.client?.rnc_or_cedula && !sale.rnc_target) {
    errors.push("RNC del Cliente es requerido para Crédito Fiscal");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
