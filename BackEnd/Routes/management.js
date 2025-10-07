// Importa a função express do pacote express
import express from "express";

// Importa a função getManagement do controller correspondente
import { getManagement } from "../Controllers/managementController.js";

// Cria um novo router usando o express.Router
const router = express.Router();

// Define uma rota GET na raiz ('/') que chama a função getManagement
// Todos os paths definidos aqui terão como base 'http://localhost:5173'
router.get("/", getManagement);

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
