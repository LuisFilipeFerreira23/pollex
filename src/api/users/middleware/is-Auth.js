import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function isAuth(req, res, next) {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;

    const token = req.header(headerkey);

    if (!token) {
      return res.status(500).json({ message: "Invalid Token" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    req.user = verifyToken;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
