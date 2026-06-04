import {openai} from './openai.js'

async function main(){
   
    const response = await openai.responses.create({
        input: 'apple color is',
        model: 'gpt-4o-mini'
    });

    console.log(response.output_text)
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});