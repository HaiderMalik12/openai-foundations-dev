import { openai } from './openai.js'

const prompt = 'Write 5 short tips for staying focused.'

async function withoutStreaming() {
    console.log('--- problem: without streaming ---')
    console.log('You wait for the full answer before anything prints.\n')

    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: prompt,
    })

    console.log(response.output_text)
}

async function withStreaming() {
    console.log('--- solution: with streaming ---')
    console.log('Text appears as soon as the model generates it.\n')

    const stream = openai.responses.stream({
        model: 'gpt-4o-mini',
        input: prompt,
    })

    for await (const event of stream) {
        // filters the stream you only handle text chunks
        // 
        if (event.type === 'response.output_text.delta') {

            // event.delta is small piece of text model just generated
            // prints the piece immediately, without adding new line
            process.stdout.write(event.delta)
            //console.log('') //ads new line -- prints
        }
    }

    process.stdout.write('\n')
}

async function main() {
    await withoutStreaming()
    console.log()
    await withStreaming()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
