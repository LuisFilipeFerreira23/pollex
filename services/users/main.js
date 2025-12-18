import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import authenticationRouter from "./routes/auth.js";
import rolesRouter from "./routes/roles.js";
import settingsRouter from "./routes/settings.js";
import usersRouter from "./routes/users.js";
import { specs, swaggerUiExpress } from "./swagger.js";

dotenv.config("./.env");

// EXPRESS APP & MIDDLEWARE SETUP
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// ROUTE HANDLING
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/auth", authenticationRouter);
app.use("/roles", rolesRouter);
app.use("/setting", settingsRouter);
app.use("/users", usersRouter); //For admin

/* 
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
*/

// Inicia o servidor HTTP
const PORT = process.env.USERS_API_PORT || 5174;

http.createServer(app).listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});
