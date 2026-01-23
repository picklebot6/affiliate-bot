import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const resp = await client.responses.create({
  model: "gpt-4o-mini",
  input: "Write a one-sentence product description for a 4K streaming device.",
});

console.log(resp.output_text);
