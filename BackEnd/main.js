/* 
Como executar:
  -'npm start' no terminal;
*/

import bodyParser from "body-parser";

// Importa o framework Express para criar o servidor web
import express from "express";

// Importa função para conectar ao MongoDB
import { mongoConnect } from "./util/Mongodb.js";

// Importa o cliente do PostgreSQL
import { Client } from "pg";

// Importa dotenv para variáveis de ambiente
import dotenv from "dotenv";

// Importa os routers das diferentes funcionalidades
import authenticationRouter from "./Routes/auth.js";
import dashboardRouter from "./Routes/dashboard.js";
import documentationRouter from "./Routes/docs.js";
import managementRouter from "./Routes/management.js";
import settingsRouter from "./Routes/settings.js";
import spaceRouter from "./Routes/space.js";
import tasksRouter from "./Routes/task.js";
import usersRouter from "./Routes/users.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente do arquivo especificado
dotenv.config({
  override: true,
  path: "./util/development.env", //Alterar o ficheiro para 2 se for para testes locais
});

// Cria uma aplicação Express
const app = express();

// Middleware para fazer parse de JSON nas requisições
app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Define as rotas da aplicação
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});
app.use("/auth", authenticationRouter); // Login, Registro, Recuperação de senha
app.use("/dashboard", dashboardRouter); // Dashboard principal
app.use("/docs", documentationRouter); // Documentação (Admin + User)
app.use("/management", managementRouter); // Gerenciamento (apenas Admin)
app.use("/setting", settingsRouter); // Configurações (User + Admin)
app.use("/space", spaceRouter); // Espaços (Admin CRUD, User visualização)
app.use("/tasks", tasksRouter); // Tarefas (User + Admin)
app.use("/users", usersRouter); // Usuários (editar perfil, ver tarefas)

// Configura o cliente do PostgreSQL usando variáveis de ambiente
export const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: String(process.env.PASSWORD),
  port: Number(process.env.PORT),
});

// Conecta ao banco PostgreSQL, faz uma consulta de teste e encerra a conexão
const pgClient = await client.connect();
if (pgClient) {
  console.log("Conexão com o PostgreSQL estabelecida com sucesso!");
} else {
  console.error("Falha ao conectar ao PostgreSQL.");
}
//await client.end();
//For Localhost
/* 
app.listen(5173, () => {
  console.log("SOUND TEST!");
});
*/

//For External Access
app.listen(5173, "0.0.0.0", () => {
  console.log("SOUND TEST! Listening on port 5173");
});

// Conecta ao MongoDB e inicia o servidor Express na porta 5173
mongoConnect(() => {
  console.log("Conexão com o MongoDB estabelecida com sucesso!");
});
