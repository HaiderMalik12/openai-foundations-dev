# Function Calling Notes

## Basic Idea

Function calling is for when the model needs to use something your code knows or can do, instead of guessing from its training data.

The basic split is:
- The model understands the request and decides what should happen.
- Your application performs the real action or fetches the real data.

## Why It Exists

The model does not know live or private data by itself.

It cannot directly:
- query your database
- call your internal API
- check the weather
- update an order
- send an email

Without function calling, the model would have to guess or answer vaguely.
With function calling, the model can ask your app to do the work with specific inputs.

## What Problem It Solves

Function calling solves the gap between:
- what the model can reason about
- what your application can actually do

It is useful for:
- fresh data like weather, stock prices, and order status
- private data like user profiles, bookings, or internal records
- real actions like creating tickets, sending emails, or updating data

## Mental Model

Think of it as:
1. The model asks for a tool.
2. Your code runs the tool.
3. The model uses the result to answer the user.

## One-Sentence Summary

Function calling turns the model from just a text generator into something that can ask your app to fetch data or perform actions.

---

## Key API Options

### `tool_choice: 'required'`

Forces the model to call a tool — it cannot respond with plain text. Without it, the model decides on its own whether to call a tool or just answer. Use it when you know a tool call is always necessary and you want to guarantee one is returned (so your code can safely look for it in the output without a fallback).

### `strict: true`

Enforces that the model's tool call arguments exactly match your defined `parameters` schema — no extra fields, no missing required fields. Depends on `additionalProperties: false` and all fields listed in `required`. Without it, the model might hallucinate extra arguments or omit required ones. With it, the returned JSON is guaranteed to parse cleanly into what you expect.

### `store: true`

Tells OpenAI to persist this response on their servers so it can be referenced later by ID via `previous_response_id`. This enables a two-turn pattern where the second API call does not need to re-send the full conversation history — it just references the first response by ID and OpenAI reconstructs the context from what was stored. Without it, the ID exists but the second call would fail.
