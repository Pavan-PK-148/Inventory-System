import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import Groq from 'groq-sdk';
import fs from 'fs';

const router = express.Router();

const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('PDF reading is not supported by Tesseract. Please upload a PNG or JPEG image instead.'), false);
    }
  }
});

router.post('/scan-invoice', (req, res, next) => {
  upload.single('invoice')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing invoice target asset." });
    }
    
    filePath = req.file.path;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Step A: Parse raw textual blocks using localized Tesseract engine
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');

    if (!text || text.trim() === '') {
      throw new Error("Could not extract legible text from image. Make sure the document text is clear.");
    }

    // Step B: Direct the Groq Model to structurally serialize parsed fields
    const prompt = `You are an automated logistics parser. Parse the raw invoice text into a clean JSON object.
    
    Extract fields by scanning for labels like Item Description, SKU Reference, Unit Price, Unit Cost, Qty, Quantity, and Supplier.
    
    Map it EXACTLY to this schema structure format:
    { 
      "name": "string product clear name", 
      "sku": "string uppercase code pattern", 
      "price": number, 
      "quantity": number, 
      "supplier": "string matching name" 
    }
    
    CRITICAL RULES:
    1. For "price", locate the unit price/unit cost numeric value (e.g., if it says "$250.00", extract 250). Do NOT use total amounts.
    2. For "quantity", locate the unit count integer number (e.g., if it says "45", extract 45).
    3. Output ONLY valid raw JSON data. Do not include markdown code block syntax formatting (\`\`\`json) or extra remarks.
    
    Raw text content from invoice document:
    ${text}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1
    });

    const responseContent = chatCompletion.choices[0]?.message?.content?.trim();
    
    // 🧼 STRIP MARKDOWN FENCES safely
    const cleanJsonString = responseContent
      .replace(/^```json/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    const parsedData = JSON.parse(cleanJsonString);

    // Clean up temporary uploads filesystem cache file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, payload: parsedData });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("OCR Extraction processing pipeline error:", error);
    res.status(500).json({ error: "Automated ingestion breakdown: " + error.message });
  }
});

export default router;