// Importa a função express
import express from "express";

// Importa os controladores para visualizar informações do usuário e tarefas
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/usersController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um router usando o express Router
const router = express.Router();

//Just for initial tests
router.get("/", isAuth, getUsers);

// Define as rotas baseadas em 'http://localhost:5173'
// Rota para obter informações do usuário
router.post("/create", isAuth, createUser);
// Rota para atualizar informações do usuário
router.put("/update", isAuth, updateUser);

// Rota para obter tarefas do usuário
router.delete("/delete", isAuth, deleteUser);

// Exporta o router para ser utilizado no ficheiro principal
export default router;
