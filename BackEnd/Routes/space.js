// Importa a função express
import express from "express";
// Importa os controladores das operações relacionadas ao espaço e kanban
import {
  initialTesting,
  getSpace,
  addKanban,
  addSpace,
  editKanban,
  editSpace,
  getKanban,
  getList,
  updateKanban,
  updateSpace,
} from "../Controllers/spaceController.js";

// Cria um novo router usando o express
const router = express.Router();

//Just for initial tests
router.get("/", initialTesting); // Obtém informações do espaço

// Define as rotas relacionadas ao espaço
router.get("/space", getSpace); // Obtém informações do espaço
router.get("/list", getList); // Obtém uma lista de espaços
router.post("/add", addSpace); // Adiciona um novo espaço
router.put("/edit", editSpace); // Edita um espaço existente
router.delete("/update", updateSpace); // Remove ou atualiza um espaço

// Define as rotas relacionadas ao kanban
router.get("/kanban", getKanban); // Obtém informações do kanban
router.post("/add", addKanban); // Adiciona um novo kanban
router.put("/edit", editKanban); // Edita um kanban existente
router.delete("/update", updateKanban); // Remove ou atualiza um kanban

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
