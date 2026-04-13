/**
 * Validates the consistency of invoice totals.
 * @param {number} subtotal 
 * @param {number} itbis 
 * @param {number} total 
 * @returns {boolean}
 */
export const validateInvoiceTotals = (subtotal, itbis, total) => {
  const tolerance = 0.01;
  return Math.abs((subtotal + itbis) - total) < tolerance;
};

/**
 * Validates NCF format based on common DGII prefixes.
 * @param {string} ncf 
 * @returns {{isValid: boolean, error: string | null}}
 */
export const validateNCF = (ncf) => {
  if (!ncf) return { isValid: false, error: "NCF es requerido para factura fiscal" };
  
  // Standard NCF is usually E (Electronic) or B (Standard) followed by 10 digits
  const standardPattern = /^[BE][0-9]{10}$/;
  if (!standardPattern.test(ncf)) {
    return { isValid: false, error: "Formato de NCF inválido (ej: B0100000001)" };
  }
  
  return { isValid: true, error: null };
};

/**
 * Checks if a business profile is ready for fiscal issuance.
 * @param {object} profile 
 * @returns {{isReady: boolean, missing: string[]}}
 */
export const checkProfileReadiness = (profile) => {
  const missing = [];
  if (!profile?.rnc) missing.push("RNC del Emisor");
  if (!profile?.business_name) missing.push("Razón Social");
  if (!profile?.address) missing.push("Dirección Comercial");
  
  return {
    isReady: missing.length === 0,
    missing
  };
};

/**
 * Maps NCF types to their descriptions.
 */
export const NCF_TYPES = {
  "01": "Crédito Fiscal",
  "02": "Consumo Final",
  "14": "Regímenes Especiales",
  "15": "Gubernamentales"
};
