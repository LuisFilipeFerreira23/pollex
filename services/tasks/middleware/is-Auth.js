import jwt from "jsonwebtoken";

export function isAuth(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(500).json({ message: "No Token provided!" });

    const verifyToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = verifyToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
