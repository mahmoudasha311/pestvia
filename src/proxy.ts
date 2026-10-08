import { NextResponse } from 'next/server';
import { isAdminAccessEnabled } from '@/features/auth';
export function proxy() {
  if (!isAdminAccessEnabled())
    return new NextResponse(null, {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };
