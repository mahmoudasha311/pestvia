import 'server-only';
import { telegramNotifier } from './telegram.notifier';
import type { LeadNotifier } from './notifier';

/** Add future providers here; the form and lead-saving logic stay independent. */
export function getLeadNotifier(): LeadNotifier {
  return telegramNotifier();
}
export type { LeadNotification, LeadNotifier, NotificationOutcome } from './notifier';
