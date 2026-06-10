# Structured Output Notes

## Why does it matter?

AI output is text. Your code needs data.

When you call the API normally, you get back a human-readable string:

> "Sure! You're looking for a remote React developer position with a minimum salary of $80,000."

That's useless to your code. You can't do `response.type` or `response.minSalary` on a sentence.

With structured output you get:
```js
{ jobType: 'Remote', tech: 'React', minSalary: 80000 }
```
Now your code can use `filters.jobType`, `filters.minSalary` — reliably, every time.

---

## The Mental Model

```
User types English
       ↓
   OpenAI API (structured output)   ← the bridge
       ↓
Your code gets clean data
       ↓
  Database / API / Logic
```

The AI acts as a **translator** — from human language into data your code understands.

---

## Real-world scenarios

| Scenario | What you need |
|---|---|
| User fills a form in plain English | Extract `{ name, email, phone }` |
| Classify a support ticket | Return `{ category: "billing", priority: "high" }` |
| Parse a resume | Return `{ skills: [...], experience: [...] }` |
| AI-powered search filters | Return `{ minPrice: 100, maxPrice: 500, color: "red" }` |
| Save AI output to a database | You need actual fields, not a paragraph |

---

## The Job Board Example

User types: `"I want a remote React job that pays at least 80k"`

### Without structured output
```js
const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: [
        { role: 'user', content: 'I want a remote React job that pays at least 80k' },
    ],
})

console.log(response.output_text)
// "Sure! You're looking for a remote React developer position with a minimum salary of $80,000."
// You can't query a database with that sentence.
```

### With structured output
```js
const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: [
        { role: 'user', content: 'I want a remote React job that pays at least 80k' },
    ],
    text: {
        format: {
            type: 'json_schema',
            name: 'job_filter',
            strict: true,
            schema: {
                type: 'object',
                properties: {
                    jobType:   { type: 'string' },
                    tech:      { type: 'string' },
                    minSalary: { type: 'number' },
                },
                required: ['jobType', 'tech', 'minSalary'],
                additionalProperties: false,
            },
        },
    },
})

const filters = JSON.parse(response.output_text)
// { jobType: 'Remote', tech: 'React', minSalary: 80000 }

// Now you can query your database:
// db.jobs.find({ type: filters.jobType, tech: filters.tech, salary: { $gte: filters.minSalary } })
```

**The model understood the English perfectly in both cases** — it just expressed it differently. Structured output forces it to express understanding as *data* instead of *prose*.

---

## Breaking Down the `text.format` Config

```js
text: {
    format: {
        type: 'json_schema',
        name: 'job_filter',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                jobType:   { type: 'string' },
                tech:      { type: 'string' },
                minSalary: { type: 'number' },
            },
            required: ['jobType', 'tech', 'minSalary'],
            additionalProperties: false,
        },
    },
},
```

### `type: 'json_schema'`
Tells the model: *"Don't reply with a sentence. Reply using the exact schema I'm about to define."*

Two options:
- `json_object` → valid JSON, model picks the shape
- `json_schema` → valid JSON, **you** define the exact shape

### `name: 'job_filter'`
Just a label. The model uses it internally to understand what this schema represents. No effect on the output — but name it after what the data represents (`job_filter`, `person`, `book_recommendation`).

### `strict: true`
Tells the model: *"Follow this schema exactly. No improvising."*

Without it, the model might add extra fields like `experience` or `location` that you didn't ask for. With `strict: true`, it's locked to only what you defined.

### `schema`
The actual shape of the response.

```js
schema: {
    type: 'object',       // the response will be a JSON object { }
    properties: {         // the fields inside that object
        jobType:   { type: 'string' },   // must be text
        tech:      { type: 'string' },   // must be text
        minSalary: { type: 'number' },   // must be a number
    },
    ...
}
```

**How to decide properties?** Ask: *"What data do I actually need to use in my code?"* Only define fields your code will actually use.

### `required: ['jobType', 'tech', 'minSalary']`
Fields the model **must** always include. If a field is not listed here, the model might sometimes skip it.

### `additionalProperties: false`
Blocks the model from returning any fields not in the schema.

Without it:
```js
{ jobType: 'Remote', tech: 'React', minSalary: 80000, experience: '3 years' }
```

With it:
```js
{ jobType: 'Remote', tech: 'React', minSalary: 80000 }
```

---

## Quick Reference

| Key | What it does |
|---|---|
| `type: 'json_schema'` | Use my schema, not free text |
| `name` | Label for the schema (no effect on output) |
| `strict: true` | Follow the schema exactly |
| `properties` | Define the fields and their types |
| `required` | Fields the model must always include |
| `additionalProperties: false` | Block any fields not in the schema |

---

## JSON Mode vs JSON Schema

| | Guarantees |
|---|---|
| `json_object` | Valid JSON only — model picks the shape |
| `json_schema` + `strict: true` | Valid JSON **and** exact shape you defined |
