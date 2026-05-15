import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config('./.env');

// In Docker use the service name; allow override with ACTIVITY_SERVICE_URL for local debugging
const activityServiceUrl = process.env.ACTIVITY_SERVICE_URL || 'http://api-activity:5175';

// Diagnostic log to confirm which target the proxy will use (appears in gateway container logs)
console.log(`Activity proxy target resolved to: ${activityServiceUrl}`);

export default createProxyMiddleware({
    target: activityServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/activity': '',
    },
    logLevel: 'debug', // See proxy logs
    preserveHeaderKeyCase: true, // Ensure Headers are forwarded correctly
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.url} to ${activityServiceUrl}`);
        console.log(`Authorization Headers:`, req.headers.authorization);

        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    },

    // Log proxied responses for debugging
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Proxied response: ${req.method} ${req.url} -> ${activityServiceUrl} [status: ${proxyRes.statusCode}]`);
    },

    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy error', message: err.message });
    },
});
