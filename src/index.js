import { openai } from './openai.js'
import { encoding_for_model } from 'tiktoken'

// ─── TOKENS: response.usage ──────────────────────────────────────────────────
// After an API call, response.usage tells you exactly how many tokens were used.
// input_tokens = your prompt, output_tokens = the reply, total = both combined.
// This is what OpenAI bills you for.
async function usageExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [{ role: 'user', content: 'What is the capital of France?' }],
    })
    console.log('--- response.usage ---')
    console.log(response.usage)
}

// ─── TOKENS: max_output_tokens ───────────────────────────────────────────────
// You can cap how many tokens the model is allowed to produce.
// Here we ask for a detailed explanation but only allow 20 tokens — the response
// will be cut short, making the limit visible.
async function maxOutputTokensExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [{ role: 'user', content: 'Explain the solar system in detail.' }],
        max_output_tokens: 20,
    })
    console.log('--- max_output_tokens: 20 ---')
    console.log(response.output_text)
}

// ─── TOKENS: tiktoken (count tokens locally, no API call) ────────────────────
// tiktoken lets you count tokens BEFORE sending anything to OpenAI.
// Useful to estimate cost or check if a prompt fits within the model's limit.
function tiktokenExample() {
    const text = 'What is the capital of France?'
    const encoder = encoding_for_model('gpt-4o')
    const tokens = encoder.encode(text)
    encoder.free()

    console.log('--- tiktoken (local count) ---')
    console.log(`Text   : "${text}"`)
    console.log(`Tokens : ${tokens.length}`)
}

async function main() {
    await usageExample()
    await maxOutputTokensExample()
    tiktokenExample()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
