import { openai } from './openai.js'

// ─── ROLE: developer ────────────────────────────────────────────────────────
// Sets behavior/persona rules for the model BEFORE the conversation starts.
// The user sends a math question, but the chef persona ignores it and stays on topic.
async function developerRoleExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'developer', content: 'You are a chef. Only talk about food. Refuse anything unrelated.' },
            { role: 'user',      content: 'What is 2 + 2?' },
        ],
    })
    console.log('--- developer role ---')
    console.log(response.output_text)
}

// ─── ROLE: user ─────────────────────────────────────────────────────────────
// The human's message. The simplest case — just ask a question.
async function userRoleExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'user', content: 'What is the capital of Japan?' },
        ],
    })
    console.log('--- user role ---')
    console.log(response.output_text)
}

// ─── ROLE: assistant ─────────────────────────────────────────────────────────
// Represents a prior AI response. Used to pass conversation history so the
// model understands context. Without it, "Who is their president?" is ambiguous.
async function assistantRoleExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'user',      content: 'Tell me about France in one sentence.' },
            { role: 'assistant', content: 'France is a Western European country known for its culture, cuisine, and the Eiffel Tower.' },
            { role: 'user',      content: 'Who is their president?' },
        ],
    })
    console.log('--- assistant role ---')
    console.log(response.output_text)
}

async function main() {
    await developerRoleExample()
    await userRoleExample()
    await assistantRoleExample()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
