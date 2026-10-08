import Link from 'next/link';
import { systemContent } from '@/shared/config/system-content';
export default function NotFound() {
  return (
    <div className="min-h-[70svh] pt-40 pb-24 px-6 text-center">
      <h1 className="text-4xl font-display font-black mb-6">{systemContent.notFoundTitle}</h1>
      <p className="text-muted mb-8">{systemContent.notFoundBody}</p>
      <Link
        href="/"
        className="inline-block bg-accentBrand text-dark rounded-full px-8 py-3 font-bold"
      >
        {systemContent.home}
      </Link>
    </div>
  );
}
