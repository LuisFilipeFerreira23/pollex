import { validationResult } from "express-validator";

export function handleErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed!",
      errors: errors.array().map((error) => ({
        message: error.msg,
      })),
    });
  }
  next();
}
