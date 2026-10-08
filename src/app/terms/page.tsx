import type { Metadata } from 'next';
import { LegalPage, legalPages } from '@/features/legal';
export const metadata: Metadata = {
  title: legalPages.terms.title,
  robots: { index: false, follow: false },
};
export default function TermsPage() {
  return <LegalPage page="terms" />;
}
