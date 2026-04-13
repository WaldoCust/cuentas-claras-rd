/**
 * Generates a dummy .TXT file for DGII Form 606.
 * Format: RNC|TipoID|TipoGasto|NCF|NCFMod|Fecha|FechaPago|Monto|ITBIS|Retenido...
 */
export function generate606File(data) {
  // Headers for the 606 file (Simplified version for demo)
  // The first line is usually the header with RNC of the taxpayer and Period
  const taxpayerRNC = "101000001";
  const period = "202403";
  const lineCount = data.length;

  let content = `606|${taxpayerRNC}|${period}|${lineCount}\n`;

  data.forEach((row) => {
    // Dummy mapping to DGII structure
    const line = [
      row.rnc.replace(/-/g, ""), // RNC
      row.rnc.length > 9 ? "1" : "2", // Tipo ID
      "01", // Tipo Gasto (Gastos de Personal by default for demo)
      row.ncf, // NCF
      "", // NCF Modificado
      row.fecha.replace(/-/g, ""), // Fecha Emisión
      row.fecha.replace(/-/g, ""), // Fecha Pago
      row.monto, // Monto Facturado
      row.itbis, // ITBIS Facturado
      "0.00", // ITBIS Retenido
      "0.00", // ITBIS Sujeto a Proporcionalidad
      "0.00", // ITBIS por Adelantar
      "0.00", // ITBIS Percibido
      "0.00", // Tipo de Retención en ISR
      "0.00", // Monto Retención Renta
      "0.00", // ISR Percibido
      "0.00", // Impuesto Selectivo al Consumo
      "0.00", // Otros Impuestos/Tasas
      "0.00", // Monto Propina Legal
      "01", // Forma de Pago (Efectivo)
    ].join("|");
    content += line + "\n";
  });

  return content;
}

/**
 * Triggers a browser download of the generated string.
 */
export function downloadFile(filename, content) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
