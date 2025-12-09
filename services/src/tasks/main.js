import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import https from "https";
import fs from "fs";
import db from "./database/dbmanager.js";

// Importa os routers das diferentes funcionalidades
import spaceRouter from "./routes/space.js";
import tasksRouter from "./routes/task.js";

dotenv.config("./.env");

// Cria uma aplicação Express
const app = express();

// Sincroniza o banco de dados
await db.authenticationCheck();
await db.syncModels();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/spaces", spaceRouter);
app.use("/tasks", tasksRouter);

//For External Access
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

https
  .createServer(httpsOptions, app)
  .listen(Number(process.env.TASKS_API_PORT), "0.0.0.0", () => {
    console.log(`Listening on port 5173`);
  });
