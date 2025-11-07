// Importa a função express
import express from "express";

// Importa os controladores das configurações
import {
  getSettings,
  deleteSettings,
  editSettings,
} from "../controllers/settingsController.js";

// Cria um router usando o express Router
const router = express.Router();

// Define as rotas CRUD para configurações
// GET: Obtém as configurações
router.get("/", getSettings);

// PUT: Edita as configurações
router.put("/edit", editSettings);

// DELETE: Remove as configurações
router.delete("/delete", deleteSettings);

// Exporta o router para ser usado no ficheiro principal
export default router;
