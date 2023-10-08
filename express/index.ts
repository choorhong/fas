import express, { Express } from "express";
import fs from "fs";
import { cors, logRequest, globalErrorHandler } from "@app/middlewares";
import multer from "multer";
import { Db, MongoClient, ObjectId } from "mongodb";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const path = `./uploads/`;

    // create upload folder if it does not exist
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const mongoUrl = "mongodb://localhost:27018";
const mgClient = new MongoClient(mongoUrl);
let db: Db;
const port = 80;
const app: Express = express();

const upload = multer({ storage });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors);

// Express middleware function that logs the IP address and timestamp of each incoming request.
app.use(logRequest);

// Create an Express route that allows a user to upload a file to the server and save it to a specified "./uploads" directory.
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).json({ message: "File uploaded" });
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ msg: "Express + TypeScript Server" });
});

app.get("/schedules", async (req: express.Request, res: express.Response) => {
  try {
    const r = await db.collection("schedules").find().limit(2).toArray();
    res.status(200).json({ msg: "Successful request", result: r });
  } catch (error) {
    res.status(400).json({ msg: (error as unknown as Error).message });
  }
});

app.post("/schedule", async (req: express.Request, res: express.Response) => {
  try {
    const r = await db.collection("schedules").insertOne({ ...req.body });

    res.status(201).json({ msg: "Successful request" });
  } catch (error) {
    res.status(400).json({ msg: (error as unknown as Error).message });
  }
});

app;
// Create an Express route that returns a list of all users in a MongoDB collection as a JSON response.
app.get("/users", async (req: express.Request, res: express.Response) => {
  const { minAge } = req.query;
  if (!minAge || isNaN(Number(minAge))) return;

  const filterParams = new Object() as Record<string, any>;
  filterParams.age = { $gt: +minAge };

  // Write a MongoDB query to find all documents in a collection where the "age" field is greater than 25.
  // db.collection(<collectionName>).find({ age: { $gt: 25 } }).toArray();
  const r = await db.collection("users").find(filterParams).toArray();
  res.status(200).json({ result: r });
});

app.post(
  "/search-schedules",
  async (req: express.Request, res: express.Response) => {
    const { searchText } = req.body;
    try {
      const r = await db
        .collection("schedules")
        .find({
          name: {
            $regex: new RegExp(searchText, "i"), // "i" for case-insensitive
          },
        })
        .toArray();
      res.status(200).json({ msg: "Successful request", result: r });
    } catch (error) {
      res.status(400).json({ msg: (error as unknown as Error).message });
    }
  }
);

app.post(
  "/users/update-credentials",
  async (req: express.Request, res: express.Response) => {
    const { email, id } = req.body;
    if (!email || !id) return;

    const params = new Object() as Record<string, any>;
    params.filter = { _id: new ObjectId(id) };
    params.update = { $set: { email: email } };

    // Write a MongoDB query to update the "email" field of a document with a specific ID.
    // db.collection(<collectionName>).updateOne(
    // { _id: ObjectId(user-id) }, // Specify the document by its ID
    // { $set: { email: newEmail } }  // Update the "email" field
    // )

    const r = await db
      .collection("users")
      .updateOne(params.filter, params.update);
    res.status(201).json({ result: r });
  }
);

app.delete("/users", async (req: express.Request, res: express.Response) => {
  // Write a MongoDB query to delete all documents in a collection where the "status" field is set to "inactive".
  const r = await db.collection("users").deleteMany({ status: "inactive" });
  res.status(200).json({ result: r });
});

app.use(globalErrorHandler);

mgClient
  .connect()
  .then(
    (mongodb) => {
      db = mgClient.db("fast-co");
      app.listen(port, () => {
        console.log(
          `⚡️[server]: Server is running at http://localhost:${port}`
        );
      });
    },
    (error) => {
      throw error;
    }
  )
  .catch((error) => {
    console.error("Mongo connection error occured: ", error);
  });
