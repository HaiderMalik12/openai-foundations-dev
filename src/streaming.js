import { openai } from './openai.js'

async function streamTurn(title, params) {
    const stream = openai.responses.stream({
        model: 'gpt-4o-mini',
        store: true,
        ...params,
    })

    console.log(title)

    for await (const event of stream) {
        if (event.type === 'response.output_text.delta') {
            process.stdout.write(event.delta)
        }
    }

    process.stdout.write('\n')

    return await stream.finalResponse()
}

async function main() {
    const firstResponse = await streamTurn('--- turn 1 ---', {
        input: [
            {
                role: 'user',
                content: 'My name is Sam.',
            },
        ],
    })

    await streamTurn('--- turn 2 ---', {
        previous_response_id: firstResponse.id,
        input: [
            {
                role: 'user',
                content: 'What is my name?',
            },
        ],
    })
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
