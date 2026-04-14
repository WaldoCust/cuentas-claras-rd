import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { reportError } from "@/lib/monitoring/report-error";
import { config } from "@/lib/config/env";

const genAI = new GoogleGenerativeAI(config.ai.geminiKey);

export async function POST(req) {
  try {
    const { image } = await req.json(); // base64 image data

    if (!image) {
      logger.warn("Vision API: Missing image data in request");
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert financial analyst in the Dominican Republic. 
      Analyze the attached image of an invoice/receipt and extract the following data into a clean JSON format:
      
      - rnc_supplier: The RNC or Cédula of the company issuing the invoice (9 or 11 digits).
      - ncf: The Number of Fiscal Receipt (NCF) (e.g. B0100000001, E3100000001).
      - date: Emission date in YYYY-MM-DD.
      - amount_gross: Amount before ITBIS.
      - amount_itbis: ITBIS tax amount.
      - supplier_name: Business name.
      - expense_type: DGII 606 category code (01-11).

      Return ONLY the raw JSON object. No markdown, no explanations.
    `;

    const mimeType = image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    // Triple-Model Fallback Logic to handle regional 404s
    const modelsToTry = ["models/gemini-1.5-flash", "models/gemini-1.5-pro", "models/gemini-1.5-flash-8b"];
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        logger.info(`Vision API: Attempting scan with model ${modelName} on v1`);
        const model = genAI.getGenerativeModel(
          { model: modelName },
          { apiVersion: "v1" }
        );
        
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ]);
        
        if (result) {
          logger.info(`Vision API: Success with model ${modelName}`);
          break;
        }
      } catch (err) {
        lastError = err;
        logger.warn(`Vision API: Model ${modelName} failed or not found, falling back...`);
        continue;
      }
    }

    if (!result) {
      throw lastError || new Error("No se pudo conectar con ningún motor de IA. Revisa tu API Key.");
    }

    const response = await result.response;
    let text = response.text();
    
    // Nuclear cleaning for JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error("Vision API: No JSON found in response", { text });
      throw new Error("El sistema no pudo leer los datos fiscales de esta imagen. Intenta con una foto más clara.");
    }
    
    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      logger.info("Vision API: Scan successful");
      return NextResponse.json(parsedData);
    } catch (parseError) {
      logger.error("Vision API: JSON corruption", { text });
      throw new Error("Error de formato en la lectura de IA.");
    }
  } catch (error) {
    logger.error("Vision API Critical Error", { error: error.message });
    
    return NextResponse.json({ 
      error: error.message || "Error interno procesando factura",
      details: error.stack
    }, { status: 500 });
  }
}
