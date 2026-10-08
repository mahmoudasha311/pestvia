import 'server-only';
import { connectDb } from '@/shared/lib/db';
import { business } from '@/shared/config/business';
import { propertyTypes } from '../content/booking.content';
import { LeadModel } from '../models/lead.model';
import type { LeadFields } from '../validation/lead.schema';
import { getLeadNotifier } from './notifiers';

/** Only a completed database insert counts as a successful booking request. */
export async function createLead(input: LeadFields): Promise<string> {
  await connectDb();
  const lead = await LeadModel.create({
    name: input.name,
    phone: input.phone,
    propertyType: input.propertyType,
    area: input.area,
  });
  return lead._id.toString();
}

/** Delivery runs after persistence and cannot change the already successful form response. */
export async function notifySavedLead(id: string): Promise<void> {
  try {
    await connectDb();
    const lead = await LeadModel.findById(id).lean();
    if (!lead || lead.notification?.status === 'sent') return;
    const result = await getLeadNotifier().notify({
      name: lead.name,
      phone: lead.phone,
      propertyType:
        propertyTypes.find((type) => type.id === lead.propertyType)?.label ?? lead.propertyType,
      area: business.areas.find((area) => area.id === lead.area)?.name ?? lead.area,
      time: lead.createdAt,
    });
    await LeadModel.updateOne(
      { _id: id },
      { $set: { 'notification.status': result, 'notification.attemptedAt': new Date() } },
    );
  } catch {
    // A sanitized event only: never log tokens, chat IDs, form data, URLs or raw exception objects.
    console.error('BOOKING_NOTIFICATION_UNAVAILABLE');
  }
}
