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

// Rota para obter todas as tarefas
router.get("/", isAuth, getTasks);

// Rota para obter uma tarefa por ID
router.get("/:id", isAuth, getTaskById);

// Rota para criar uma nova tarefa
router.post("/create/", isAuth, addTask);

// Rota para atualizar uma tarefa existente
router.put("/update/:id", isAuth, updateTask);

// Rota para deletar uma tarefa
router.delete("/delete/:id", isAuth, deleteTask);

// Exporta o router para ser usado no arquivo principal
export default router;
