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
  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy error", message: err.message });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to ${docsServiceUrl}`);
  },
});
