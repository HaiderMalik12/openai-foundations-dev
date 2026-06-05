import {openai} from './openai.js'
// import {encoding_for_model} from 'tiktoken';

async function main(){

    const prompt = `How are you?`;
    const model = 'gpt-4o-mini'


    const response = await openai.responses.create({
        input: [
           { role : 'user', content: prompt}
        ],
        model,
        // temperature: 2
        // max_output_tokens: 16
        store: true
    })

    // console.log(response)

    const oldResponse = await openai.responses.retrieve('resp_027e4e4147b44842006a22f33e50108193a1d630e72b37930b');
    console.log(oldResponse)
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});