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

// Cria um novo router usando o express
const router = express.Router();

// Rota para obter todas as tarefas
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/create", addTask);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

// Exporta o router para ser usado no arquivo principal
export default router;
