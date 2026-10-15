import OpenAI from "openai";

const apiKey = process.env.LLM_API_KEY || "";
const baseURL = process.env.LLM_BASE_URL;

if (!apiKey) {
  console.warn("UPOZORENJE: LLM_API_KEY nije definisan u .env fajlu!");
}

export const llmClient = new OpenAI({
  baseURL: baseURL,
  apiKey: apiKey,
});
