import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeEgyptianMobile,
  localEgyptianMobile,
} from '../src/features/booking/validation/phone.ts';
import { leadInputSchema } from '../src/features/booking/validation/lead.schema.ts';
import { submitBooking } from '../src/features/booking/services/submit-booking.ts';
import type { BookingDependencies } from '../src/features/booking/services/submit-booking.ts';
import { isAllowedRequestOrigin } from '../src/features/booking/utils/request-origin.ts';

test('Origin checks use the public host behind Next internal hostnames', () => {
  assert.equal(
    isAllowedRequestOrigin(
      new Request('http://localhost:3001/api/booking', {
        headers: { host: '127.0.0.1:3001', origin: 'http://127.0.0.1:3001' },
      }),
    ),
    true,
  );
  assert.equal(
    isAllowedRequestOrigin(
      new Request('http://localhost:3001/api/booking', {
        headers: { host: 'pestvia.net', origin: 'https://pestvia.net' },
      }),
    ),
    true,
  );
  for (const origin of ['https://other.example', 'null', 'file:///pestvia.net'])
    assert.equal(
      isAllowedRequestOrigin(
        new Request('https://pestvia.net/api/booking', {
          headers: { host: 'pestvia.net', origin },
        }),
      ),
      false,
    );
});

const valid = {
  name: 'عميل اختبار',
  phone: '01131203245',
  propertyType: 'residential',
  area: 'cairo',
  website: '',
};
test('Egyptian local/international/Arabic mobile formats normalize consistently', () => {
  for (const value of [
    '01131203245',
    '+201131203245',
    '٠١١٣١٢٠٣٢٤٥',
    '۰۱۱۳۱۲۰۳۲۴۵',
    '011 3120 3245',
  ])
    assert.equal(normalizeEgyptianMobile(value), '+201131203245');
  assert.equal(localEgyptianMobile('+201131203245'), '01131203245');
  for (const value of ['+966501234567', '01312345678', '0113120324', '00201131203245', 'abc'])
    assert.throws(() => normalizeEgyptianMobile(value));
});
test('Boundary rejects unsupported areas, properties, unknown fields and oversized names', () => {
  assert.equal(leadInputSchema.safeParse(valid).success, true);
  for (const change of [
    { area: 'alexandria' },
    { propertyType: 'other' },
    { email: 'extra@example.test' },
    { name: 'x'.repeat(101) },
  ])
    assert.equal(leadInputSchema.safeParse({ ...valid, ...change }).success, false);
});
test('Lead save precedes notification; notification rejection still returns success', async () => {
  const events: string[] = [];
  const dependencies: BookingDependencies = {
    limit: async () => ({ allowed: true, retryAfter: 900 }),
    save: async (input) => {
      events.push('saved');
      assert.equal(input.phone, '+201131203245');
      assert.equal('website' in input, false);
      return 'id';
    },
    notify: async () => {
      events.push('notified');
      throw new Error('provider unavailable');
    },
  };
  assert.equal((await submitBooking(valid, dependencies)).status, 201);
  assert.deepEqual(events, ['saved', 'notified']);
});
test('Limiter/database failures fail closed; honeypot never reaches storage', async () => {
  let saves = 0;
  const dependencies: BookingDependencies = {
    limit: async () => {
      throw new Error('index missing');
    },
    save: async () => {
      saves++;
      return 'id';
    },
    notify: async () => {},
  };
  assert.equal((await submitBooking(valid, dependencies)).status, 503);
  assert.equal((await submitBooking({ ...valid, website: 'spam' }, dependencies)).status, 200);
  assert.equal(saves, 0);
  dependencies.limit = async () => ({ allowed: true, retryAfter: 900 });
  dependencies.save = async () => {
    throw new Error('database unavailable');
  };
  assert.equal((await submitBooking(valid, dependencies)).status, 503);
});
test('Exceeded quota returns Arabic error and exact Retry-After without saving', async () => {
  const response = await submitBooking(valid, {
    limit: async () => ({ allowed: false, retryAfter: 312 }),
    save: async () => {
      throw new Error('must not save');
    },
    notify: async () => {},
  });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '312');
  assert.match((await response.json()).message, /المحاولات/);
});
