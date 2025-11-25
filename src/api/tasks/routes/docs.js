// Importa a função express do pacote express
import express from "express";
import upload from "../middleware/upload.js";

// Importa as funções getDocs e deleteDocs do controller de documentos
import {
  getDocs,
  createDoc,
  downloadDoc,
  deleteDocs,
} from "../controllers/docsController.js";
import { isAuth } from "../middleware/is-Auth.js";

// Cria uma instância do router do express
const router = express.Router();

// Define a rota GET para obter documentos
router.get("/", isAuth, getDocs);

// Define a rota fazer upload de um para ficheiro
router.post("/create", isAuth, upload.single("file"), createDoc);

// Define a rota fazer download de um ficheiro
router.post("/download", isAuth, downloadDoc);

// Define a rota DELETE para apagar documentos
router.delete("/delete", isAuth, deleteDocs);

// Exporta o router para ser utilizado no ficheiro principal da aplicação
export default router;
