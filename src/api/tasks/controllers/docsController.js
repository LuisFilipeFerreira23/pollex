import db from "../util/dbmanager.js";
const { User } = db;

import mongodb from "mongodb";
const client = new mongodb.MongoClient(process.env.MONGODB_URL);
const dbName = process.env.MONGODB_DB_NAME;
const mongoDB = client.db(dbName);

const bucket = new mongodb.GridFSBucket(mongoDB, {
  bucketName: "myCustomBucket",
});

export async function getDocs(req, res, next) {
  try {
    const cursor = await bucket.find({}).toArray();
    const docs = [];
    for (const doc of cursor) {
      docs.push(doc);
    }
    return res.status(200).json({ docs });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function createDoc(req, res, next) {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    // Create writable stream to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { userId },
    });

    // Write buffer to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      return res.status(200).json({
        message: "File uploaded successfully",
        fileId: uploadStream.id,
        metadata: {
          userId,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function downloadDoc(req, res, next) {
  try {
    const { id } = req.body;

    // Create writable stream to GridFS
    const downloadStream = bucket.openDownloadStream(new mongodb.ObjectId(id));

    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      return res
        .status(404)
        .json({ message: "File not found", error: err.message });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function deleteDocs(req, res, next) {
  try {
    const { id } = req.body;
    const { userId } = req.params;

    const userExists = await User.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const docExists = await bucket
      .find({ _id: new mongodb.ObjectId(id) })
      .toArray();

    if (!docExists || docExists.length === 0) {
      return res.status(404).json({ message: "Document not found!" });
    }

    if (docExists[0].metadata?.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized! This document doesn't belong to you.",
      });
    }

    await bucket.delete(new mongodb.ObjectId(id));

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
