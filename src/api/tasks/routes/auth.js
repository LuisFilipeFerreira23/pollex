// Importa o módulo express
import express from "express";
import { isAuth } from "../middleware/is-Auth.js";

// Importa as funções de controle de autenticação
import {
  initialTesting,
  login,
  register,
  passwordRecovery,
} from "../controllers/authController.js";

//Importar o middleware de autenticação
import { check, validationResult } from "express-validator";

// Cria um novo router usando o express
const router = express.Router();

router.get("/", initialTesting);

// Define as rotas de autenticação
// Rota para login
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("password", "Password is required").isLength({ min: 6 }).trim(),
  ],

  login
);

// Rota para registro de novo usuário
router.post(
  "/register",
  [
    check("email", "Please enter a valid email").isEmail().normalizeEmail(),
    check("password", "Password is required").isLength({ min: 6 }).trim(),
  ],
  register
);

// Rota para recuperação de senha
router.post("/passRec", passwordRecovery);

// Exporta o router para ser usado no arquivo principal da aplicação
export default router;
