import { normalizeAmount } from "./normalize";

/**
 * Ensures that the sum of subtotal and itbis matches the total.
 * Allows for a small epsilon for safe rounding differences (0.02).
 */
export const validateFiscalMath = (subtotal, itbis, total) => {
  const s = normalizeAmount(subtotal);
  const i = normalizeAmount(itbis);
  const t = normalizeAmount(total);

  const expectedTotal = normalizeAmount(s + i);
  const diff = Math.abs(expectedTotal - t);

  if (diff > 0.02) {
    return {
      isValid: false,
      error: `Montos inconsistentes: ${s.toFixed(2)} + ${i.toFixed(2)} ≠ ${t.toFixed(2)}`
    };
  }

  return { 
    isValid: true,
    values: { subtotal: s, itbis: i, total: t }
  };
};

/**
 * Validates that all provided values are non-negative.
 */
export const validateNonNegative = (values = {}) => {
  for (const [key, val] of Object.entries(values)) {
    const num = normalizeAmount(val);
    if (num < 0) {
      return { isValid: false, error: `El monto no puede ser negativo` };
    }
  }
  return { isValid: true };
};
