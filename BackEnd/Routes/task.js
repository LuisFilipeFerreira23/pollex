//We import the express function
import express from "express";

//Importamos o controller a ser usado seguindo o exemplo em baixo
//import { getAllDB } from "../controllers/dbController.js";

//We declare a router using express router
const router = express.Router();

//We setup a GET route, with a address of 'http://localhost:3000/db/ which executes the getAllDB function
//Fazer uma destes para cada operação crud
router.get("/", getAllDB);
router.post();
router.put();
router.delete();

//Exportamos o router para o apanharmos no ficheiro principal
export default router;
