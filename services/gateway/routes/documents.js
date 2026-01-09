import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config("./.env");

const docsServiceUrl = "http://api-docs:5176";

export default createProxyMiddleware({
  target: docsServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    "^/api/documents": "",
  },
  logLevel: "debug", // See proxy logs
  preserveHeaderKeyCase: true, // Ensure Headers are forwarded correctly
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to ${tasksServiceUrl}`);
    console.log(`Authorization Headers:`, req.headers.authorization);

    if (req.headers.authorization) {
      proxyReq.setHeader("Authorization", req.headers.authorization);
    }
  },

  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy error", message: err.message });
  },
});
