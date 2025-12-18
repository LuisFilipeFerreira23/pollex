import { createProxyMiddleware } from "http-proxy-middleware";

export default createProxyMiddleware({
  target: "http://activity:3001",
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    "^/api/activity": "", //Change API path to ''
  },
});
