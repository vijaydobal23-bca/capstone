import express from "express";
import morgan from "morgan";
import { v7 as uuid } from "uuid";
import { createPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/sandbox/health", (req, res) => {
  res.status(200).json({
    message: "Express api is good",
  });
});

app.post("/api/sandbox/start", async (req, res) => {
  const sandboxId = uuid();

  try {
    await Promise.all([createPod(sandboxId), createService(sandboxId)]);

    return res.status(200).json({
      message: "Sandbox is ready",
      sandboxId,
      previewUrl: `http://sandbox-${sandboxId}.preview.localhost`
    })
    
  } catch (error) {
    console.error("Error starting sandbox:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    })
  }
});

export default app;
