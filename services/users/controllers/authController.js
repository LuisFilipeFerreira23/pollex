import db from "../database/dbmanager.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateTokens from "../middleware/generateTokens.js";
import redisClient from "../database/redis.js";

dotenv.config("./.env");

const { User } = db;
const { Roles } = db;

// To be deleted
export function initialTesting(req, res, next) {
  res.status(200).json({ message: "Login route is working!" });
}

// Handles user login by verifying credentials, generating tokens, and returning user info.
export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    //Verify if user exists
    const exists = await User.findOne({ where: { email: email } });
    if (!exists) return res.status(404).json({ message: "User not found!" });

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, exists.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(
      exists.id,
      exists.email,
    );

    // Hash the refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Store refresh token in database
    await User.update(
      { refreshToken: hashedRefreshToken },
      { where: { id: exists.id } },
    );

    // Verify the refresh token by comparing it with the hashed version in the database
    const isTokenValid = await bcrypt.compare(refreshToken, hashedRefreshToken);

    if (!isTokenValid) {
      return res
        .status(401)
        .json({ message: "Error generating refresh token!" });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Return the access token and user info in the response
    return res.status(200).json({
      message: "Login successful!",
      accessToken,
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
    // Extract registration data from request body
    const { email, username, password, role } = req.body;

    // Validate that all required fields are provided
    if (!username || !email || !password || !role)
      return res.status(400).json({ message: "Missing fields!" });

    // Check if user with this email already exists in the database
    const exists = await User.findOne({ where: { email: email } });
    if (exists)
      return res.status(409).json({ message: "User already exists!" });

    // Format and validate the provided role
    const formattedRole = role.toLowerCase().trim();

    const roleExists = await Roles.findOne({
      where: { role: formattedRole },
    });
    if (!roleExists)
      return res.status(404).json({ message: "Role does not exist!" });

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided information
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      roleId: roleExists.id,
      refreshToken: null,
    });

    // Generate access and refresh tokens for the newly created user
    const { accessToken, refreshToken } = generateTokens(newUser.id, email);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Store the hashed refresh token and plain access token in the database
    await User.update(
      { refreshToken: hashedRefreshToken },
      { where: { id: newUser.id } },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Return the access token and user info in the response
    return res.status(201).json({
      message: "User created successfully",
      accessToken,
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
    // Extract the access token from the Authorization header (if provided)
    const accessToken = req.header("Authorization")?.replace("Bearer ", "");

    // Extract the refresh token from the cookies in the request
    const refreshToken = req.cookies.refreshToken;

    // Validate that a refresh token was provided
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token is required!" });

    // Verify the refresh token signature and decode it
    const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isTokenValid)
      return res
        .status(401)
        .json({ message: "Refresh token is invalid or has been revoked!" });

    // Blacklist the old access token in Redis if it exists
    if (accessToken) {
      try {
        const decodedOldToken = jwt.decode(accessToken);
        // Only blacklist if the old token has a valid structure and an expiration time
        if (decodedOldToken && decodedOldToken?.exp) {
          // Calculate remaining time until the old token expires
          const expiresIn = decodedOldToken.exp - Math.floor(Date.now() / 1000);
          if (expiresIn > 0) {
            // Store the token in Redis blacklist with its expiration time
            await redisClient.setEx(
              `blacklist:${accessToken}`,
              expiresIn,
              "revoked",
            );
          }
        }
      } catch (redisErr) {
        console.error("Redis error during token refresh:", redisErr);
      }
    }
    // Generate a new access token with a 30-minute expiration
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "15m",
      },
    );

    // Return the new access token in the response
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
      error: { message: error.message },
    });
  }
}

export async function logout(req, res, next) {
  try {
    // Extract the access token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(401).json({ message: "Access token is required!" });

    // Verify the access token is valid
    const verifyToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // Blacklist the access token in Redis with its expiration time
    try {
      // Calculate remaining time until the token naturally expires
      const expiresIn = verifyToken.exp - Math.floor(Date.now() / 1000);
      if (expiresIn > 0) {
        // Store the token in Redis blacklist so it can't be used anymore
        await redisClient.setEx(`blacklist:${token}`, expiresIn, "revoked");
      }
    } catch (redisErr) {
      console.error("Redis error during logout:", redisErr);
      // Continue anyway if Redis fails (graceful degradation)
    }

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function passwordChange(req, res, next) {
  try {
    // Extract email, old password, and new password from request body
    const { email, oldPassword, newPassword } = req.body;

    // Retrieve the user from the database using the provided email
    const exists = await User.findOne({ where: { email } });

    if (!exists) return res.status(404).json({ message: "User not found" });

    // Verify the old password by comparing it with the stored hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, exists.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Hash the new password before storing it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database with the new hashed password
    await User.update(
      {
        password: hashedPassword,
        refreshToken: null,
      },
      { where: { email: email } },
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
