// Importa a função express
import express from "express";

// Importa os controladores das configurações
import {
  getSettings,
  deleteSettings,
  editSettings,
} from "../controllers/settingsController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um router usando o express Router
const router = express.Router();

// Define as rotas CRUD para configurações
// GET: Obtém as configurações
router.get("/", isAuth, getSettings);

// PUT: Edita as configurações
router.put("/edit", isAuth, editSettings);

// DELETE: Remove as configurações
router.delete("/delete", isAuth, deleteSettings);

// Exporta o router para ser usado no ficheiro principal
export default router;
