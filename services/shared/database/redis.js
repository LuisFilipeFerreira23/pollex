import redis from "redis";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Use the 'redis' service name as the hostname for Docker networking
const host = process.env.REDIS_HOSTNAME || "redis";
const port = process.env.REDIS_PORT_TASKS || 6379;
const password = process.env.REDIS_PASSWORD
  ? `:${process.env.REDIS_PASSWORD}@`
  : "";

// Create a Redis client connection using the credentials and hostname
const redisClient = redis.createClient({
  url: `redis://${password}${host}:${port}`,
});

// Handle connection errors and log them to console
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis asynchronously
await redisClient.connect();

// Log successful connection with host and port information
console.log(`Connected to Redis at ${host}:${port} successfully.`);

// Export the Redis client for use in other modules (middleware, controllers, etc.)
export default redisClient;
