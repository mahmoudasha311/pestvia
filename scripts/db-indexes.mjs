import nextEnv from '@next/env';
import mongoose from 'mongoose';
import { connectDb } from '../src/shared/lib/db/index.ts';
import { LeadModel } from '../src/features/booking/models/lead.model.ts';
import { RateLimitModel } from '../src/shared/lib/rate-limit/model.ts';
import { hasRequiredRateLimitIndexes } from '../src/shared/lib/rate-limit/mongo-rate-limiter.ts';

nextEnv.loadEnvConfig(process.cwd());
try {
  await connectDb();
  // Add only declared indexes. Do not use syncIndexes(), which could drop unrelated indexes.
  await LeadModel.createIndexes();
  await RateLimitModel.createIndexes();
  const indexes = await RateLimitModel.collection.listIndexes().toArray();
  if (!hasRequiredRateLimitIndexes(indexes)) throw new Error('RATE_LIMIT_INDEXES_MISSING');
  console.log(
    'Required indexes are ready: leads_created_at, rate_limits_key_unique, rate_limits_expiry.',
  );
} catch {
  console.error(
    'Database index setup failed. Check MONGODB_URI, Atlas connectivity and index permissions. Existing indexes were not dropped.',
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
