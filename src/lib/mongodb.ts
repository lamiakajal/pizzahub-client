import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoClosed?: boolean;
};

function getLiveClient(): MongoClient {
  if (!globalForMongo._mongoClient || globalForMongo._mongoClosed) {
    globalForMongo._mongoClosed = false;
    const mongoClient = new MongoClient(uri!, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      serverMonitoringMode: "poll",
      family: 4,
      tls: true,
    });

    mongoClient.on("topologyClosed", () => {
      if (globalForMongo._mongoClient === mongoClient) {
        globalForMongo._mongoClosed = true;
        globalForMongo._mongoClient = undefined;
      }
    });

    mongoClient.on("close", () => {
      if (globalForMongo._mongoClient === mongoClient) {
        globalForMongo._mongoClosed = true;
        globalForMongo._mongoClient = undefined;
      }
    });

    attachDatabasePool(mongoClient);
    globalForMongo._mongoClient = mongoClient;
  }

  return globalForMongo._mongoClient;
}

export const client = getLiveClient();

export const db = new Proxy({} as ReturnType<MongoClient["db"]>, {
  get(_target, prop) {
    const activeDb = getLiveClient().db("pizzahub");
    const value = Reflect.get(activeDb, prop, activeDb);
    return typeof value === "function" ? value.bind(activeDb) : value;
  },
});
