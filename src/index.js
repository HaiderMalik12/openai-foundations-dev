import OpenAI from 'openai';
import dotenv from 'dotenv';
import { createReadStream, writeFileSync } from 'fs';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const response = await client.audio.transcriptions.create({
    model: 'whisper-1',
    file: createReadStream('harvard.wav'),
    language: 'en',
  });

  console.log(response.text);

  const rawText = response.text;
  writeFileSync('audioText.txt', rawText, 'utf-8');
}

main().catch((err) => {
  console.log('Error in main func', err);
});
