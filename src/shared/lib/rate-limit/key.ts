import 'server-only';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

/** Canonicalization prevents equivalent IPv6 spellings from receiving different quotas. */
export function canonicalIp(input: string): string {
  if (isIP(input) === 4) return input;
  if (isIP(input) === 6) {
    const canonical = new URL(`http://[${input}]/`).hostname.slice(1, -1).toLowerCase();
    if (canonical.startsWith('::ffff:')) {
      const pieces = canonical.slice(7).split(':');
      if (pieces.length === 2) {
        const high = Number.parseInt(pieces[0], 16);
        const low = Number.parseInt(pieces[1], 16);
        return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
      }
    }
    return canonical;
  }
  throw new Error('CLIENT_IP_UNAVAILABLE');
}

export function hashRateLimitKey(ip: string, salt = ''): string {
  return createHash('sha256')
    .update(`${salt}\0${canonicalIp(ip)}`)
    .digest('hex');
}

/** Production accepts only a header supplied by the configured trusted ingress. */
export function clientRateLimitKey(headers: Headers): string {
  const header =
    process.env.VERCEL === '1' ? 'x-vercel-forwarded-for' : process.env.TRUSTED_CLIENT_IP_HEADER;
  const raw = header ? headers.get(header)?.trim() : undefined;
  if (raw) return hashRateLimitKey(raw, process.env.RATE_LIMIT_SALT);
  const deployment = process.env.VERCEL_ENV ?? process.env.DEPLOYMENT_ENV;
  if (!process.env.VERCEL && deployment !== 'production' && !header) {
    // Local preview requests share one loopback bucket; forwarded headers are ignored.
    return hashRateLimitKey('127.0.0.1', process.env.RATE_LIMIT_SALT);
  }
  throw new Error('CLIENT_IP_UNAVAILABLE');
}
