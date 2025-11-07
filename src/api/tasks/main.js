import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import db from "./dbmanager.js";

// Importa os routers das diferentes funcionalidades
import authenticationRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import documentationRouter from "./routes/docs.js";
import managementRouter from "./routes/management.js";
import settingsRouter from "./routes/settings.js";
import spaceRouter from "./routes/space.js";
import tasksRouter from "./routes/task.js";
import usersRouter from "./routes/users.js";

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

// Inicia a aplicação após garantir a conexão com o banco de dados
await db.authenticationCheck();
await db.createDatabase();
await db.syncModels();

//For External Access
app.listen(Number(process.env.API_PORT), "0.0.0.0", () => {
  console.log(`Listening on port ${process.env.API_PORT}`);
});
