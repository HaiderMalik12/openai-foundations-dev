import OpenAI from 'openai';
import dotenv from 'dotenv';
import multer from 'multer';
import express from 'express';
import path from 'path';
import { createReadStream, mkdirSync, unlinkSync } from 'fs';

const app = express();

dotenv.config();

app.get('/', (req, res) => {
  res.send(`
     <form action="/upload" method="post" enctype="multipart/form-data">
      
     <input type="file" name="audio" accept="audio/*"/> 
     <button> Upload File</button>
    
     </form>
    
    `);
});

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

mkdirSync('uploads', { recursive: true });

const upload = multer({ storage });

app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No audio file was uploaded.');
  }

  const filePath = req.file.path;

  const response = await client.audio.transcriptions.create({
    model: 'whisper-1',
    file: createReadStream(filePath),
    language: 'en',
  });

  unlinkSync(filePath);

  res.send(`<h1>${response.text}</h1>`);
  // console.log(response.text);

  // const rawText = response.text;
  // writeFileSync('audioText.txt', rawText, 'utf-8');
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.listen(3200, () => {
  console.log('server started at localhost:3200');
});
