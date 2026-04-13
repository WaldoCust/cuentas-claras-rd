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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are an expert financial analyst in the Dominican Republic. 
      Analyze the attached image of an invoice/receipt and extract the following data into a strict JSON format:
      
      - rnc_supplier: The RNC or Cédula of the company issuing the invoice (format: 9 or 11 digits).
      - ncf: The Number of Fiscal Receipt (NCF) (format: usually starting with B, E, etc., 11-13 characters).
      - date: The date of emission in YYYY-MM-DD format.
      - amount_gross: The total amount before ITBIS (monto gravado).
      - amount_itbis: The ITBIS tax amount.
      - supplier_name: The name of the business/seller.
      - expense_type: Suggest a DGII 606 category code (01-11) based on the supplier:
        01 (Personal), 02 (Supplies/Services), 03 (Rent), 04 (Assets), 05 (Representation), 
        06 (Other), 07 (Financial), 08 (Extraordinary), 09 (Cost of Sales), 10 (Capital Assets), 11 (Insurance).

      Rules:
      1. If you cannot find a field, return null for that field.
      2. If multiple amounts are present, amount_gross is the subtotal and amount_itbis is the tax.
      3. ONLY return the JSON object.
    `;

    logger.info("Vision API: Starting invoice parsing with Gemini 1.5 Flash");

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(",")[1], // Extract base64 part
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    logger.info("Vision API: Successfully parsed invoice data");
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    await reportError(error, "API:Vision_Parse", { 
      message: error.message 
    });
    
    return NextResponse.json({ 
      error: "Error interno procesando factura",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
