import 'server-only';
import { leadInputSchema } from '../validation/lead.schema';
import { bookingErrors } from '../content/booking.content';
import { bookingCopy } from '../content/booking-copy.content';
import type { LeadFields } from '../validation/lead.schema';
import type { RateLimitResult } from '@/shared/lib/rate-limit';

export interface BookingDependencies {
  limit: () => Promise<RateLimitResult>;
  save: (input: LeadFields) => Promise<string>;
  notify: (id: string) => Promise<void>;
}

/** Fail closed on unavailable storage/limiting. Never acknowledge an unsaved genuine lead. */
export async function submitBooking(
  payload: unknown,
  dependencies: BookingDependencies,
): Promise<Response> {
  const parsed = leadInputSchema.safeParse(payload);
  // Bots receive an indistinguishable response; honeypot data is never stored or notified.
  if (parsed.success && parsed.data.website) return Response.json({ message: bookingCopy.success });
  try {
    const result = await dependencies.limit();
    if (!result.allowed)
      return Response.json(
        { message: bookingErrors.rateLimited },
        {
          status: 429,
          headers: { 'Retry-After': String(result.retryAfter) },
        },
      );
    if (!parsed.success) {
      const errors = Object.fromEntries(
        parsed.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
      return Response.json({ message: bookingErrors.invalid, errors }, { status: 400 });
    }
    const { name, phone, propertyType, area } = parsed.data;
    const id = await dependencies.save({ name, phone, propertyType, area });
    // The HTTP adapter schedules delivery with Next.js after(), which tracks serverless work.
    // Persistence is complete: even a scheduling/provider error must not fail the form.
    try {
      await dependencies.notify(id);
    } catch {
      /* Saved lead remains successful. */
    }
    return Response.json({ message: bookingCopy.success }, { status: 201 });
  } catch {
    return Response.json({ message: bookingErrors.unavailable }, { status: 503 });
  }
}
