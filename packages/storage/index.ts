import express from "express";
import multer from "multer";
import { Readable } from "stream";
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const client = new MongoClient("mongodb://myuser:mypassword@mongo:27017");

// Define route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  const db = client.db("convertigo");

  if (!req.file) {
    res.status(400).send("No file.");
    return;
  }
  const fileStream = Readable.from(req.file.buffer.toString().split("\n"));

  const insertDocument = async (line: string) => {
    try {
      const document = JSON.parse(line.trim());
      // should the collection be the user id? a project id?
      await db.collection("test").insertOne(document);
    } catch (error) {
      console.error(`Error inserting document: ${(error as any).message}. ${JSON.stringify(document)}`);
    }
  };

  // Stream the file contents into the database
  fileStream.on("data", insertDocument);
  fileStream.on("end", () => {
    res.send("File uploaded and streamed successfully");
    // TODO: Send upload success rabbitmq message
  });
});

// Start the server
app.listen(port, async () => {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log(`Server listening on port ${port}`);
});
