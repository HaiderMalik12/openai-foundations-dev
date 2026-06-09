import { openai } from './openai.js'

// ─── TEMPERATURE: 0 ──────────────────────────────────────────────────────────
// Temperature 0 = deterministic. The model always picks the single most likely
// next word — no randomness involved. Run it 10 times, get the same answer.
//
// Use it when correctness and consistency matter more than variety:
//   - Factual Q&A          → "What is the capital of France?" must always be Paris
//   - Math / calculations  → 2+2 must always be 4
//   - Code generation      → you want the same reliable output, not a surprise
//   - Data extraction      → parsing a date or name from text must be exact
//
// Avoid it when: you want the response to feel natural or varied (it can
// sound robotic and repetitive at temperature 0).
async function temp0Example() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [{ role: 'user', content: 'What is the capital of France?' }],
        temperature: 0,
    })
    console.log('--- temperature: 0 (deterministic) ---')
    console.log(response.output_text)
}

// ─── TEMPERATURE: 1 ──────────────────────────────────────────────────────────
// Temperature 1 = default. OpenAI uses this when you don't set temperature at all.
// "Trust the model" setting — neither clamped down nor unleashed.
//
// Use it when the task has no single right answer but still needs to sound coherent:
//   - Answering general questions  → needs to feel natural, not robotic
//   - Summarising an article       → multiple valid phrasings exist
//   - Writing an email draft       → should sound human, not identical every time
//   - Chatbot conversations        → variety keeps it from feeling scripted
//
// Rule of thumb:
//   correctness matters more than variety? → lower temperature (toward 0)
//   variety matters more than correctness? → higher temperature (toward 2)
//   neither extreme matters?               → leave it at 1
async function temp1Example() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [{ role: 'user', content: 'Write a one-sentence tagline for a coffee shop.' }],
        temperature: 1,
    })
    console.log('--- temperature: 1 (balanced) ---')
    console.log(response.output_text)
}

// ─── TEMPERATURE: 2 ──────────────────────────────────────────────────────────
// Temperature 2 = maximum randomness. The model picks unusual and unexpected
// words. Run it again and you will get something completely different every time.
//
// Use it when variety and surprise are the goal:
//   - Brainstorming ideas    → you want 10 different angles, not the same one
//   - Creative writing       → poems, stories, slogans benefit from unexpected phrasing
//   - Name generation        → exploring many options for a brand, product, character
//   - Avoiding repetition    → when building a list and you don't want similar items
//
// Avoid it when: accuracy matters. At temperature 2 the model can produce
// incoherent or factually wrong responses — it trades reliability for surprise.
async function temp2Example() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [{ role: 'user', content: 'Write a one-sentence tagline for a coffee shop.' }],
        temperature: 2,
    })
    console.log('--- temperature: 2 (creative/random) ---')
    console.log(response.output_text)
}

async function main() {
    await temp0Example()
    await temp1Example()
    await temp2Example()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
