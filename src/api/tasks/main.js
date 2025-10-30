import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import db from "./dbmanager.js";

// Importa os routers das diferentes funcionalidades
import authenticationRouter from "./Routes/auth.js";
import dashboardRouter from "./Routes/dashboard.js";
import documentationRouter from "./Routes/docs.js";
import managementRouter from "./Routes/management.js";
import settingsRouter from "./Routes/settings.js";
import spaceRouter from "./Routes/space.js";
import tasksRouter from "./Routes/task.js";
import usersRouter from "./Routes/users.js";

// Carrega variáveis de ambiente do arquivo especificado
dotenv.config();

// Cria uma aplicação Express
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define as rotas da aplicação
app.use("/auth", authenticationRouter);
app.use("/dashboard", dashboardRouter);
app.use("/docs", documentationRouter);
app.use("/management", managementRouter);
app.use("/setting", settingsRouter);
app.use("/space", spaceRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);

// Create database tables if not exists
await db.createTables();

//For External Access
app.listen(Number(process.env.API_PORT), "0.0.0.0", () => {
  console.log(`Listening on port ${process.env.API_PORT}`);
});