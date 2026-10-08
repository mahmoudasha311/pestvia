import type { ReactNode } from 'react';
import { Cairo, Tajawal } from 'next/font/google';
import { Header, Footer, MobileContactBar, CustomCursor } from '@/features/layout';
import { defaultMetadata } from '@/shared/seo/metadata';
import { systemContent } from '@/shared/config/system-content';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: '900',
  display: 'swap',
  variable: '--font-cairo',
});
const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-tajawal',
});
export const metadata = defaultMetadata;
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body>
        <a
          href="#site-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:right-0 focus:z-[100000] focus:bg-dark focus:p-4"
        >
          {systemContent.skip}
        </a>
        <Header />
        <main id="site-content">{children}</main>
        <Footer />
        <MobileContactBar />
        <CustomCursor />
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
