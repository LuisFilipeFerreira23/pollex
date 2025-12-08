import db from "../../util/dbmanager.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const { User } = db;
const { Roles } = db;

export function initialTesting(req, res, next) {
  res.status(200).json({ message: "Login route is working!" });
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email: email } });
    if (!exists) return res.status(404).json({ message: "User not found!" });

    console.log({ exists });

    const isPasswordValid = await bcrypt.compare(password, exists.password);

    const token = jwt.sign(
      { id: exists.id, email: exists.email },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "2h",
      }
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    return res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function register(req, res, next) {
  try {
    const { email, username, password, role } = req.body;

    if (!username || !email || !password || !role)
      return res.status(400).json({ message: "Missing fields!" });

    const exists = await User.findOne({ where: { email: email } });
    if (exists)
      return res.status(409).json({ message: "User already exists!" });

    const formattedRole = role.toLowerCase().trim();

    const roleExists = await Roles.findOne({
      where: { role: formattedRole },
    });
    if (!roleExists)
      return res.status(404).json({ message: "Role does not exist!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      roleId: roleExists.id,
    });
    return res
      .status(200)
      .json({ message: "User created successfully:", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Error: ", error: error.message });
  }
}

export function passwordChange(req, res, next) {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const exists = User.findOne({ where: { email: email } });
    if (!exists) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = bcrypt.compare(oldPassword, exists.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = bcrypt.hash(newPassword, 10);

    User.update({
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
