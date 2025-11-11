// Importa a função express
import express from "express";
// Importa os controladores das operações relacionadas ao espaço e kanban
import {
  getSpaces,
  getSpaceById,
  addSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController.js";

// Cria um novo router usando o express
const router = express.Router();

// Define as rotas relacionadas ao espaço
router.get("/", getSpaces);
router.get("/:id", getSpaceById);
router.post("/create", addSpace);
router.put("/update/:id", updateSpace);
router.delete("/delete/:id", deleteSpace);

// Exporta o router para ser utilizado no arquivo principal da aplicação
export default router;
