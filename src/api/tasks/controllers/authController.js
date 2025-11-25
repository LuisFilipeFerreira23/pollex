import db from "../util/dbmanager.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const { User } = db;

export function initialTesting(req, res, next) {
  res.status(200).json({ message: "Login route is working!" });
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email: email } });
    if (!exists) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, exists.password);

    const token = jwt.sign(
      { id: exists.id, email: exists.email },
      "your_jwt_secret",
      {
        expiresIn: "2h",
      }
    );

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function register(req, res, next) {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email: email } });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "User created successfully:", user: newUser });
  } catch (error) {
    next("Error creating user: " + error.message);
  }
}

export function passwordRecovery(req, res) {
  console.log(123);
}
