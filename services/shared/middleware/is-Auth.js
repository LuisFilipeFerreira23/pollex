import jwt from "jsonwebtoken";
import redisClient from "../database/redis.js";

// Middleware that validates JWT tokens and checks if they have been revoked via Redis blacklist.
export async function isAuth(req, res, next) {
  try {
    // Extract the authorization token from the request header.
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Verify that an authorization token was provided.
    if (!token) return res.status(401).json({ message: "No Token provided!" });

    // Verify the JWT token signature and decode it using the private key.
    const verifyToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // Check if token is blacklisted in Redis (set during logout or token refresh).
    try {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return res
          .status(401)
          .json({ message: "Token has been revoked. Please login again." });
      }
    } catch (redisErr) {
      console.error("Redis error during token validation:", redisErr);
      // Continue anyway if Redis is unavailable (graceful degradation)
    }

    // Attach the decoded token data to the request object for use in route handlers.
    req.user = verifyToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired!" });
    }
    return res
      .status(401)
      .json({ message: "Invalid token!", error: error.message });
  }
}
