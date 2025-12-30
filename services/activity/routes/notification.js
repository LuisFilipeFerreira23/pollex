// Importa a função express
import express from "express";

// Importa os controladores das configurações
import {
  getNotifsForUser,
  createNotifs,
} from "../controllers/notificationsController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um router usando o express Router
const router = express.Router();

/**
 * @swagger
 * /comments/{userId}:
 *   get:
 *     summary: Get comments for a user
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: User or comments not found
 *       500:
 *         description: Server error
 */
router.get("/:userId", /* isAuth, */ getNotifsForUser);

/**
 * @swagger
 * /notifications/create:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - taskId
 *               - userId
 *             properties:
 *               content:
 *                 type: string
 *               taskId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/create", /* isAuth ,*/ createNotifs);

export default router;
