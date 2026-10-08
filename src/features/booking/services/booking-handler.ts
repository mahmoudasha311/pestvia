import 'server-only';
import { after } from 'next/server';
import { clientRateLimitKey, mongoRateLimiter } from '@/shared/lib/rate-limit';
import { bookingErrors } from '../content/booking.content';
import { createLead, notifySavedLead } from './create-lead';
import { submitBooking } from './submit-booking';
import { isAllowedRequestOrigin } from '../utils/request-origin';

/** Bound the body before parsing. Route files only delegate to this feature API. */
export async function handleBooking(request: Request): Promise<Response> {
  if (!isAllowedRequestOrigin(request))
    return Response.json({ message: bookingErrors.request }, { status: 403 });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ message: bookingErrors.request }, { status: 400 });
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return Response.json({ message: bookingErrors.tooLarge }, { status: 413 });
      }
      parts.push(value);
    }
    const data: unknown = JSON.parse(Buffer.concat(parts).toString('utf8'));
    return await submitBooking(data, {
      limit: () => mongoRateLimiter.consume(clientRateLimitKey(request.headers)),
      save: createLead,
      notify: async (id) => {
        after(() => notifySavedLead(id));
      },
    });
  } catch {
    return Response.json({ message: bookingErrors.request }, { status: 400 });
  }
}
