import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({
  quiet: true,
});

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(request, maxAttempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await googleAI.models.generateContent(request);
    } catch (error) {
      lastError = error;
      const status = error?.status ?? error?.cause?.status;
      const retryable = status === 503 || status === 504;

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const delayMs = 500 * 2 ** (attempt - 1);
      console.warn(
        `Gemini request failed with ${status}; retrying in ${delayMs}ms...`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
}

async function main() {
  const base64Img = readFileSync('02-generate-text.png', {
    encoding: 'base64',
  });
  const response = await generateWithRetry({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Img,
            },
          },
          {
            text: 'tell me the color combination of this image',
          },
        ],
      },
    ],
  });

  console.log(response.text);
}

main();
