import { openai } from './openai.js'

// ─── CONTEXT: without history ────────────────────────────────────────────────
// Each API call is independent by default. The model has no memory.
// Here we ask a follow-up question — "What is its population?" — but the model
// has no idea what "it" refers to because we never sent the first message.
async function noContextExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'user', content: 'What is its population?' }, // "its" = ???
        ],
    })
    console.log('--- without context (model is confused) ---')
    console.log(response.output_text)
}

// ─── CONTEXT: with history ───────────────────────────────────────────────────
// Pass the full conversation history in the input array.
// Now the model can see the first message and knows "it" = France.
async function withContextExample() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'user',      content: 'Tell me about France in one sentence.' },
            { role: 'assistant', content: 'France is a country in Western Europe known for the Eiffel Tower and its cuisine.' },
            { role: 'user',      content: 'What is its population?' }, // "its" = France
        ],
    })
    console.log('--- with context (model understands) ---')
    console.log(response.output_text)
}

// ─── CONTEXT: growing history array ─────────────────────────────────────────
// In a real chatbot you keep an array and push each message into it after
// every turn. This way the model always has the full conversation so far.
async function growingContextExample() {
    const history = [
        { role: 'developer', content: 'Keep answers short.' },
    ]

    // Turn 1
    history.push({ role: 'user', content: 'My name is Haider.' })
    const reply1 = await openai.responses.create({ model: 'gpt-4o-mini', input: history })
    history.push({ role: 'assistant', content: reply1.output_text })

    // Turn 2 — model should remember the name from turn 1
    history.push({ role: 'user', content: 'What is my name?' })
    const reply2 = await openai.responses.create({ model: 'gpt-4o-mini', input: history })
    history.push({ role: 'assistant', content: reply2.output_text })

    console.log('--- growing context (model remembers the name) ---')
    console.log('Turn 1:', reply1.output_text)
    console.log('Turn 2:', reply2.output_text)
    console.log('\nFull history array:')
    console.log(history)
}

async function main() {
    await noContextExample()
    await withContextExample()
    await growingContextExample()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
