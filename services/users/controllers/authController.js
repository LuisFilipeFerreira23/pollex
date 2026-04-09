import db from "../database/dbmanager.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config("./.env");

const { User } = db;
const { Roles } = db;

// Helper function to generate tokens
function generateTokens(userId, email) {
  const accessToken = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "30m",
    }
  );

  const refreshToken = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_REFRESH_KEY || process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "3d",
    }
  );

  return { accessToken, refreshToken };
}

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

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const { accessToken, refreshToken } = generateTokens(exists.id, exists.email);

    // Store refresh token in database
    await User.update(
      { refreshToken: refreshToken },
      { where: { id: exists.id } }
    );

    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
      user: {
        id: exists.id,
        email: exists.email,
        username: exists.username,
      },
    });
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

    const { accessToken, refreshToken } = generateTokens(null, email);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      roleId: roleExists.id,
      refreshToken: refreshToken,
    });

    return res.status(200).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error: ", error: error.message });
  }
}

export async function refreshAccessToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token is required!" });

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY || process.env.JWT_PRIVATE_KEY
    );

    // Check if refresh token exists in database
    const user = await User.findOne({
      where: { id: decoded.id, refreshToken: refreshToken },
    });

    if (!user)
      return res
        .status(401)
        .json({ message: "Refresh token is invalid or has been revoked!" });

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "30m",
      }
    );

    return res.status(200).json({
      message: "Token refreshed successfully!",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Refresh token has expired! Please login again." });
    }
    return res.status(401).json({
      message: "Invalid refresh token!",
      error: error.message,
    });
  }
}

export async function logout(req, res, next) {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required!" });

    // Clear refresh token from database
    await User.update(
      { refreshToken: null },
      { where: { email: email } }
    );

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function passwordChange(req, res, next) {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const exists = await User.findOne({ where: { email } });

    if (!exists) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(oldPassword, exists.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      {
        password: hashedPassword,
      },
      { where: { email: email } }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
