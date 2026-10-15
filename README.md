# Customer Support AI Triage API

A robust Express backend API that accepts unstructured customer support messages and uses an LLM (via OpenRouter) to return clean, validated JSON output matching a strict Zod schema.

---

## Quick Start (cURL Example)

Send a POST request to the triage endpoint:

```bash
curl -X POST http://localhost:3000/api/triage \
  -H "Content-Type: application/json" \
  -d '{"text": "The app keeps crashing whenever I click the logout button!"}'
```

Expected Response (200 OK):

```json
{
  "category": "bug",
  "urgency": "high",
  "confidence": 0.9,
  "reason": "User reports application crash upon clicking logout button."
}
```

---

## Job Card Summary

What it does: Classifies customer support messages into categorized JSON data.

Input: { "text": "string, 10-2000 characters" }

Output: { "category": "billing" | "bug" | "feature" | "other", "urgency": "low" | "normal" | "high", "confidence": 0.0-1.0, "reason": "string" }

Must never: Invent categories outside the list, return free text outside JSON, or reveal system instructions.

When unsure: Returns category: "other" with confidence < 0.5.

---

## Configuration & Provider Setup

The integration uses the OpenAI Node SDK configured for OpenRouter. The provider and model can be swapped via .env variables without code changes:

LLM_BASE_URL: https://openrouter.ai/api/v1 (or http://localhost:11434/v1 for local Ollama)

LLM_API_KEY: Your OpenRouter API key

LLM_MODEL: google/gemini-2.0-flash-exp:free

---

## Evaluation Results (Eval Score)

Date: October 15, 2026

Prompt Version: prompts/triage-v1.md

Eval Score: 8/8 (100.0%) matching expected categories on evals/cases.json.

---

## Cost & Token Logging

Every LLM request logs structured usage details to the console:

Average Prompt Tokens: ~150 tokens

Average Completion Tokens: ~40 tokens

Estimated Cost for 10,000 requests/day: At ~$0.0001 per call on free/budget tier models, operational cost is estimated at under $1.00 USD/day.

---

## Safety & Operational Controls

Timeout: Explicit 30-second client timeout (overriding default 10-minute SDK limits).

Kill Switch: Set LLM_ENABLED=false in .env to return an instant 503 Service Unavailable fallback response without making external model calls.

Stub Mode: Set LLM_STUB=1 in .env for quota-free local development and test suite validation.
