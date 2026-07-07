import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import Groq from 'groq-sdk';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ❌ REMOVE the global initialization line from here:
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/scan-invoice', upload.single('invoice'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing invoice target asset." });

    // 💡 MOVE IT HERE: Initialize the Groq client dynamically inside the request handler
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Step A: Parse raw textual blocks using localized Tesseract engine
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');

    // Step B: Direct the Groq Model to structurally serialize your parsed fields
    const prompt = `You are an automated logistics parser. Parse the raw invoice text into a clean JSON object.
    Map it EXACTLY to this schema structure format:
    { "name": "string product clear name", "sku": "string uppercase code pattern", "price": number, "quantity": number, "supplier": "string matching name" }
    
    CRITICAL: Output ONLY valid raw JSON data. Do not include markdown code block syntax formatting or extra conversational remarks.
    
    Raw text content from invoice document:
    ${text}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1
    });

    const responseContent = chatCompletion.choices[0]?.message?.content?.trim();
    const parsedData = JSON.parse(responseContent);

    res.json({ success: true, payload: parsedData });
  } catch (error) {
    console.error("OCR Extraction processing pipeline error:", error);
    res.status(500).json({ error: "Automated ingestion breakdown: " + error.message });
  }
});

export default router;