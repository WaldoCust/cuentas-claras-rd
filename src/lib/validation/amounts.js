/**
 * Fiscal Amounts Math Validation Utility
 */

/**
 * Ensures that the sum of gross and itbis matches the total.
 * Allows for a small epsilon for floating point/rounding differences (0.01).
 */
export const validateFiscalMath = (gross, itbis, total) => {
  const g = parseFloat(gross) || 0;
  const i = parseFloat(itbis) || 0;
  const t = parseFloat(total) || 0;

  const expectedTotal = g + i;
  const diff = Math.abs(expectedTotal - t);

  if (diff > 0.02) { // 2 cents threshold for safe rounding
    return {
      isValid: false,
      error: `La suma no coincide: Bruto (${g.toFixed(2)}) + ITBIS (${i.toFixed(2)}) ≠ Total (${t.toFixed(2)})`
    };
  }

  return { isValid: true };
};

/**
 * Checks for negative or invalid numeric values.
 */
export const validatePositiveAmounts = (amounts) => {
  for (const [key, val] of Object.entries(amounts)) {
    if (val < 0) {
      return { isValid: false, error: `El campo '${key}' no puede ser negativo` };
    }
    if (isNaN(val)) {
      return { isValid: false, error: `El campo '${key}' debe ser un número válido` };
    }
  }
  return { isValid: true };
};
