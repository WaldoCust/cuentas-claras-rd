/**
 * Normalizes an RNC or Cédula by removing any non-numeric characters.
 * @param {string} value 
 * @returns {string}
 */
export const normalizeIdentity = (value) => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

/**
 * Validates a normalized identity value based on Dominican standards.
 * @param {string} value - The normalized numeric string.
 * @returns {{isValid: boolean, type: string | null, error: string | null}}
 */
export const validateIdentity = (value) => {
  const normalized = normalizeIdentity(value);
  
  if (!normalized) {
    return { isValid: false, type: null, error: "Identidad requerida" };
  }

  // RNC is typically 9 digits
  if (normalized.length === 9) {
    return { isValid: true, type: "RNC", error: null };
  }

  // Cédula is typically 11 digits
  if (normalized.length === 11) {
    return { isValid: true, type: "Cédula", error: null };
  }

  return { 
    isValid: false, 
    type: null, 
    error: "RNC debe tener 9 dígitos o Cédula 11 dígitos" 
  };
};

/**
 * Formats a normalized identity for display.
 * @param {string} value 
 * @param {string} type 
 * @returns {string}
 */
export const formatIdentity = (value, type) => {
  const normalized = normalizeIdentity(value);
  
  if (type === "RNC" && normalized.length === 9) {
    return `${normalized.slice(0, 1)}-${normalized.slice(1, 3)}-${normalized.slice(3, 8)}-${normalized.slice(8)}`;
  }
  
  if (type === "Cédula" && normalized.length === 11) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 10)}-${normalized.slice(10)}`;
  }
  
  return normalized;
};
