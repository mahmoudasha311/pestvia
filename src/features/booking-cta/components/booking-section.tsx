import { BookingForm, bookingCopy } from '@/features/booking';
import { business } from '@/shared/config/business';

export function BookingSection() {
  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      data-reveal
      className="py-24 px-6 md:px-12 relative overflow-hidden bg-darker"
    >
      <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-bl from-surface to-dark border border-white/10 p-8 md:p-16 relative overflow-hidden shadow-2xl">
        <div
          aria-hidden="true"
          className="booking-glow absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono text-accent font-bold tracking-widest block mb-2">
              {bookingCopy.eyebrow}
            </span>
            <h2
              id="booking-title"
              className="text-3xl md:text-5xl font-black text-white font-display mb-4"
            >
              {bookingCopy.title}
            </h2>
            <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
              {bookingCopy.description}
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-300 font-mono">
              {business.areas.map((area) => (
                <span key={area.id} className="flex items-center gap-2">
                  <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent" />
                  {area.name}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
