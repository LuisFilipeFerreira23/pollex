//We import the express function
import express from "express";

//Declaramos um router usando o express Router
const router = express.Router();

//Todos os paths aqui me baixo têm este path como base 'http://localhost:5173
//Fazer uma destes para cada operação crud
router.get("/", getAllDB);
router.post();
router.put();
router.delete();

//Exportamos o router para o apanharmos no ficheiro principal
export default router;
