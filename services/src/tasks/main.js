import dotenv from "dotenv";
dotenv.config("./.env");
import express from "express";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import spaceRouter from "./routes/space.js";
import tasksRouter from "./routes/task.js";

// EXPRESS APP & MIDDLEWARE SETUP
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ROUTE HANDLING
app.use("/spaces", spaceRouter);
app.use("/tasks", tasksRouter);

// SERVER STARTUP & SSL CONFIG
const PORT = Number(process.env.TASKS_API_PORT) || 5173;

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, "utf8"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, "utf8"),
};

https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
  console.log(`HTTPS Server listening on port ${PORT}`);
});
