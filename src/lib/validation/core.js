/**
 * Core Validation Engine
 * Unified entry point for all form validation logic.
 */

import { validateRNC } from "./rnc";
import { validateNCF } from "./ncf";
import { validateFiscalMath, validateNonNegative } from "./amounts";
import { validateFiscalDate } from "./dates";
import { normalizeString } from "./normalize";

export const validateField = (name, value, allValues = {}) => {
  const cleanValue = normalizeString(value);

  switch (name) {
    case 'rnc':
    case 'rnc_or_cedula':
    case 'rnc_target':
    case 'rnc_supplier':
      return validateRNC(cleanValue);

    case 'ncf':
    case 'ncf_number':
      return validateNCF(cleanValue);

    case 'date_emission':
    case 'document_date':
    case 'sale_date':
      return validateFiscalDate(cleanValue);

    case 'business_name':
    case 'supplier_name':
      if (cleanValue.length < 3) {
        return { isValid: false, error: "El nombre debe tener al menos 3 caracteres" };
      }
      return { isValid: true };

    case 'subtotal':
    case 'amount_gross':
    case 'total':
      return validateNonNegative({ [name]: value });

    default:
      return { isValid: true };
  }
};

/**
 * Validates an entire form object against a set of rules.
 */
export const validateForm = (data, fields = []) => {
  const errors = {};
  let isValid = true;

  fields.forEach(field => {
    const result = validateField(field, data[field], data);
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  });

  // Cross-field math validation if applicable
  if (data.subtotal !== undefined && data.itbis !== undefined && data.total !== undefined) {
    const mathResult = validateFiscalMath(data.subtotal, data.itbis, data.total);
    if (!mathResult.isValid) {
      errors.total = mathResult.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};
