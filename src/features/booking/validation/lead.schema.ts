import { z } from 'zod';
import { business } from '@/shared/config/business';
import { bookingErrors, propertyTypes } from '../content/booking.content';
import { normalizeEgyptianMobile } from './phone';

export const leadInputSchema = z
  .object({
    name: z.string().trim().min(2, bookingErrors.name).max(100, bookingErrors.name),
    phone: z
      .string()
      .max(40, bookingErrors.phone)
      .transform((value, context) => {
        try {
          return normalizeEgyptianMobile(value);
        } catch {
          context.addIssue({ code: 'custom', message: bookingErrors.phone });
          return z.NEVER;
        }
      }),
    propertyType: z.enum(
      propertyTypes.map((type) => type.id),
      { error: bookingErrors.propertyType },
    ),
    area: z.enum(
      business.areas.map((area) => area.id),
      { error: bookingErrors.area },
    ),
    website: z.string().max(200).optional().default(''),
  })
  .strict();

export type LeadInput = z.output<typeof leadInputSchema>;
export type LeadFields = Pick<LeadInput, 'name' | 'phone' | 'propertyType' | 'area'>;
export type LeadFieldErrors = Partial<Record<keyof LeadFields, string>>;
