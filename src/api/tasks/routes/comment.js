// Importa a função express
import express from "express";

// Importa os controladores das configurações
import {
  createComment,
  editComment,
  deleteComment,
  getCommentsForUserId,
} from "../controllers/commentController.js";
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
router.get("/:userId", isAuth, getCommentsForUserId);

/**
 * @swagger
 * /comments/create:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *       - Comments
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
router.post("/create", isAuth, createComment);

/**
 * @swagger
 * /comments/edit:
 *   put:
 *     summary: Edit an existing comment
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - content
 *               - taskId
 *               - userId
 *             properties:
 *               _id:
 *                 type: string
 *               content:
 *                 type: string
 *               taskId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment updated successfully
 *       404:
 *         description: User or comment not found
 *       500:
 *         description: Server error
 */
router.put("/edit", isAuth, editComment);

/**
 * @swagger
 * /comments/delete:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", isAuth, deleteComment);

export default router;
