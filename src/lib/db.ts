import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cache;

export function isDatabaseConfigured(): boolean {
  return Boolean(MONGODB_URI && process.env.MONGODB_DB_NAME);
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const dbName = process.env.MONGODB_DB_NAME;
    cache.promise = mongoose.connect(MONGODB_URI!, { dbName });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
