// Importa a função express
import express from "express";

// Importa os controladores das configurações
import {
  getSettings,
  deleteSettings,
  editSettings,
} from "../controllers/settingsController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um router usando o express Router
const router = express.Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get user settings
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: Get settings route is working
 */
// Define as rotas CRUD para configurações
// GET: Obtém as configurações
router.get("/", isAuth, getSettings);

/**
 * @swagger
 * /settings/edit:
 *   put:
 *     summary: Edit user settings
 *     tags:
 *       - Settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               notifications:
 *                 type: boolean
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Edit settings route is working!
 */
// PUT: Edita as configurações
router.put("/edit", isAuth, editSettings);

/**
 * @swagger
 * /settings/delete:
 *   delete:
 *     summary: Delete user settings
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: Delete settings route is working!
 */
// DELETE: Remove as configurações
router.delete("/delete", isAuth, deleteSettings);

// Exporta o router para ser usado no ficheiro principal
export default router;
