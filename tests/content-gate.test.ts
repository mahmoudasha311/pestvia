import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error Small runtime script intentionally has no generated declaration file.
import { requiresContentApproval } from '../scripts/check-content-approval.mjs';
test('Only explicitly production deployments require content approval', () => {
  assert.equal(requiresContentApproval({ NODE_ENV: 'production' }), false);
  assert.equal(
    requiresContentApproval({ VERCEL_ENV: 'preview', DEPLOYMENT_ENV: 'production' }),
    false,
  );
  assert.equal(
    requiresContentApproval({ VERCEL_ENV: 'production', CONTENT_APPROVED: 'false' }),
    true,
  );
  assert.equal(requiresContentApproval({ DEPLOYMENT_ENV: 'production' }), true);
  assert.equal(
    requiresContentApproval({ VERCEL_ENV: 'production', CONTENT_APPROVED: 'true' }),
    false,
  );
});
