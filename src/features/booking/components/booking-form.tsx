'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { business } from '@/shared/config/business';
import { legalConfig } from '@/shared/config/legal';
import { contactLinks } from '@/shared/config/contact';
import { bookingFields as fields, bookingErrors, propertyTypes } from '../content/booking.content';
import { bookingCopy } from '../content/booking-copy.content';
import { localEgyptianMobile, normalizeEgyptianMobile } from '../validation/phone';
import type { LeadFieldErrors } from '../validation/lead.schema';

export function BookingForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const busy = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    // Lightweight input feedback; authoritative Zod validation stays at the API boundary.
    const nextErrors: LeadFieldErrors = {};
    const name = String(payload.name ?? '').trim();
    if (name.length < 2 || name.length > 100) nextErrors.name = bookingErrors.name;
    try {
      normalizeEgyptianMobile(String(payload.phone ?? ''));
    } catch {
      nextErrors.phone = bookingErrors.phone;
    }
    if (!propertyTypes.some((type) => type.id === payload.propertyType))
      nextErrors.propertyType = bookingErrors.propertyType;
    if (!business.areas.some((area) => area.id === payload.area))
      nextErrors.area = bookingErrors.area;
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus('error');
      setMessage(bookingErrors.invalid);
      const first = Object.keys(nextErrors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    busy.current = true;
    setErrors({});
    setStatus('pending');
    setMessage(fields.submitting);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      const result: unknown = await response.json();
      const responseMessage =
        result &&
        typeof result === 'object' &&
        'message' in result &&
        typeof result.message === 'string'
          ? result.message
          : bookingErrors.unavailable;
      setMessage(responseMessage);
      setStatus(response.ok ? 'success' : 'error');
      if (response.ok) form.reset();
    } catch {
      setStatus('error');
      setMessage(bookingErrors.unavailable);
    } finally {
      busy.current = false;
    }
  }
  const fieldError = (key: keyof LeadFieldErrors) =>
    errors[key] ? (
      <p id={`booking-${key}-error`} className="text-xs text-red-300 mt-2">
        {errors[key]}
      </p>
    ) : null;
  return (
    <form
      onSubmit={submit}
      action="/api/booking"
      method="post"
      noValidate
      aria-busy={status === 'pending'}
      className="glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-4 border border-white/10"
    >
      <div>
        <label htmlFor="booking-name" className="block text-xs font-semibold text-gray-300 mb-1">
          {fields.name}
        </label>
        <input
          id="booking-name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder={fields.namePlaceholder}
          className="field"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'booking-name-error' : undefined}
        />
        {fieldError('name')}
      </div>
      <div>
        <label htmlFor="booking-phone" className="block text-xs font-semibold text-gray-300 mb-1">
          {fields.phone}
        </label>
        <input
          id="booking-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={40}
          placeholder={fields.phonePlaceholder}
          dir="ltr"
          className="field text-right"
          onBlur={(event) => {
            try {
              event.target.value = localEgyptianMobile(event.target.value);
            } catch {
              /* Validation explains incomplete input on submission. */
            }
          }}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
        />
        {fieldError('phone')}
      </div>
      <div>
        <label
          htmlFor="booking-propertyType"
          className="block text-xs font-semibold text-gray-300 mb-1"
        >
          {fields.propertyType}
        </label>
        <select
          id="booking-propertyType"
          name="propertyType"
          required
          className="field !bg-[#12131a]"
          aria-invalid={Boolean(errors.propertyType)}
        >
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
        {fieldError('propertyType')}
      </div>
      <div>
        <label htmlFor="booking-area" className="block text-xs font-semibold text-gray-300 mb-1">
          {fields.area}
        </label>
        <select
          id="booking-area"
          name="area"
          required
          defaultValue=""
          className="field !bg-[#12131a]"
          aria-invalid={Boolean(errors.area)}
          aria-describedby={errors.area ? 'booking-area-error' : undefined}
        >
          <option value="" disabled>
            {fields.areaPlaceholder}
          </option>
          {business.areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
        {fieldError('area')}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="booking-website">{fields.honeypot}</label>
        <input id="booking-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status === 'pending'}
        className="w-full mt-2 py-3.5 rounded-xl bg-accentBrand text-dark font-black text-sm tracking-wide hover:bg-accentDeep hover:text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait"
      >
        {status === 'pending' ? fields.submitting : bookingCopy.submit}
      </button>
      <p className="text-xs text-muted leading-relaxed">
        {fields.consent}
        {legalConfig.linksEnabled && (
          <>
            {' '}
            <a href="/privacy" className="text-accent underline">
              {fields.privacy}
            </a>
          </>
        )}
      </p>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          message
            ? `text-center text-xs font-bold p-3 rounded-lg border ${status === 'error' ? 'text-red-200 bg-red-900/10 border-red-300/20' : 'text-accent bg-accent/10 border-accent/20'}`
            : ''
        }
      >
        {message}
        {status === 'error' && (
          <div className="flex justify-center gap-4 mt-3">
            <a href={contactLinks.phone} className="underline">
              {fields.call}
            </a>
            <a
              href={contactLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {fields.whatsapp}
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
