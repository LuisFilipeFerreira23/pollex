import express from "express";
import https from "https";
import fs from "fs";
import db from "./database/dbmanager.js";

// Importa os routers das diferentes funcionalidades
import spaceRouter from "./routes/space.js";
import tasksRouter from "./routes/task.js";

// Cria uma aplicação Express
const app = express();

// Sincroniza o banco de dados
await db.authenticationCheck();
await db.syncModels();

app.use("/spaces", spaceRouter);
app.use("/tasks", tasksRouter);

//For External Access
const httpsOptions = {
  key: fs.readFileSync("./middleware/certs/server.key"),
  cert: fs.readFileSync("./middleware/certs/server.crt"),
};

https.createServer(httpsOptions, app).listen(Number(5173), "0.0.0.0", () => {
  console.log(`Listening on port 5173`);
});
