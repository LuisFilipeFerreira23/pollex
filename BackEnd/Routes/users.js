// Importa a função express
import express from "express";

// Importa os controladores para visualizar informações do usuário e tarefas
import {
  initialTesting,
  viewUserInfo,
  viewUserTasks,
} from "../Controllers/usersController.js";

// Cria um router usando o express Router
const router = express.Router();

//Just for initial tests
router.get("/", initialTesting);

// Define as rotas baseadas em 'http://localhost:5173'
// Rota para obter informações do usuário
router.get("/user", viewUserInfo);

// Rota para obter tarefas do usuário
router.get("/tasks", viewUserTasks);

// Exporta o router para ser utilizado no ficheiro principal
export default router;
