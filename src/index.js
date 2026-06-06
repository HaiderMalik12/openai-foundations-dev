import { openai } from "./openai.js";

const context = [
  { 
    role : 'system',
    content: 'Keep answer short and simple'
  }
]

async function aiAnswer(question) {
  
  context.push({role: 'user', content: question});

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: context,
  });

  context.push({role: 'assistant', content: response.output_text});
  console.log(context);
  console.log(response.output_text);
}

process.stdout.write("Ask your question: ");

process.stdin.on("data", (data) => {
  const question = data.toString().trim();
  if (question === "exit") {
    process.exit();
  } else {
    aiAnswer(question);
  }
});
