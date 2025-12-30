//NPM MODULES
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import express from "express";
import session from "express-session";
import csurf from "csurf";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//IMPORT ROUTES
import activityRoutes from "./routes/activity.js";
import usersRoutes from "./routes/users.js";
import tasksRoutes from "./routes/tasks.js";
import documentsRoutes from "./routes/documents.js";

//LOAD ENV VARIABLES
dotenv.config("./.env");

//EXPRESS APP SETUP
const app = express();

app.use(cookieParser());

const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // CSRF cookie can't be accessed via JavaScript
    sameSite: "strict",
  },
});

/* 
  WHAT NEEDS TO BE ADDED:
  - AUTHENTICATION;
  - SESSION HANDLING;
  - RATE LIMITING;
  - HTTPS: 
    - HELMET;
    - CORS;
    - ETC.
*/

// Configura a sessão do usuário(Não está completo, apenas um esqueleto)
app.use(
  session({
    secret: process.env.SESSION_KEY || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
      sameSite: "strict",
    },
  })
);

// Define as rotas da aplicação
/* 
app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});
*/

// ROUTE HANDLING
app.use("/api/activity", activityRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/documents", documentsRoutes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const httpsOptions = {
  key: fs.readFileSync("./middleware/certs/server.key"),
  cert: fs.readFileSync("./middleware/certs/server.crt"),
};

https.createServer(httpsOptions, app).listen(443, () => {
  console.log("Secure API Gateway running on https://localhost:443");
});
