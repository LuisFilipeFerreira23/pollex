import dotenv from "dotenv";
dotenv.config("./.env");
import mongoose from "mongoose";
import { documentSchema } from "../models/document.js";

//Connection URL
async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose successfully connected to MongoDB.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

//Models
const Document = mongoose.model("Document", documentSchema);

//Exports
export default {
  connectMongoDB,
  Document,
};
