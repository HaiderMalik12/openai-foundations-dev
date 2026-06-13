import { openai } from './openai.js'

function getOrderStatus(orderId) {
    const orders = {
        '123': 'shipped',
        '456': 'processing',
        '676': 'cancelled',
        '980':'processing',
        '908': 'delivered'
    }

    return orders[orderId] ?? 'not found'
}

async function main() {
    const firstResponse = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: 'What is the status of order 456?',
        tools: [
            {
                type: 'function',
                name: 'get_order_status',
                description: 'Get the status of an order by ID.',
                parameters: {
                    type: 'object',
                    properties: {
                        orderId: { type: 'string' },
                    },
                    required: ['orderId'],
                    additionalProperties: false,
                },
                strict: true,
            },
        ],
        tool_choice: 'required',
        store: true,
    })

    const toolCall = firstResponse.output.find((item) => item.type === 'function_call')

    if (!toolCall) {
        console.log('No function call returned.')
        return
    }

    const args = JSON.parse(toolCall.arguments)
    const status = getOrderStatus(args.orderId)

    const secondResponse = await openai.responses.create({
        model: 'gpt-4o-mini',
        previous_response_id: firstResponse.id,
        input: [
            {
                type: 'function_call_output',
                call_id: toolCall.call_id,
                output: status,
            },
        ],
    })

    console.log(secondResponse.output_text)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
