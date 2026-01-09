// Importa a função express
import express from "express";

// Importa os controladores das operações relacionadas ao espaço e kanban
import {
  getSpaces,
  getSpaceById,
  addSpace,
  updateSpace,
  getList,
  deleteSpace,
  getKanban,
  addKanban,
  editKanban,
  updateKanban,
} from "../controllers/spaceController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um novo router usando o express
const router = express.Router();

/**
 * @swagger
 * /spaces/space:
 *   get:
 *     summary: Get all spaces
 *     tags:
 *       - Spaces
 *     responses:
 *       200:
 *         description: List of spaces retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", isAuth, getSpaces);

/**
 * @swagger
 * /spaces/list:
 *   get:
 *     summary: Get list of spaces
 *     tags:
 *       - Spaces
 *     responses:
 *       200:
 *         description: getList not implemented yet
 *       500:
 *         description: Server error
 */
router.get("/list", isAuth, getList);

/**
 * @swagger
 * /spaces/add:
 *   post:
 *     summary: Create a new space
 *     tags:
 *       - Spaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - creatorId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               creatorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Space created successfully
 *       500:
 *         description: Server error
 */
router.post("/add", isAuth, addSpace);

/**
 * @swagger
 * /spaces/{id}:
 *   get:
 *     summary: Get space by ID
 *     tags:
 *       - Spaces
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The space ID
 *     responses:
 *       200:
 *         description: Space retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/:id", isAuth, getSpaceById);

/**
 * @swagger
 * /spaces/update:
 *   put:
 *     summary: Update a space
 *     tags:
 *       - Spaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - title
 *               - description
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Space updated successfully
 *       404:
 *         description: Space not found
 *       500:
 *         description: Server error
 */
router.put("/update/:id", isAuth, updateSpace);

/**
 * @swagger
 * /spaces/delete:
 *   delete:
 *     summary: Delete a space
 *     tags:
 *       - Spaces
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
 *         description: Space deleted successfully
 *       404:
 *         description: Space not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", isAuth, deleteSpace);

/**
 * @swagger
 * /spaces/kanban:
 *   get:
 *     summary: Get kanban information
 *     tags:
 *       - Kanban
 *     responses:
 *       200:
 *         description: Kanban information retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/kanban", isAuth, getKanban);

/**
 * @swagger
 * /spaces/kanban/add:
 *   post:
 *     summary: Add a new kanban
 *     tags:
 *       - Kanban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               spaceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kanban created successfully
 *       500:
 *         description: Server error
 */
router.post("/kanban/add", isAuth, addKanban);

/**
 * @swagger
 * /spaces/kanban/edit:
 *   put:
 *     summary: Edit an existing kanban
 *     tags:
 *       - Kanban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kanban updated successfully
 *       500:
 *         description: Server error
 */
router.put("/kanban/edit", isAuth, editKanban);

/**
 * @swagger
 * /spaces/kanban/update:
 *   delete:
 *     summary: Update or delete a kanban
 *     tags:
 *       - Kanban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kanban operation completed successfully
 *       500:
 *         description: Server error
 */
router.delete("/kanban/update", isAuth, updateKanban);

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
