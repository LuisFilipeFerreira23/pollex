// Importa a função express do pacote express
import express from "express";

// Importa as funções getDocs e deleteDocs do controller de documentos
import { getDocs, deleteDocs } from "../Controllers/docsController.js";

// Cria uma instância do router do express
const router = express.Router();

// Define a rota GET para obter documentos
router.get("/", getDocs);

// Define a rota DELETE para apagar documentos
router.delete("/delete", deleteDocs);

// Exporta o router para ser utilizado no ficheiro principal da aplicação
export default router;
