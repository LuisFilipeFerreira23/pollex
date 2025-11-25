// Importa a função express do pacote 'express'
import express from "express";

// Importa a função getDashboard do controller correspondente
import {
  getDashboard,
  deleteDashboard,
} from "../controllers/dashboardController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria uma instância do router usando express.Router()
const router = express.Router();

// Define uma rota GET para o path raiz ("/")
// Quando essa rota é acessada, executa a função getDashboard
router.get("/", isAuth, getDashboard);

router.delete("/delete", isAuth, deleteDashboard);

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
