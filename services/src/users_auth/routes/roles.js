// Importa a função express do pacote express
import express from "express";
import { isAuth } from "../middleware/is-Auth.js";
import { getUserRole } from "../controllers/rolesController.js";

// Cria um novo router usando o express.Router
const router = express.Router();

/**
 * @swagger
 * /roles/{userId}:
 *   get:
 *     summary: Get user role
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User role retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Define uma rota GET na raiz ('/') que chama a função getManagement
// Todos os paths definidos aqui terão como base 'http://localhost:5173'
router.get("/:userId", isAuth, getUserRole);

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
