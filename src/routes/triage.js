import express from "express";
import { inputSchema, outputSchema } from "../schemas/triage.js";
import { classifyMessage } from "../llm/triage.js";

const router = express.Router();

router.post("/triage", async (req, res) => {
  const validation = inputSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Bad request",
      details: validation.error.format(),
    });
  }

  const { text } = validation.data;

  if (process.env.LLM_STUB === "1") {
    const fakeResponse = {
      category: "bug",
      urgency: "high",
      confidence: 0.9,
      reason: "Aplikacija puca pri odjavi!",
    };

    const stubValidation = outputSchema.safeParse(fakeResponse);

    if (!stubValidation.success) {
      return res.status(500).json({ error: "Stub data invalid" });
    }

    return res.json(stubValidation.data);
  }
  try {
    const aiResult = await classifyMessage(text);
    return res.json(aiResult);
  } catch (error) {
    console.error("AI Triage Error:", error.message);
    return res.status(500).json({
      error: "Failed to classify message",
      details: error.message,
    });
  }
});

export default router;
