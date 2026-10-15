import fs from "node:fs/promises";
import path from "node:path";
import { classifyMessage } from "../src/llm/triage.js";

async function runEval() {
  console.log("🚀 Running AI model evaluation...\n");

  const casesPath = path.join(process.cwd(), "evals", "cases.json");
  const rawData = await fs.readFile(casesPath, "utf-8");
  const testCases = JSON.parse(rawData);

  let passed = 0;
  const total = testCases.length;

  for (const testCase of testCases) {
    process.stdout.write(
      `[Test #${testCase.id}] Testing: "${testCase.input.substring(0, 35)}..." -> `,
    );

    try {
      const result = await classifyMessage(testCase.input);
      const isMatch = result.category === testCase.expected_category;

      if (isMatch) {
        passed++;
        console.log(`✅ PASSED (Category: ${result.category})`);
      } else {
        console.log(
          `❌ FAILED (Expected: ${testCase.expected_category}, Got: ${result.category})`,
        );
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
    }
  }

  const scorePercentage = ((passed / total) * 100).toFixed(1);
  console.log("\n=================================");
  console.log(`📊 EVALUATION SCORE: ${passed}/${total} (${scorePercentage}%)`);
  console.log("=================================\n");
}

runEval();
