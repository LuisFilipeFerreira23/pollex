import dotenv from "dotenv";
dotenv.config("./.env");
import express from "express";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
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

app.use("/auth", authenticationRouter);
app.use("/roles", rolesRouter);
app.use("/setting", settingsRouter);
app.use("/users", usersRouter); //For admin
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Configura a sessão do usuário(Não está completo, apenas um esqueleto)
app.use(
  session({
    secret: process.env.SESSION_KEY,
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

// SERVER STARTUP & SSL CONFIG
const PORT = Number(process.env.USERS_API_PORT) || 5174;

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, "utf8"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, "utf8"),
};

https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
  console.log(`HTTPS Server listening on port ${PORT}`);
});
