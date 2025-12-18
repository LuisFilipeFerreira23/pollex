import dotenv from "dotenv";
dotenv.config("./.env");
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import spaceRouter from "./routes/space.js";
import tasksRouter from "./routes/task.js";
import { specs, swaggerUiExpress } from "./swagger.js";

// EXPRESS APP & MIDDLEWARE SETUP
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ROUTE HANDLING
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/spaces", spaceRouter);
app.use("/tasks", tasksRouter);

// Inicia o servidor HTTP
const PORT = process.env.TASKS_API_PORT || 5173;

http.createServer(app).listen(PORT, () => {
  console.log(`Task Service running on http://localhost:${PORT}`);
});
