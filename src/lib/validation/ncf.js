import { normalizeNCF } from "./normalize";

export const NCF_TYPES = {
  "01": "Crédito Fiscal",
  "02": "Consumo",
  "11": "Compras",
  "12": "Registro Único de Ingresos",
  "14": "Regímenes Especiales",
  "15": "Gubernamental"
};

/**
 * Validates if a string follows the standard B-series or E-series NCF format.
 * - B Series: B + 10 digits (11 total)
 * - E Series: E + 10 digits (11 total)
 */
export const validateNCF = (ncf) => {
  const cleanNcf = normalizeNCF(ncf);

  if (!cleanNcf) {
    return { isValid: false, error: "El NCF es obligatorio" };
  }
  
  // B or E series
  const validRegex = /^[BE][0-9]{10}$/;
  if (!validRegex.test(cleanNcf)) {
    return { 
      isValid: false, 
      error: "Formato inválido (Ej: B0100000001)" 
    };
  }

  // Check if the type (digits 2-3) is recognized
  const typeCode = cleanNcf.substring(1, 3);
  if (!NCF_TYPES[typeCode]) {
    return {
      isValid: false,
      error: `Tipo NCF '${typeCode}' no reconocido`
    };
  }

  return { 
    isValid: true, 
    type: NCF_TYPES[typeCode],
    isElectronic: cleanNcf.startsWith('E')
  };
};

export const getNCFTypeLabel = (ncf) => {
  const clean = normalizeNCF(ncf);
  if (!clean || clean.length < 3) return "General";
  const typeCode = clean.substring(1, 3);
  return NCF_TYPES[typeCode] || "Otro";
};
