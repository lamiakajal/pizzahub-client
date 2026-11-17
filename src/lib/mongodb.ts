import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

// Reuse one client across hot reloads in development.
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client = globalForMongo._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

// Same database the Express server uses, so both share the user collection.
export const db = client.db("pizzahub");
