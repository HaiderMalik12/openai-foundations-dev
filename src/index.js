import { openai } from "./openai.js";

async function aiAnswer(question) {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: question,
  });

  console.log(response.output_text);
}

process.stdout.write("Ask your question");

process.stdin.on("data", (data) => {
  const question = data.toString().trim();
  if (question === "exit") {
    process.exit();
  } else {
    aiAnswer(question);
  }
});
