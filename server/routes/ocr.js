import express from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';
import fs from 'fs';

const router = express.Router();

const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('PDF format is not supported by the OCR engine. Please upload a clear image (PNG or JPEG) instead!'), false);
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

    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const prompt = `You are an automated logistics parser. Scan the provided invoice image and extract properties into a clean JSON object.
    
    Map the data EXACTLY to this schema structure format:
    { 
      "name": "string product clear name", 
      "sku": "string uppercase code pattern", 
      "price": number, 
      "quantity": number, 
      "supplier": "string matching name" 
    }
    
    CRITICAL RULES:
    1. For "price", extract the single unit price/unit cost numeric value (e.g., if it says "$250.00", return 250). Do NOT map total sums.
    2. For "quantity", extract the single unit count volume integer (e.g., if it says "45", return 45).
    3. Output ONLY valid raw JSON data. Do not wrap the response inside markdown block code fences (\`\`\`json) or include extra conversational remarks.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      model: 'qwen/qwen3.6-27b',
      temperature: 0.1
    });

    const responseContent = chatCompletion.choices[0]?.message?.content?.trim();
    
    // 🧼 1. Strip internal model thinking parameters (<think>...</think>)
    let cleanJsonString = responseContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // 🧼 2. Strip standard markdown code blocks (```json ... ```)
    cleanJsonString = cleanJsonString
      .replace(/^```json/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    const parsedData = JSON.parse(cleanJsonString);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, payload: parsedData });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("OCR Vision Extraction processing error:", error);
    res.status(500).json({ error: "Automated ingestion breakdown: " + error.message });
  }
});

export default router;