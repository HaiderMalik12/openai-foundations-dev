import OpenAI from 'openai';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const response = await client.images.generate({
    model: 'gpt-image-1.5',
    prompt: 'Generate an image of a cat on a bus',
    size: '1024x1024',
    n: 1,
  });

  const rawImage = response.data[0].b64_json;
  const path = './generatedImg.png';
  const buffer = Buffer.from(rawImage, 'base64');

  writeFileSync(path, buffer);
  console.log('Image is saved and path is ', path);
}

main().catch((err) => {
  console.log('Error in main func', err);
});
