import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import db from "./util/dbmanager.js";
import { connectMongoDB } from "./util/mongodb.js";

import http from "http";

// Importa os routers das diferentes funcionalidades
import { specs, swaggerUiExpress } from "../swagger.js";

// Carrega variáveis de ambiente do arquivo especificado
dotenv.config("./.env");

// Cria uma aplicação Express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Sincroniza o banco de dados
await db.authenticationCheck();
await db.syncModels();
//await connectMongoDB();

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/comments", commentsRouter);
app.use("/notifications", notificationsRouter);

// Inicia o servidor HTTP
const PORT = process.env.ACTIVITY_API_PORT || 5175;

http.createServer(app).listen(PORT, () => {
  console.log(`Activity Service running on http://localhost:${PORT}`);
});
