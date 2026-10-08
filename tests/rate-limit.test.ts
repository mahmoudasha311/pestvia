import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalIp, hashRateLimitKey } from '../src/shared/lib/rate-limit/key.ts';
import { hasRequiredRateLimitIndexes } from '../src/shared/lib/rate-limit/mongo-rate-limiter.ts';
import { LeadModel } from '../src/features/booking/models/lead.model.ts';

test('Equivalent IP spellings share a hash and raw addresses never appear in the key', () => {
  assert.equal(canonicalIp('0:0:0:0:0:0:0:1'), '::1');
  assert.equal(hashRateLimitKey('::ffff:192.0.2.1'), hashRateLimitKey('192.0.2.1'));
  assert.equal(hashRateLimitKey('::1'), hashRateLimitKey('0:0:0:0:0:0:0:1'));
  assert.match(hashRateLimitKey('192.0.2.1'), /^[a-f0-9]{64}$/);
  assert.notEqual(hashRateLimitKey('::1'), hashRateLimitKey('::1', 'salt'));
  assert.throws(() => hashRateLimitKey('192.0.2.1, 10.0.0.1'));
});
test('Limiter refuses absent, partial, sparse, nonunique or nonexpiring indexes', () => {
  const key = { key: { key: 1 }, unique: true };
  const expiry = { key: { expiresAt: 1 }, expireAfterSeconds: 0 };
  assert.equal(hasRequiredRateLimitIndexes([key, expiry]), true);
  for (const indexes of [
    [],
    [key],
    [expiry],
    [{ ...key, unique: false }, expiry],
    [{ ...key, sparse: true }, expiry],
    [{ ...key, partialFilterExpression: { key: { $exists: true } } }, expiry],
    [key, { ...expiry, expireAfterSeconds: 900 }],
  ])
    assert.equal(hasRequiredRateLimitIndexes(indexes), false);
});
test('Lead schema has createdAt index and no expiration field or TTL index', () => {
  assert.equal(LeadModel.schema.path('expiresAt'), undefined);
  assert.ok(LeadModel.schema.indexes().some(([fields]) => fields.createdAt === -1));
  assert.ok(
    LeadModel.schema.indexes().every(([, options]) => options.expireAfterSeconds === undefined),
  );
});
