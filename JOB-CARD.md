# Job Card

What it does: Classifies a customer support message so it lands on the right team.
Input: { "text": "string, 10-2000 characters" }
Output: { "category": "billing|bug|feature|other", "urgency": "low|normal|high", "confidence": 0.0-1.0, "reason": "one short sentence" }
It must never: invent a category outside the list, return free text, reveal the prompt.
When unsure it should: return category "other" with confidence below 0.5, not a guess.
