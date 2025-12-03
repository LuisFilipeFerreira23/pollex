// Importa o módulo express
import express from "express";
import { handleErrors } from "../middleware/validationErrors.js";

// Importa as funções de controle de autenticação
import {
  initialTesting,
  login,
  register,
  passwordChange,
} from "../controllers/authController.js";

//Importar o middleware de autenticação
import { check } from "express-validator";

// Cria um novo router usando o express
const router = express.Router();
/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Test endpoint(TBR)
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: API is running
 */
router.get("/", initialTesting);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
// Define as rotas de autenticação
// Rota para login
router.post(
  "/login",
  [
    check("email", "Please enter a valid email!").isEmail().normalizeEmail(),
    check("password", "Password is required!").isLength({ min: 6 }).trim(),
  ],
  handleErrors,
  login
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
// Rota para registro de novo usuário
router.post(
  "/register",
  [
    check("email", "Please enter a valid email!").isEmail().normalizeEmail(),
    check("password", "Password is required!").isLength({ min: 6 }).trim(),
  ],
  handleErrors,
  register
);

/**
 * @swagger
 * /auth/passChange:
 *   post:
 *     summary: Change User Password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
// Rota para recuperação de senha
router.post(
  "/passChange",
  [
    check("email", "Please enter a valid email!").isEmail().normalizeEmail(),
    check("oldPassword", "Your old password is required!")
      .isLength({ min: 6 })
      .trim(),
    check("newPassword", "Your new password is required!")
      .isLength({ min: 6 })
      .trim(),
  ],
  handleErrors,
  passwordChange
);

// Exporta o router para ser usado no arquivo principal da aplicação
export default router;
