import bodyParser from "body-parser";
import express from "express";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import db from "./util/dbmanager.js";
import session from "express-session";
import csurf from "csurf";
import cookieParser from "cookie-parser";

// Importa os routers das diferentes funcionalidades
import authenticationRouter from "./users/route/auth.js";
import documentationRouter from "./routes/docs.js";
import rolesRouter from "./routes/roles.js";
import settingsRouter from "./routes/settings.js";
import spaceRouter from "./tasks/routes/space.js";
import tasksRouter from "./tasks/routes/task.js";
import usersRouter from "./users/route/users.js";
import { connectMongoDB } from "./util/mongodb.js";
import { specs, swaggerUiExpress } from "./public/swagger/swagger.js";

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

// Sincroniza o banco de dados
await db.authenticationCheck();
await db.syncModels();
//await connectMongoDB();

// Define as rotas da aplicação
/* 
app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});
*/
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/auth", authenticationRouter);
app.use("/docs", documentationRouter);
app.use("/roles", rolesRouter);
app.use("/setting", settingsRouter);
app.use("/spaces", spaceRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter); //For admin

//For External Access
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

https
  .createServer(httpsOptions, app)
  .listen(Number(process.env.API_PORT), "0.0.0.0", () => {
    console.log(`Listening on port ${process.env.API_PORT}`);
  });
