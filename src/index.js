import { GoogleGenAI } from '@google/genai';
import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config({
  quiet: true,
});

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get('/', async (req, res) => {
  const response = await googleAI.models.generateContentStream({
    model: 'gemini-3.5-flash',
    contents: 'Tell me about AI in details',
  });

  for await (const chunk of response) {
    const text = chunk.text;
    // console.log(text);
    if (text) {
      res.write(text);
    }
  }

  res.end('------content completed -------');
});

app.listen(3200);
