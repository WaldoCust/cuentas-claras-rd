/**
 * Date Validation Utility
 */

/**
 * Validates that a date string is a valid date and not in the future.
 */
export const validateFiscalDate = (dateStr) => {
  if (!dateStr) return { isValid: false, error: "La fecha es obligatoria" };

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: "Fecha inválida" };
  }

  const now = new Date();
  // Allow today
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  if (date > today) {
    return { isValid: false, error: "La fecha no puede ser futura" };
  }

  // Prevent dates too far in the past (e.g., > 10 years)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 10);
  if (date < minDate) {
    return { isValid: false, error: "La fecha es demasiado antigua" };
  }

  return { isValid: true, date };
};

/**
 * Formats a date for display or input value.
 */
export const formatISOToInput = (dateObj) => {
  if (!dateObj) return "";
  const d = new Date(dateObj);
  return d.toISOString().split('T')[0];
};
