import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config("./.env");

// Generates access and refresh tokens for a user based on their ID and email.
export default function generateTokens(userId, email) {
  // The access token is signed with the main private key and has a short expiration time.
  // Used for authenticating API requests; short-lived for security.
  const accessToken = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "15m",
    },
  );

  // The refresh token is signed with a different key and has a longer expiration time.
  // Used to obtain new access tokens when the current one expires; stored in database.
  const refreshToken = jwt.sign(
    { id: userId, email: email },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: "3d",
    },
  );

  // Return both tokens as an object for login/registration response.
  return { accessToken, refreshToken };
}
