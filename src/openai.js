console.log('Loading openai.ts');
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ quiet: true});

const API_KEY = process.env.OPENAI_API_KEY;

if(!API_KEY){
    console.log('Missing OpenAI KEY in .env file')
}


export const openai = new OpenAI({
    apiKey: API_KEY
});