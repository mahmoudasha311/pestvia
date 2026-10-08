import { Icon } from '@/shared/ui/icons';
import { ShieldCheck } from 'lucide-react';
import { heroContent as content, heroStats } from '../content/hero.content';
import { HeroAnimation } from './hero-animation';
import { ShieldLoader } from './shield-loader';

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="hero-section relative flex flex-col justify-center items-center px-6 md:px-12 pt-28 pb-16 overflow-hidden"
    >
      <ShieldLoader />
      <div
        aria-hidden="true"
        className="hero-glow-primary absolute rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      />
      <div
        aria-hidden="true"
        className="hero-glow-secondary absolute rounded-full pointer-events-none bottom-10 right-10 z-0"
      />
      <HeroAnimation>
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-white/10 mb-8 hero-stagger">
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 shrink-0 rounded-full bg-accent animate-ping"
          />
          <span className="text-xs md:text-sm font-bold text-gray-200">{content.badge}</span>
          <span className="text-[10px] font-mono text-dark bg-accent px-2 py-0.5 rounded font-black">
            {content.technology}
          </span>
        </div>
        <h1
          id="hero-title"
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-display tracking-tight leading-[1.05] mb-6"
        >
          <span className="block text-white hero-stagger">{content.headline[0]}</span>
          <span className="block stroke-text hero-stagger">{content.headline[1]}</span>
        </h1>
        <p className="max-w-2xl text-base sm:text-xl text-muted font-normal leading-relaxed mb-10 hero-stagger">
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 hero-stagger">
          {/* Methodology CTA */}
          <a
            href="#methodology"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:border-accent/40 text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Icon name="search" className="w-4 h-4 text-accent" />
            <span>{content.methodologyLabel}</span>
          </a>

          {/* Booking CTA */}
          <a
            href="#booking"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-accentBrand text-dark font-black text-sm tracking-wide hover:bg-accentDeep hover:text-white hover:shadow-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>{content.bookingLabel}</span>
            <Icon name="arrow" className="w-4 h-4 rotate-180" />
          </a>
        </div>

        {/* Stats */}
        <div
          data-count={heroStats.length}
          className="stats-grid gap-4 mt-16 w-full max-w-4xl hero-stagger"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col glass-card p-4 rounded-2xl items-center justify-center gap-3 border-t border-white/10"
            >
              <ShieldCheck
                size={30}
                strokeWidth={2.5}
                className="text-[#4D9333] shrink-0"
                aria-hidden="true"
              />

              <span className="text-sm md:text-base font-semibold text-white">{stat.label}</span>
            </div>
          ))}
        </div>
      </HeroAnimation>
      <a
        href="#services"
        className="absolute bottom-6 inset-x-0 mx-auto w-fit flex flex-col items-center gap-2 text-xs font-mono text-muted/70 hover:text-accent transition-colors"
      >
        <span>{content.scrollLabel}</span>
        <span
          aria-hidden="true"
          className="w-4 h-7 rounded-full border border-white/20 flex justify-center p-1"
        >
          <span className="w-1 h-1.5 bg-accent rounded-full animate-bounce" />
        </span>
      </a>
    </section>
  );
}
