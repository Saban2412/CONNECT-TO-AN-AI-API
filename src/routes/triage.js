import express from "express";
import { inputSchema } from "../schemas/triage.js";
import { classifyMessage } from "../llm/triage.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const validation = inputSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Bad request",
      details: validation.error.format(),
    });
  }

  const { text } = validation.data;

  if (process.env.LLM_ENABLED === "false") {
    return res.status(503).json({
      category: "other",
      urgency: "normal",
      confidence: 0.0,
      reason: "Kill switch active: AI classification is temporarily disabled.",
    });
  }

  if (process.env.LLM_STUB === "1") {
    return res.json({
      category: "bug",
      urgency: "high",
      confidence: 0.9,
      reason: "Stub mode active: Mock application failure classification.",
    });
  }

  const result = await classifyMessage(text);
  return res.json(result);
});

export default router;
