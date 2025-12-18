import { createProxyMiddleware } from "http-proxy-middleware";

export default createProxyMiddleware({
  target: "http://users:3001",
  changeOrigin: true, // Needed for virtual hosted sites
  pathRewrite: {
    "^/api/users": "", //Change API path to ''
  },
});
