import type { Metadata } from 'next';
import { business } from '@/shared/config/business';
import { seo } from '@/shared/config/seo';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(business.domain),
  title: { default: seo.title, template: seo.titleTemplate },
  description: seo.description,
  openGraph: {
    type: 'website',
    siteName: seo.siteName,
    locale: seo.locale,
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};
