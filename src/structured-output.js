import { openai } from './openai.js'

// ─── THE PROBLEM: without structured output ───────────────────────────────────
// User types: "I want a remote React job that pays at least 80k"
// The model replies with a sentence — useless for querying a database.
async function withoutStructuredOutput() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'user', content: 'I want a remote React job that pays at least 80k' },
        ],
    })

    console.log('--- WITHOUT structured output ---')
    console.log(response.output_text)
    // "Sure! You're looking for a remote React developer position with a minimum salary of $80,000."
    // You can't do response.type or response.minSalary — it's just a string.
}

// ─── THE SOLUTION: with structured output ────────────────────────────────────
// Same user input — but now the model returns clean data your code can use.
async function withStructuredOutput() {
    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: [
            { role: 'user', content: 'I want a remote React job that pays at least 80k' },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'job_filter',
                strict: true,
                schema: {
                    type: 'object',
                    properties: {
                        jobType:   { type: 'string' },  // "remote"
                        tech:      { type: 'string' },  // "React"
                        minSalary: { type: 'number' },  // 80000
                    },
                    required: ['jobType', 'tech', 'minSalary'],
                    additionalProperties: false,
                },
            },
        },
    })

    const filters = JSON.parse(response.output_text)

    console.log('--- WITH structured output ---')
    console.log(filters)
    // { type: 'remote', tech: 'React', minSalary: 80000 }

    // Now you can use it directly in your code:
    console.log(`Searching for ${filters.jobType} ${filters.tech} jobs with salary >= ${filters.minSalary}`)
    // db.jobs.find({ type: filters.type, tech: filters.tech, salary: { $gte: filters.minSalary } })
}

async function main() {
    await withoutStructuredOutput()
    await withStructuredOutput()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
