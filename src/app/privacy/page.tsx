import type { Metadata } from 'next';
import { LegalPage, legalPages } from '@/features/legal';
export const metadata: Metadata = {
  title: legalPages.privacy.title,
  robots: { index: false, follow: false },
};
export default function PrivacyPage() {
  return <LegalPage page="privacy" />;
}
