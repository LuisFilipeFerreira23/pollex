import db from "../util/dbmanager.js";
const { Doc } = db;

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
    res.status(200).json({ docs });
  } catch (error) {
    res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function createDoc(req, res, next) {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Create writable stream to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // Write buffer to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.status(200).json({
        message: "File uploaded successfully",
        fileId: uploadStream.id,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function downloadDoc(req, res, next) {
  try {
    const { id } = req.body;

    // Create writable stream to GridFS
    const downloadStream = bucket.openDownloadStream(new mongodb.ObjectId(id));

    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      res.status(404).json({ message: "File not found", error: err.message });
    });
  } catch (error) {
    res.status(500).json({ message: "Error:", error: error.message });
  }
}

export function deleteDocs() {
  console.log("123");
}
