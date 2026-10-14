import { z } from "zod";
import express from "express";
import llmRouter from "./src/routes/triage.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ name: "API learning", version: "1.0", endpoints: ["/tasks"] });
});
app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

app.use("/api", llmRouter);

app.listen(PORT, () => {
  console.log("App listens on port: ", PORT);
});
