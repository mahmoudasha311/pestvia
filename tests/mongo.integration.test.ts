import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { connectDb } from '../src/shared/lib/db/index.ts';
import { RateLimitModel } from '../src/shared/lib/rate-limit/model.ts';
import { mongoRateLimiter } from '../src/shared/lib/rate-limit/mongo-rate-limiter.ts';
import { hashRateLimitKey } from '../src/shared/lib/rate-limit/key.ts';
import { LeadModel } from '../src/features/booking/models/lead.model.ts';
import { createLead, notifySavedLead } from '../src/features/booking/services/create-lead.ts';

test(
  'Mongo atomic concurrency, expired reset, missing-index refusal and durable leads',
  { skip: !process.env.MONGODB_TEST_URI },
  async () => {
    // Require an explicitly isolated test database; only this test's own records/indexes are mutated.
    const uri = process.env.MONGODB_TEST_URI!;
    const database = new URL(uri).pathname.slice(1);
    assert.match(database, /(?:^|_)test(?:s)?$/);
    process.env.MONGODB_URI = uri;
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    const key = hashRateLimitKey('192.0.2.45', randomUUID());
    let leadId: string | undefined;
    try {
      const [first, second] = await Promise.all([connectDb(), connectDb()]);
      assert.equal(first, second);
      await LeadModel.createIndexes();
      await RateLimitModel.createIndexes();
      const attempts = await Promise.all(
        Array.from({ length: 20 }, () => mongoRateLimiter.consume(key)),
      );
      assert.equal(attempts.filter((result) => result.allowed).length, 5);
      assert.ok(attempts.every((result) => result.retryAfter > 0 && result.retryAfter <= 900));
      assert.equal(await RateLimitModel.countDocuments({ key }), 1);
      await RateLimitModel.updateOne({ key }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
      assert.equal((await mongoRateLimiter.consume(key)).allowed, true);
      assert.equal((await RateLimitModel.findOne({ key }).lean())?.count, 1);
      await RateLimitModel.collection.dropIndex('rate_limits_key_unique');
      await assert.rejects(mongoRateLimiter.consume(key), /INDEXES_MISSING/);
      await RateLimitModel.createIndexes();
      leadId = await createLead({
        name: 'اختبار آلي',
        phone: '+201012345678',
        propertyType: 'residential',
        area: 'giza',
      });
      await notifySavedLead(leadId);
      const stored = await LeadModel.findById(leadId).lean();
      assert.equal(stored?.phone, '+201012345678');
      assert.equal(stored?.notification?.status, 'not-configured');
      assert.ok(stored && !('expiresAt' in stored));
    } finally {
      if (mongoose.connection.readyState === 1) {
        await RateLimitModel.createIndexes();
        await RateLimitModel.deleteOne({ key });
        if (leadId) await LeadModel.deleteOne({ _id: leadId });
      }
      await mongoose.disconnect();
    }
  },
);
