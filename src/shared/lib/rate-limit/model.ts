import 'server-only';
import mongoose from 'mongoose';
import type { InferSchemaType, Model } from 'mongoose';

const rateLimitSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    count: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { collection: 'rate_limits', autoIndex: false, versionKey: false },
);

rateLimitSchema.index({ key: 1 }, { unique: true, name: 'rate_limits_key_unique' });
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'rate_limits_expiry' });

export type RateLimitRecord = InferSchemaType<typeof rateLimitSchema>;
export const RateLimitModel =
  (mongoose.models.RateLimit as Model<RateLimitRecord> | undefined) ??
  mongoose.model<RateLimitRecord>('RateLimit', rateLimitSchema);
