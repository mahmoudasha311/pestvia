import test from 'node:test';
import assert from 'node:assert/strict';
import {
  telegramMessage,
  telegramNotifier,
} from '../src/features/booking/services/notifiers/telegram.notifier.ts';

const lead = {
  name: 'عميل اختبار',
  phone: '+201131203245',
  propertyType: 'قصر أو فيلا سكنية',
  area: 'القاهرة',
  time: new Date('2026-10-04T10:00:00Z'),
};
test('Telegram message contains only five requested fields and local phone', () => {
  const message = telegramMessage(lead);
  assert.equal(message.split('\n').length, 5);
  assert.match(message, /01131203245/);
  assert.match(message, /القاهرة/);
});
test('Telegram missing credentials, transport failures and rejected API responses are safe', async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN,
    chat = process.env.TELEGRAM_CHAT_ID;
  try {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    assert.equal(
      await telegramNotifier(async () => {
        throw new Error('must not send');
      }).notify(lead),
      'not-configured',
    );
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    process.env.TELEGRAM_CHAT_ID = 'test-chat';
    assert.equal(
      await telegramNotifier(async () => {
        throw new Error('offline');
      }).notify(lead),
      'failed',
    );
    assert.equal(
      await telegramNotifier(async () => Response.json({ ok: false })).notify(lead),
      'failed',
    );
    assert.equal(
      await telegramNotifier(async () => Response.json({ ok: true })).notify(lead),
      'sent',
    );
  } finally {
    if (token === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
    else process.env.TELEGRAM_BOT_TOKEN = token;
    if (chat === undefined) delete process.env.TELEGRAM_CHAT_ID;
    else process.env.TELEGRAM_CHAT_ID = chat;
  }
});
