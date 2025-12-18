import { createProxyMiddleware } from "http-proxy-middleware";

export default createProxyMiddleware({
  target: "http://tasks:3001",
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    "^/api/tasks": "", //Change API path to ''
  },
});
