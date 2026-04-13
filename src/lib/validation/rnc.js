/**
 * RNC / Cédula Validation Utility
 */

/**
 * Validates a Dominican RNC or Cédula.
 * - RNC: 9 numeric digits
 * - Cédula: 11 numeric digits
 */
export const validateRNC = (rnc) => {
  if (!rnc) return { isValid: false, error: "El RNC/Cédula es requerido" };

  // Remove any non-numeric characters (hyphens, spaces)
  const cleanRnc = rnc.replace(/\D/g, "");

  if (cleanRnc.length === 0) {
    return { isValid: false, error: "El número debe contener solo dígitos" };
  }

  if (cleanRnc.length !== 9 && cleanRnc.length !== 11) {
    return { 
      isValid: false, 
      error: "El RNC debe tener 9 dígitos y la Cédula 11 dígitos" 
    };
  }

  return { 
    isValid: true, 
    type: cleanRnc.length === 9 ? "RNC (Jurídica)" : "Cédula (Física)",
    cleanValue: cleanRnc
  };
};

/**
 * Formats an RNC into the standard hyphenated display (e.g., 001-00000-0).
 * Since standard RNC/Cédula hyphen placement varies, we provide a clean numeric format 
 * if we don't know the exact type context.
 */
export const formatRNC = (rnc) => {
  return rnc.replace(/\D/g, "");
};
