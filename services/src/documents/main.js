import dotenv from "dotenv";
dotenv.config("./.env");
import express from "express";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import documentationRouter from "./routes/docs.js";
import { specs, swaggerUiExpress } from "./swagger.js";

// 1. IMPORT YOUR DATABASE MANAGER
import db from "./database/dbmanager.js";
import mongodb from "mongodb";
import mongoose from "mongoose";

await db.connectMongoDB();
export const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
  bucketName: "myCustomBucket",
});

// EXPRESS APP & MIDDLEWARE SETUP
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ROUTE HANDLING
app.use("/docs", documentationRouter);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// SERVER STARTUP & SSL CONFIG
const PORT = Number(process.env.DOCS_API_PORT);

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, "utf8"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, "utf8"),
};

https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
  console.log(`HTTPS Server listening on port ${PORT}`);
});
