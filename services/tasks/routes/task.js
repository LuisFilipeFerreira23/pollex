// Importa a função express
import express from "express";
// Importa os controladores das tarefas
import {
  addTask,
  getTaskById,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um novo router usando o express
const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *       500:
 *         description: Server error
 */
// Rota para obter todas as tarefas
router.get("/", isAuth, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       500:
 *         description: Server error
 */
// Rota para obter uma tarefa por ID
router.get("/:id", isAuth, getTaskById);

/**
 * @swagger
 * /tasks/create:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task created successfully
 *       500:
 *         description: Server error
 */
// Rota para criar uma nova tarefa
router.post("/create/", isAuth, addTask);

/**
 * @swagger
 * /tasks/update/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
// Rota para atualizar uma tarefa existente
router.put("/update/:id", isAuth, updateTask);

/**
 * @swagger
 * /tasks/delete/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
// Rota para deletar uma tarefa
router.delete("/delete/:id", isAuth, deleteTask);

// Exporta o router para ser usado no arquivo principal
export default router;
