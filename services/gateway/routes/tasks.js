import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config("./.env");

const tasksServiceUrl = "http://api-tasks:5173";

export default createProxyMiddleware({
  target: tasksServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    "^/api/tasks": "",
  },
  logLevel: "debug", // See proxy logs
  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy error", message: err.message });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to ${tasksServiceUrl}`);
  },
});
