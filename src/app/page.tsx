import type { Metadata } from 'next';
import { Hero } from '@/features/hero';
import { HomeServices } from '@/features/home-services';
import { Methodology } from '@/features/methodology';
import { BookingSection } from '@/features/booking-cta';
import { StructuredData } from '@/shared/seo/json-ld';
import { SectionReveal } from '@/shared/ui/section-reveal';
import { defaultMetadata } from '@/shared/seo/metadata';
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...defaultMetadata.openGraph, url: '/' },
};
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <SectionReveal>
        <HomeServices />
        <Methodology />
        <BookingSection />
      </SectionReveal>
    </>
  );
}
