import dotenv from "dotenv";
dotenv.config("./.env");
import express from "express";
import http from "http";
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
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/docs", documentationRouter);

// Inicia o servidor HTTP
const PORT = process.env.DOCS_API_PORT || 5176;

http.createServer(app).listen(PORT, () => {
  console.log(`Documents Service running on http://localhost:${PORT}`);
});
