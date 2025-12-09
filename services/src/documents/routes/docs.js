// Importa a função express do pacote express
import express from "express";
import upload from "../middleware/upload.js";

// Importa as funções getDocs e deleteDocs do controller de documentos
import {
  getDocs,
  createDoc,
  downloadDoc,
  deleteDocs,
} from "../controllers/docsController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria uma instância do router do express
const router = express.Router();

/**
 * @swagger
 * /docs:
 *   get:
 *     summary: Get all documents
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       500:
 *         description: Server error
 */
// Define a rota GET para obter documentos
router.get("/", isAuth, getDocs);

/**
 * @swagger
 * /docs/create:
 *   post:
 *     summary: Upload a document
 *     tags:
 *       - Documents
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-ata:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - userId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or missing userId
 *       500:
 *         description: Server error
 */
// Define a rota fazer upload de um para ficheiro
router.post("/create", isAuth, upload.single("file"), createDoc);

/**
 * @swagger
 * /docs/download:
 *   post:
 *     summary: Download a document
 *     tags:
 *       - Documents
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
 *                 description: The document ID
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
// Define a rota fazer download de um ficheiro
router.post("/download", isAuth, downloadDoc);

/**
 * @swagger
 * /docs/delete/{userId}:
 *   delete:
 *     summary: Delete a document
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
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
 *                 description: The document ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       403:
 *         description: Unauthorized - document doesn't belong to user
 *       404:
 *         description: User or document not found
 *       500:
 *         description: Server error
 */
// Define a rota DELETE para apagar documentos
router.delete("/delete/:userId", isAuth, deleteDocs);

// Exporta o router para ser utilizado no ficheiro principal da aplicação
export default router;
