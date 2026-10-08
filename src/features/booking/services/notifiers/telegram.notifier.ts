import 'server-only';
import { business } from '@/shared/config/business';
import { bookingFields } from '../../content/booking.content';
import { localEgyptianMobile } from '../../validation/phone';
import type { LeadNotification, LeadNotifier } from './notifier';

export function telegramMessage(lead: LeadNotification): string {
  const time = new Intl.DateTimeFormat('ar-EG', {
    timeZone: business.timezone,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(lead.time);
  return [
    `${bookingFields.name}: ${lead.name}`,
    `${bookingFields.phone}: ${localEgyptianMobile(lead.phone)}`,
    `${bookingFields.propertyType}: ${lead.propertyType}`,
    `${bookingFields.area}: ${lead.area}`,
    `${bookingFields.time}: ${time}`,
  ].join('\n');
}

/** Deliberately catches all delivery errors; credentials and response bodies are never logged. */
export function telegramNotifier(send: typeof fetch = fetch): LeadNotifier {
  return {
    async notify(lead) {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (!token || !chatId) return 'not-configured';
      try {
        const response = await send(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: telegramMessage(lead) }),
          signal: AbortSignal.timeout(5000),
          cache: 'no-store',
        });
        if (!response.ok) return 'failed';
        const result: unknown = await response.json();
        return typeof result === 'object' && result !== null && 'ok' in result && result.ok === true
          ? 'sent'
          : 'failed';
      } catch {
        return 'failed';
      }
    },
  };
}
