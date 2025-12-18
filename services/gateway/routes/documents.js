import { createProxyMiddleware } from "http-proxy-middleware";

export default createProxyMiddleware({
  target: "http://documents:3001",
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    "^/api/documents": "", //Change API path to ''
  },
});
