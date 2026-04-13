import { validateNCF } from "../validation/ncf";

/**
 * Generates a DGII-compliant 607 text export string.
 * Format: RNC|TIPO_ID|NCF|NCF_MOD|TIPO_ING|FECHA|...
 * @param {string} userRnc
 * @param {string} period (YYYYMM)
 * @param {Array} sales 
 * @returns {string}
 */
export const generate607Text = (userRnc, period, sales) => {
  if (!sales || sales.length === 0) return "";

  const errors = [];
  
  const rows = sales.map((s, index) => {
    const rowNum = index + 1;
    
    // Validate individual record if NCF is present
    if (s.ncf) {
      const ncfRes = validateNCF(s.ncf);
      if (!ncfRes.isValid) errors.push(`Fila ${rowNum}: ${ncfRes.error}`);
    }

    const clientRnc = (s.client?.rnc_or_cedula || s.rnc_target || "").replace(/\D/g, "");
    const tipoId = clientRnc.length === 9 ? '1' : clientRnc.length === 11 ? '2' : '3';
    const ncf = s.ncf || s.ncf_number || "";
    const tipoIngreso = s.revenue_type || "01";
    const fecha = s.date_emission?.replace(/-/g, "") || "";
    const monto = parseFloat(s.amount_gross || 0).toFixed(2);
    const itbis = parseFloat(s.amount_itbis || 0).toFixed(2);
    
    // Simplified 607 pipe delimited format
    // Fields: RNC/Cédula, Tipo Id, NCF, NCF Modificado, Tipo Ingreso, Fecha Emisión, Fecha Retención, Monto Facturado, ITBIS Facturado, ITBIS Retenido, ITBIS por Terceros, ITBIS Percibido, Retención Renta, ISR Percibido, Impuesto Selectivo, Otros Impuestos, Propina Legal, Efectivo, Cheque/Transferencia, Tarjeta, Crédito, Permuta, Otras Formas
    return `${clientRnc}|${tipoId}|${ncf}||${tipoIngreso}|${fecha}||${monto}|${itbis}|0.00|0.00|0.00|0.00|0.00|0.00|0.00|0.00|${monto}|0.00|0.00|0.00|0.00|0.00`;
  });

  if (errors.length > 0) {
    throw new Error(`Existen errores en los datos que impiden la exportación: ${errors.join(", ")}`);
  }

  // Header line: 607|USER_RNC|PERIOD|COUNT
  const header = `607|${userRnc}|${period}|${sales.length}`;
  return [header, ...rows].join("\n");
};

/**
 * Utility to trigger a file download in the browser.
 */
export const download607File = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
