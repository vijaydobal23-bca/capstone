
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";

const app = express();

const proxies = [];

function getProxy(sandboxId) {
  if (!proxies[sandboxId]) {
    proxies[sandboxId] = createProxyMiddleware({
      target: `http://sandbox-service-${sandboxId}`,
      changeOrigin: true,
      ws: true,
    });
  }

  return proxies[sandboxId];
}

app.get("/api/status/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/status/readyz", (req, res) => {
  res.status(200).json({ status: "ready" });
});

app.use((req, res, next) => {
  const host = req.headers.host;

  if (!host) {
    return res.status(400).json({ error: "Host header is missing" });
  }

  const sandboxId = host.split(".")[0];

  return getProxy(sandboxId)(req, res, next);
});

export default app;
