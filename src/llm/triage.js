import fs from "node:fs/promises";
import path from "node:path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { llmClient } from "./client.js";
import { outputSchema } from "../schemas/triage.js";

const PROMPT_VERSION = "v1";
const jsonSchema = zodToJsonSchema(outputSchema, "TriageResponse");

export async function classifyMessage(text) {
  const startTime = Date.now();

  try {
    const promptPath = path.join(
      process.cwd(),
      "prompts",
      `triage-${PROMPT_VERSION}.md`,
    );
    const promptTemplate = await fs.readFile(promptPath, "utf-8");
    const systemPrompt = promptTemplate.replace(
      "{{JSON_SCHEMA}}",
      JSON.stringify(jsonSchema),
    );

    const completion = await llmClient.chat.completions.create({
      model: process.env.LLM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const durationMs = Date.now() - startTime;
    const usage = completion.usage || {};

    console.log(
      `[LLM COST LOG] Model: ${process.env.LLM_MODEL} | Prompt Tokens: ${usage.prompt_tokens || 0} | Completion Tokens: ${usage.completion_tokens || 0} | Duration: ${durationMs}ms | Prompt Version: ${PROMPT_VERSION}`,
    );

    const rawContent = completion.choices[0].message.content;
    const parsedJson = JSON.parse(rawContent);

    const validation = outputSchema.safeParse(parsedJson);

    if (!validation.success) {
      throw new Error("Invalid schema structure from LLM");
    }

    return validation.data;
  } catch (error) {
    console.error("AI Service Error (Falling back):", error.message);

    return {
      category: "other",
      urgency: "normal",
      confidence: 0.0,
      reason:
        "Fallback triggered: AI classification service was unavailable or produced invalid output.",
    };
  }
}
