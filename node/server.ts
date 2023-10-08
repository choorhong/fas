import fs from "fs";
import * as http from "http";
import csv from "csv-parser";
import { Db, MongoClient, ObjectId } from "mongodb";

const port: number = 3000;
const mongoUrl = "mongodb://localhost:27018";
const mgClient = new MongoClient(mongoUrl);
let db: Db;

// Fake data
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const filePath = "mock/data.csv";

const results: Record<string, any>[] = [];

const readCSV = async (
  fpath: string,
  cb: (data: Record<string, any>[]) => Promise<unknown>
) => {
  return fs
    .createReadStream(fpath)
    .pipe(csv())
    .on("data", (data: Record<string, any>) => {
      // Process each row of data here
      results.push(data);
    })
    .on("end", async () => {
      // All rows have been processed
      console.log("CSV data:", results);
      await cb(results);
    })
    .on("error", (error: Error) => {
      console.error("Error reading CSV file:", error);
    });
};

const d = {
  name: "Mike Hannigan",
  gender: "Male",
  age: 30,
  email: "mike_hannigan@email.com",
  status: "active",
};

const readCSVCallback = async (data: Record<string, any>[]) => {
  return await db.collection("users").insertMany(data);
};

// Create an HTTP server
const server: http.Server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Set response headers
    res.setHeader("Content-Type", "application/json");

    // Endpoint to read a CSV file and inserts the data into a MongoDB collection.
    if (req.url === "/csv" && req.method === "POST") {
      const result = await readCSV(filePath, readCSVCallback);
      try {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: result }));
      } catch (error) {
        console.error(error);
        res.end(JSON.stringify({ error: "Error occured!" }));
      }
      return;
    }

    // Endpoint to create user account, with the account information stored in a MongoDB collection.
    if (req.url === "/users" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const userData = JSON.parse(body);
          const result = await db.collection("users").insertOne(userData);

          res.statusCode = 201;
          res.end(JSON.stringify({ message: result }));
        } catch (error) {
          console.error(error);
          res.end(JSON.stringify({ error: "Error occured!" }));
        }
      });
      return;
    }

    // Endpoint to delete user account from MongoDB collection.
    if (req.url?.startsWith("/users") && req.method === "DELETE") {
      const userId = req.url.split(/\/+/).filter(Boolean)[1];

      try {
        if (!userId) {
          throw new Error("Error occured!");
        }

        const result = await db
          .collection("users")
          .deleteOne({ _id: new ObjectId(userId) });

        res.statusCode = 201;
        res.end(JSON.stringify({ message: result }));
      } catch (error) {
        console.error(error);
        res.end(JSON.stringify({ error: "Error occured!" }));
      }
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
);

mgClient
  .connect()
  .then(
    () => {
      db = mgClient.db("fast-co");

      // Start the server
      server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    },
    (error) => {
      throw error;
    }
  )
  .catch((error) => {
    console.error("Mongo connection error occured: ", error);
  });
