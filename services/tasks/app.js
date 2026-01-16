import express from "express";
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

export default app;
