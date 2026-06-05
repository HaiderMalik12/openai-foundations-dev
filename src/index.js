import {openai} from './openai.js'
import {encoding_for_model} from 'tiktoken';

async function main(){
   
    // const response = await openai.responses.create({
    //     input: '10*10*23',
    //     instructions: 'Give result in 1 word',
    //     model: 'gpt-4o-mini',
    // });


    // const response = await openai.responses.create({
    //     input: 'tell mw one best color',
    //     instructions: 'Give result in 20 word',
    //     model: 'gpt-4o-mini',
    // });


    const prompt = `Many words map to one token, but some don't: indivisible.

Unicode characters like emojis may be split into many tokens containing the underlying bytes: 🤚🏾

Sequences of characters commonly found next to each other may be grouped together: 1234567890`;
    const model = 'gpt-4o-mini'


    const response = await openai.responses.create({
        input: [
        //    { role : 'system', content: 'answer in 20 words'},
        //    {role: 'developer', content: 'Give a basic example in js'},
           { role : 'user', content: prompt}
        ],
        model
    })


    console.log(response.usage)

    function calculateToken(){
        const encoder = encoding_for_model(model);
        const tokenData = encoder.encode(prompt);
        console.log(tokenData);
    }

    calculateToken();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});