import 'server-only';
import mongoose from 'mongoose';
import type { InferSchemaType, Model } from 'mongoose';
import { business } from '@/shared/config/business';
import { propertyTypes } from '../content/booking.content';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    phone: { type: String, required: true, match: /^\+201[0125]\d{8}$/ },
    propertyType: { type: String, required: true, enum: propertyTypes.map((type) => type.id) },
    area: { type: String, required: true, enum: business.areas.map((area) => area.id) },
    notification: {
      status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'not-configured'],
        default: 'pending',
      },
      attemptedAt: { type: Date },
    },
  },
  { timestamps: true, collection: 'leads', autoIndex: false, versionKey: false },
);

leadSchema.index({ createdAt: -1 }, { name: 'leads_created_at' });

export type Lead = InferSchemaType<typeof leadSchema>;
export const LeadModel =
  (mongoose.models.Lead as Model<Lead> | undefined) ?? mongoose.model<Lead>('Lead', leadSchema);
