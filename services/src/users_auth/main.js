import bodyParser from "body-parser";
import express from "express";
import https from "https";
import fs from "fs";
import db from "./database/dbmanager.js";
import session from "express-session";
import csurf from "csurf";
import cookieParser from "cookie-parser";

// Importa os routers das diferentes funcionalidades
import authenticationRouter from "./routes/auth.js";
import rolesRouter from "./routes/roles.js";
import settingsRouter from "./routes/settings.js";
import usersRouter from "./routes/users.js";
import { specs, swaggerUiExpress } from "./swagger.js";

// Cria uma aplicação Express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/auth", authenticationRouter);
app.use("/roles", rolesRouter);
app.use("/setting", settingsRouter);
app.use("/users", usersRouter); //For admin

// Sincroniza o banco de dados
await db.authenticationCheck();
await db.syncModels();
//await connectMongoDB();

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

/* const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // CSRF cookie can't be accessed via JavaScript
    sameSite: "strict",
  },
});

app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});
 */

//For External Access
const httpsOptions = {
  key: fs.readFileSync("./middleware/certs/server.key"),
  cert: fs.readFileSync("./middleware/certs/server.crt"),
};

https.createServer(httpsOptions, app).listen(Number(7001), "0.0.0.0", () => {
  console.log(`Listening on port 7001`);
});
