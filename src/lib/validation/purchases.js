/**
 * DGII 606 Expense Categories
 */
export const EXPENSE_CATEGORIES = {
  "01": "Gastos de Personal",
  "02": "Gastos por Trabajos, Suministros y Servicios",
  "03": "Arrendamientos",
  "04": "Gastos de Activos Fijos",
  "05": "Gastos de Representación",
  "06": "Otras Deducciones Admitidas",
  "07": "Gastos Financieros",
  "08": "Gastos Extraordinarios",
  "09": "Compras y Gastos Partes del Costo de Ventas",
  "10": "Adquisiciones de Activos",
  "11": "Gastos de Seguros"
};

/**
 * Validates a purchase record for 606 eligibility.
 * @param {object} purchase 
 * @returns {{isValid: boolean, errors: string[]}}
 */
export const validatePurchaseFor606 = (purchase) => {
  const errors = [];
  
  if (!purchase.rnc_target) errors.push("RNC del Suplidor es requerido");
  if (!purchase.ncf) errors.push("NCF es requerido");
  if (!purchase.date_emission) errors.push("Fecha de emisión es requerida");
  if (!purchase.amount_gross) errors.push("Monto bruto es requerido");
  if (purchase.amount_itbis === undefined) errors.push("Monto ITBIS es requerido (puede ser 0)");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats a date to YYYYMM format for 606 reporting.
 */
export const formatFiscalPeriod = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}${month}`;
};
