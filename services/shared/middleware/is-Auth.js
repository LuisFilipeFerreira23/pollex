import jwt from "jsonwebtoken";

export function isAuth(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "No Token provided!" });

    const verifyToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = verifyToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired!" });
    }
    return res.status(401).json({ message: "Invalid token!", error: error.message });
  }
}
