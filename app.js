import { z } from "zod";
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ name: "API learning", version: "1.0", endpoints: ["/tasks"] });
});
app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("App listens on port: ", PORT);
});
