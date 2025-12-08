// Importa a função express
import express from "express";

// Importa os controladores para visualizar informações do usuário e tarefas
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/usersController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um router usando o express Router
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       500:
 *         description: Server error
 */
//Just for initial tests
router.get("/", isAuth, getUsers);

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
// Define as rotas baseadas em 'http://localhost:5173'
// Rota para obter informações do usuário
router.post("/create", isAuth, createUser);

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user information
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - username
 *               - email
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Server error
 */
// Rota para atualizar informações do usuário
router.put("/update", isAuth, updateUser);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Server error
 */
// Rota para obter tarefas do usuário
router.delete("/delete", isAuth, deleteUser);

// Exporta o router para ser utilizado no ficheiro principal
export default router;
