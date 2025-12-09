import dotenv from "dotenv";
dotenv.config("./.env");
import mongodb from "mongodb";
import { bucket } from "../main.js";

// ===================================
// 1. GET ALL DOCUMENTS (Metadata)
// ===================================

export async function getDocs(req, res) {
  try {
    // Use projection to limit the fields returned, improving performance
    const cursor = bucket.find(
      {},
      {
        projection: {
          _id: 1,
          filename: 1,
          metadata: 1,
          contentType: 1,
          length: 1,
        },
      }
    );

    const docs = await cursor.toArray();

    return res
      .status(200)
      .json({ message: "Documents retrieved successfully", docs });
  } catch (error) {
    // Log the error for internal diagnostics
    console.error("Error retrieving documents:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// ===================================
// 2. CREATE DOCUMENT (Upload)
// ===================================

export async function createDoc(req, res) {
  const { file } = req;
  const { userId } = req.body;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  // Ensure the MongoDB client is connected if not handled globally
  // await client.connect();

  try {
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: { userId }, // Store user ID as metadata
    });

    // --- PROMISE-BASED STREAM HANDLING FOR CLEANER ASYNC ---
    // Wrap the stream in a Promise to use async/await
    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(file.buffer);
    });

    // Response is sent only after the file is successfully streamed to GridFS
    return res.status(201).json({
      message: "File uploaded successfully",
      fileId: uploadStream.id,
      metadata: { userId },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      message: "Internal server error during upload",
      error: error.message,
    });
  }
}

// ===================================
// 3. DOWNLOAD DOCUMENT (Stream)
// ===================================

export async function downloadDoc(req, res) {
  try {
    // Use req.params for the ID as is standard for retrieval endpoints (e.g., /docs/:id)
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Document ID is required." });
    }

    const objectId = new mongodb.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(objectId);

    // 1. Set the correct headers based on the file in GridFS (if necessary)
    // You can use bucket.find({_id: objectId}) to get the file metadata first.
    // For simplicity, we pipe directly, relying on the 'openDownloadStream' to handle the file.

    // 2. Pipe the binary data to the response
    downloadStream.pipe(res);

    // 3. CRITICAL: Handle stream errors/not found *before* piping
    downloadStream.on("error", (err) => {
      // Check if the error is due to "File not found" (common GridFS error)
      if (err.code === "ENOENT") {
        return res
          .status(404)
          .json({ message: "File not found.", error: err.message });
      }
      // For other errors, send a 500
      return res
        .status(500)
        .json({ message: "Stream error during download.", error: err.message });
    });

    // 4. Note: DO NOT send a JSON response after piping. The file data is the response.
  } catch (error) {
    // This catch block handles errors related to invalid ObjectId format
    console.error("Error initiating download:", error);
    return res.status(500).json({
      message: "Error initiating download stream.",
      error: error.message,
    });
  }
}

// ===================================
// 4. DELETE DOCUMENT (Requires Auth Check)
// ===================================

export async function deleteDocs(req, res) {
  try {
    const { id } = req.params; // Use params for the document ID as well
    const { userId } = req.params; // Assuming user ID is also in params

    // 1. Validate User Existence (using Sequelize/Mongoose User model)
    const user = await User.findByPk(userId); // Assuming findByPk for ID lookup

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    // 2. Validate Document Existence and Ownership
    const objectId = new mongodb.ObjectId(id);

    const docDetails = await bucket.find({ _id: objectId }).toArray();

    if (!docDetails || docDetails.length === 0) {
      return res.status(404).json({ message: "Document not found!" });
    }

    // 3. Ownership Check (Ensuring the user owns the file)
    const documentMetadata = docDetails[0].metadata;

    // Check if the userId in the route matches the userId in the file metadata
    if (documentMetadata?.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized! This document doesn't belong to you.",
      });
    }

    // 4. Delete the Document
    await bucket.delete(objectId);

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({
      message: "Internal server error during deletion",
      error: error.message,
    });
  }
}
