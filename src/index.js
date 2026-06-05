import {openai} from './openai.js'

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



    const response = await openai.responses.create({
        input: [
           { role : 'system', content: 'answer in urdu language'},
           {role: 'developer', content: 'Give a basic example in js'},
           { role : 'user', content: 'what is coding'}
        ],
        model: 'gpt-4o-mini'
    })


    console.log(response.output_text)
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});