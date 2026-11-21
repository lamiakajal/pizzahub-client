import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

function createClient() {
  const mongoClient = new MongoClient(uri!, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    family: 4,
    tls: true,
  });

  mongoClient.on("topologyClosed", () => {
    if (globalForMongo._mongoClient === mongoClient) {
      globalForMongo._mongoClient = undefined;
    }
  });

  attachDatabasePool(mongoClient);
  return mongoClient;
}

export const client = globalForMongo._mongoClient ?? createClient();
globalForMongo._mongoClient = client;

export const db = client.db("pizzahub");
