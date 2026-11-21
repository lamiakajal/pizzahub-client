import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

// Reuse one client across serverless invocations and hot reloads.
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    family: 4,
    tls: true,
  });

globalForMongo._mongoClient = client;

// Same database the Express server uses, so both share the user collection.
export const db = client.db("pizzahub");
