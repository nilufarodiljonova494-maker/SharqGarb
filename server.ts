/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Gemini SDK with custom user agent telemetry
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint checker
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

/**
 * API Route: Child-friendly explanations mimicking Eastern Dono Bobo or Western Professor Spark
 */
app.post("/api/explain", async (req: Request, res: Response): Promise<void> => {
  const { prompt, persona, history } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Siz savol bermadingiz. Iltimos, savol kiritib ko'ring!" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    // Graceful error return so frontend falls back
    res.status(503).json({ error: "API kalit o'rnatilmagan." });
    return;
  }

  try {
    let systemInstruction = "";
    if (persona === 'wisdom') {
      systemInstruction = `Siz '"Sharq va G'arb ta'limi" mobil/veb darsligidagi Dono Bobo - ya'ni sharqona donishmandsiz.
Bolalar uchun (boshlang'ich sinf) o'ta tushunarli, mehribon, sabrli, odob va muloyimlik bilan o'zbek tilida javob bering.
Sizning ohangingizda kattalarni va ota-onani, ustozi ulug'lash, qat'iy muloqot va diqqat maslahatlari bo'lsin.
Javob maksimal 3 jumlada qisqa va qiziqarli bo'lsin, emojisdan oqilona foydalanilsin.`;
    } else {
      systemInstruction = `Siz '"Sharq va G'arb ta'limi" mobil/veb darsligidagi Professor Spark - ya'ni o'ta aqlli g'arbona kashshofsiz.
Bolalar (boshlang'ich sinf) uchun o'ta quvnoq, dahoona, qiziquvchan tilda o'zbekcha yozing.
Muloqotingizda ko'proq 'Nega?', tabiat hodisalarini tekshirish, sinb ko'rish va kashfiyotchilik ruhini uyg'oting.
Javob maksimal 3 jumlada va daho ohangida bo'lsin.`;
    }

    // Build contents incorporating conversational history for natural interactions
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
});

/**
 * API Route: Dynamic Quiz generator yielding rich structured JSON quizzes
 */
app.post("/api/generate-quiz", async (req: Request, res: Response): Promise<void> => {
  const { grade, subject } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({ error: "API kalit tayyor emas" });
    return;
  }

  try {
    const prompt = `Boshlang'ich ${grade || 3}-sinf o'quvchilari uchun '${subject || "all"}' mavzusida 3 ta qiziqarli va o'yin mantiqli test yarat.
Siz '"Sharq va G\'arb ta\'limi"' darsligisiz. Har bir savol bolaning zehnini, abakus hisob-kitobini yoki g'arbiy ilmiy kashshofligini tekshirasin.
Natijaviy javob quyidagi JSON formatida va uzbek tilida bo'lishi MAJBURIY:
{
  "quizzes": [
    {
      "question": "Savol matni",
      "options": ["Variant A", "Variant B", "Variant C", "Variant D"],
      "answerIndex": 1, // 0 tadan 3 tagacha to'g'ri javob indexi
      "explanation": "To'g'ri javob uchun bolajonlar tushunadigan quvnoq sharh (East yoki West ruhida)",
      "topic": "Mavzu nomi"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["quizzes"],
          properties: {
            quizzes: {
              type: Type.ARRAY,
              description: "Savollar ro'yxati",
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "answerIndex", "explanation", "topic"],
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  topic: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const textOutput = response.text || "{}";
    res.json(JSON.parse(textOutput));
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Test yaratish muvaffaqiyatsiz bo'ldi" });
  }
});

/**
 * Configure Vite / Static asset server pipelines
 */
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running beautifully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
