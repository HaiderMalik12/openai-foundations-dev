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
    contents: 'What can I wear in a party',
    config: {
      temperature: 2.0,
      //   thinkingConfig: {
      //     includeThoughts: true,
      //     // thinkingBudget: 100,
      //   },
      systemInstruction: 'give me simple answer 100 words',
    },
  });

  console.log(response.text);
}

main();
