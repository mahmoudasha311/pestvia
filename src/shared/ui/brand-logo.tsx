import Image from 'next/image';
import Link from 'next/link';
import { business } from '@/shared/config/business';

export function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/#hero"
      prefetch={false}
      aria-label={business.homeLabel}
      className={`brand-logo ${footer ? 'brand-logo--footer mb-4' : 'justify-self-center transition-transform duration-300 hover:scale-105'}`}
    >
      <Image
        src="/brand/pestvia-logo.png"
        alt={business.logoAlt}
        width={2171}
        height={724}
        sizes={footer ? '292px' : '(min-width: 1000px) 234px, (min-width: 768px) 190px, 136px'}
        preload={!footer}
      />
    </Link>
  );
}
