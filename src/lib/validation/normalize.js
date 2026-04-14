/**
 * Data Normalization Utility
 * Ensures inputs are clean and typed correctly before validation or persistence.
 */

/**
 * Trims strings and handles nulls.
 */
export const normalizeString = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).trim();
};

/**
 * Normalizes RNC/Cédula to numeric-only string.
 */
export const normalizeRNC = (rnc) => {
  return normalizeString(rnc).replace(/\D/g, "");
};

/**
 * Normalizes NCF to uppercase and trimmed.
 */
export const normalizeNCF = (ncf) => {
  return normalizeString(ncf).toUpperCase().replace(/\s/g, "");
};

/**
 * Coerces value to a safe currency decimal (2 places).
 */
export const normalizeAmount = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return Math.round(num * 100) / 100;
};

/**
 * Normalizes an object based on a schema (best efforts).
 */
export const normalizePayload = (payload, schema = {}) => {
  const result = {};
  for (const [key, type] of Object.entries(schema)) {
    const val = payload[key];
    if (type === 'string') result[key] = normalizeString(val);
    else if (type === 'number') result[key] = normalizeAmount(val);
    else if (type === 'boolean') result[key] = !!val;
    else if (type === 'rnc') result[key] = normalizeRNC(val);
    else if (type === 'ncf') result[key] = normalizeNCF(val);
    else result[key] = val;
  }
  return result;
};
