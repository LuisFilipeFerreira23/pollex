// MongoDB Utility Functions
import mongoose from "mongoose";

// MongoDB Connection
const dbURI = process.env.MONGODB_URL;

// Exporting function to connect to MongoDB
export async function connectMongoDB() {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log("Error connecting to MongoDb:", error);
  }
}
