// Importa a função express
import express from "express";

// Importa os controladores das operações relacionadas ao espaço e kanban
import {
  getSpace,
  addKanban,
  addSpace,
  editKanban,
  editSpace,
  getKanban,
  getList,
  updateKanban,
  updateSpace,
} from "../controllers/spaceController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria um novo router usando o express
const router = express.Router();

// Define as rotas relacionadas ao espaço
router.get("/space", isAuth, getSpace); // Obtém informações do espaço
router.get("/list", isAuth, getList); // Obtém uma lista de espaços
router.post("/add", isAuth, addSpace); // Adiciona um novo espaço
router.put("/edit", isAuth, editSpace); // Edita um espaço existente
router.delete("/update", isAuth, updateSpace); // Remove ou atualiza um espaço

// Define as rotas relacionadas ao kanban
router.get("/kanban", isAuth, getKanban); // Obtém informações do kanban
router.post("/add", isAuth, addKanban); // Adiciona um novo kanban
router.put("/edit", isAuth, editKanban); // Edita um kanban existente
router.delete("/update", isAuth, updateKanban); // Remove ou atualiza um kanban

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
