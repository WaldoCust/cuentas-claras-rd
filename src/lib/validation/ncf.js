/**
 * NCF (Número de Comprobante Fiscal) Validation Utility
 */

export const NCF_TYPES = {
  "01": "Crédito Fiscal",
  "02": "Consumo",
  "11": "Compras",
  "14": "Regímenes Especiales",
  "15": "Gubernamental"
};

/**
 * Validates if a string follows the standard B-series NCF format.
 * Pattern: B + 10 digits
 * Total length: 11 characters
 */
export const validateNCF = (ncf) => {
  if (!ncf) return { isValid: false, error: "El NCF no puede estar vacío" };
  
  // Basic length and prefix check
  const bSeriesRegex = /^B[0-9]{10}$/;
  if (!bSeriesRegex.test(ncf)) {
    return { 
      isValid: false, 
      error: "Formato de NCF inválido (debe iniciar con B y tener 11 caracteres)" 
    };
  }

  // Check if the type (digits 2-3) is recognized
  const typeCode = ncf.substring(1, 3);
  if (!NCF_TYPES[typeCode]) {
    return {
      isValid: false,
      error: `Tipo de comprobante '${typeCode}' no reconocido`
    };
  }

  return { isValid: true, type: NCF_TYPES[typeCode] };
};

/**
 * Returns the human-readable type of an NCF.
 */
export const getNCFTypeLabel = (ncf) => {
  if (!ncf || ncf.length < 3) return "Desconocido";
  const typeCode = ncf.substring(1, 3);
  return NCF_TYPES[typeCode] || "Otro comprobante";
};
