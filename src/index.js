import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({
  quiet: true,
});

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await googleAI.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: 'Tell me 5 fruits name',
  });

  console.log(response.text);
}

main();
