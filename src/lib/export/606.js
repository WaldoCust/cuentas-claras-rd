import { validateNCF } from "../validation/ncf";
import { validateRNC } from "../validation/rnc";

/**
 * Generates a DGII-compliant 606 text export string.
 * This is a simplified version of the 606 format.
 */
export const generate606Text = (userRnc, period, purchases) => {
  if (!purchases || purchases.length === 0) return "";

  const errors = [];
  
  const rows = purchases.map((p, index) => {
    const rowNum = index + 1;
    
    // Validate individual record
    const ncfRes = validateNCF(p.ncf);
    const rncRes = validateRNC(p.rnc_target);
    
    if (!ncfRes.isValid) errors.push(`Fila ${rowNum}: ${ncfRes.error}`);
    if (!rncRes.isValid) errors.push(`Fila ${rowNum}: ${rncRes.error}`);

    const rnc = (p.rnc_target || p.rnc_supplier || "").replace(/\D/g, "");
    const ncf = p.ncf || p.ncf_number || "";
    const tipoGasto = p.expense_type || p.revenue_type || "02";
    const fecha = p.date_emission?.replace(/-/g, "") || "";
    const subtotal = parseFloat(p.amount_gross || p.subtotal || 0).toFixed(2);
    const itbis = parseFloat(p.amount_itbis || p.itbis || 0).toFixed(2);
    
    return `${rnc}|1|${tipoGasto}|${ncf}||${fecha}||${subtotal}|${itbis}|0.00|0.00|0.00|0.00|0.00|0.00|0.00|0.00|0.00|0.00|0.00`;
  });

  if (errors.length > 0) {
    throw new Error(`Existen errores en los datos que impiden la exportación: ${errors.join(", ")}`);
  }

  const header = `606|${userRnc}|${period}|${purchases.length}`;
  return [header, ...rows].join("\n");
};

/**
 * Utility to trigger a file download in the browser.
 */
export const download606File = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
