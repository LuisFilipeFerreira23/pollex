import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import db from "./util/dbmanager.js";
import session from "express-session";
import csurf from "csurf";
import cookieParser from "cookie-parser";

// Importa os routers das diferentes funcionalidades
import authenticationRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import documentationRouter from "./routes/docs.js";
import managementRouter from "./routes/management.js";
import settingsRouter from "./routes/settings.js";
import spaceRouter from "./routes/space.js";
import tasksRouter from "./routes/task.js";
import usersRouter from "./routes/users.js";
import { connectMongoDB } from "./util/mongodb.js";

// Carrega variáveis de ambiente do arquivo especificado
dotenv.config();

// Cria uma aplicação Express
const app = express();

app.use(cookieParser());

// Configura a sessão do usuário(Não está completo, apenas um esqueleto)
app.use(
  session({
    secret: process.env.SESSION_KEY || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: "strict",
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // CSRF cookie can't be accessed via JavaScript
    sameSite: "strict",
  },
});

const dbURI = process.env.MONGODB_URL;

// Sincroniza o banco de dados
await db.authenticationCheck();
await db.syncModels();
//await connectMongoDB();

// Define as rotas da aplicação
app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});
app.use("/auth", authenticationRouter);
app.use("/dashboard", dashboardRouter);
app.use("/docs", documentationRouter);
app.use("/management", managementRouter);
app.use("/setting", settingsRouter);
app.use("/spaces", spaceRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);

//For External Access
app.listen(Number(process.env.API_PORT), "0.0.0.0", () => {
  console.log(`Listening on port ${process.env.API_PORT}`);
});
