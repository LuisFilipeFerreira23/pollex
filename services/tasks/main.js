import dotenv from "dotenv";
dotenv.config("./.env");
import http from "http";
import app from "./app.js";
// Inicia o servidor HTTP
const PORT = process.env.TASKS_API_PORT || 5173;

http.createServer(app).listen(PORT, () => {
  console.log(`Task Service running on http://localhost:${PORT}`);
});
