import 'server-only';
import mongoose from 'mongoose';

interface ConnectionCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var pestviaMongoose: ConnectionCache | undefined;
}

/** Reuse a bounded pool within each warm instance; never connect while rendering static pages. */
export async function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('DATABASE_NOT_CONFIGURED');
  const cache = (globalThis.pestviaMongoose ??= { connection: null, promise: null });
  if (cache.connection?.connection.readyState === 1) return cache.connection;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      autoIndex: false,
      bufferCommands: false,
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
  }
  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch {
    cache.connection = null;
    throw new Error('DATABASE_UNAVAILABLE');
  } finally {
    cache.promise = null;
  }
}
