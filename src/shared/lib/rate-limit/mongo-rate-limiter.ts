import 'server-only';
import { connectDb } from '@/shared/lib/db';
import { RateLimitModel } from './model';
import { rateLimitConfig } from './config';
import type { RateLimiter, RateLimitResult } from './types';

export interface IndexDescription {
  key: Record<string, unknown>;
  unique?: boolean;
  expireAfterSeconds?: number;
  sparse?: boolean;
  partialFilterExpression?: unknown;
}

export function hasRequiredRateLimitIndexes(indexes: readonly IndexDescription[]): boolean {
  const unique = indexes.some(
    (index) =>
      index.unique === true &&
      !index.sparse &&
      !index.partialFilterExpression &&
      Object.keys(index.key).length === 1 &&
      index.key.key === 1,
  );
  const ttl = indexes.some(
    (index) =>
      Object.keys(index.key).length === 1 &&
      index.key.expiresAt === 1 &&
      index.expireAfterSeconds === 0 &&
      !index.partialFilterExpression,
  );
  return unique && ttl;
}

/** One atomic update resets expired windows; TTL removal is cleanup, never the clock. */
export function windowUpdatePipeline(now: Date) {
  const expired = { $lte: [{ $ifNull: ['$expiresAt', new Date(0)] }, now] };
  return [
    {
      $set: {
        count: {
          $cond: [expired, 1, { $min: [{ $add: ['$count', 1] }, rateLimitConfig.limit + 1] }],
        },
        expiresAt: {
          $cond: [expired, new Date(now.getTime() + rateLimitConfig.windowMs), '$expiresAt'],
        },
      },
    },
  ];
}

function isDuplicateKey(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
}

export const mongoRateLimiter: RateLimiter = {
  async consume(key): Promise<RateLimitResult> {
    await connectDb();
    // Fail closed if the required unique index is missing. Never silently permit racing upserts.
    const indexes = await RateLimitModel.collection.listIndexes().toArray();
    if (!hasRequiredRateLimitIndexes(indexes)) throw new Error('RATE_LIMIT_INDEXES_MISSING');
    const now = new Date();
    const update = () =>
      RateLimitModel.collection.findOneAndUpdate({ key }, windowUpdatePipeline(now), {
        upsert: true,
        returnDocument: 'after',
      });
    let record;
    try {
      record = await update();
    } catch (error: unknown) {
      // Two first requests can race on insert. The unique index rejects one; retry its atomic increment.
      if (!isDuplicateKey(error)) throw error;
      record = await update();
    }
    if (!record) throw new Error('RATE_LIMIT_UNAVAILABLE');
    return {
      allowed: record.count <= rateLimitConfig.limit,
      // Concurrent callers may have captured their start time before the winning insert.
      retryAfter: Math.max(
        1,
        Math.min(
          rateLimitConfig.windowMs / 1000,
          Math.ceil((record.expiresAt.getTime() - Date.now()) / 1000),
        ),
      ),
    };
  },
};
