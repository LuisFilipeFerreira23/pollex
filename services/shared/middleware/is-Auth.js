import jwt from "jsonwebtoken";

export function isAuth(req, res, next) {
  try {
    const headerkey = Authorization;

    const token = req.header(headerkey);

    if (!token) {
      return res.status(500).json({ message: "Invalid Token" });
    }

    const verifyToken = jwt.verify(token, your_jwt_private_key);

    req.user = verifyToken;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
