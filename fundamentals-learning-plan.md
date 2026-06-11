# OpenAI Fundamentals Learning Plan

## Completed
1. ✅ Basic Setup — install SDK, connect API key, first API call
2. ✅ System Instructions — give the model a role and rules
3. ✅ Tokens — usage, max_output_tokens, counting with tiktoken
4. ✅ Temperature — controlling randomness (0, 1, 2)
5. ✅ Context Management — how the model remembers conversation history
6. ✅ Structured Outputs — get JSON back instead of free text

## Remaining
7. [ ] Streaming — show partial text in real time
   - Goal: understand that the model can send text in small pieces instead of waiting for the full answer.
   - Minimal Node.js example:

```js
import OpenAI from "openai";

const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-5.5",
  input: "Say hello in one short sentence.",
  stream: true,
});

for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);
  }
}
```

   - What to observe:
     - text appears incrementally in the terminal
     - you do not wait for the full response before seeing output
   - Tiny exercise:
     - change the prompt to a longer sentence
     - confirm the output still arrives in parts
8. [ ] Function Calling / Tool Use — let the model trigger functions in your code
9. [ ] Embeddings — turn text into numbers to do semantic search and similarity
10. [ ] Vision — send images to the model and ask questions about them
11. [ ] Audio — speech to text (Whisper) and text to speech (TTS)
12. [ ] Error Handling & Rate Limits — handle failures and API limits gracefully
