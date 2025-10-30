// Importa o módulo express
import express from "express";

// Importa as funções de controle de autenticação
import {
  initialTesting,
  login,
  register,
  passwordRecovery,
} from "../Controllers/authController.js";

// Cria um novo router usando o express
const router = express.Router();

router.get("/", initialTesting);

// Define as rotas de autenticação
// Rota para login
router.post("/login", login);

// Rota para registro de novo usuário
router.post("/register", register);

// Rota para recuperação de senha
router.post("/passRec", passwordRecovery);

// Exporta o router para ser usado no arquivo principal da aplicação
export default router;
