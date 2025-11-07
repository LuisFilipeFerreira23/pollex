// Importa a função express
import express from "express";
// Importa os controladores das tarefas
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

// Cria um novo router usando o express
const router = express.Router();

// Define as rotas CRUD para tarefas

// Rota para obter todas as tarefas
router.get("/", getTasks);

// Rota para criar uma nova tarefa
router.post("/create/", addTask);

// Rota para atualizar uma tarefa existente
router.put("/update/:id", updateTask);

// Rota para deletar uma tarefa
router.delete("/delete/:id", deleteTask);

// Exporta o router para ser usado no arquivo principal
export default router;
