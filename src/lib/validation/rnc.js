import { normalizeRNC } from "./normalize";

/**
 * Validates a Dominican RNC or Cédula.
 * - RNC: 9 numeric digits
 * - Cédula: 11 numeric digits
 */
export const validateRNC = (rnc) => {
  const cleanRnc = normalizeRNC(rnc);
  
  if (!cleanRnc) {
    return { isValid: false, error: "El RNC o Cédula es obligatorio" };
  }

  if (cleanRnc.length !== 9 && cleanRnc.length !== 11) {
    return { 
      isValid: false, 
      error: "RNC inválido (debe tener 9 u 11 dígitos)" 
    };
  }

  // Basic checksum or pattern could be added here, but length + numeric is 
  // the primary requirement for beta.
  
  return { 
    isValid: true, 
    type: cleanRnc.length === 9 ? "RNC" : "Cédula",
    cleanValue: cleanRnc
  };
};

/**
 * Display helper for RNC/Cédula hyphenation
 */
export const displayRNC = (rnc) => {
  const clean = normalizeRNC(rnc);
  if (clean.length === 9) {
    return `${clean.slice(0, 1)}-${clean.slice(1, 3)}-${clean.slice(3, 8)}-${clean.slice(8)}`;
  }
  if (clean.length === 11) {
     return `${clean.slice(0, 3)}-${clean.slice(3, 10)}-${clean.slice(10)}`;
  }
  return clean;
};
