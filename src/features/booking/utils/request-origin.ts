/** Next may use an internal hostname; compare the browser origin with the public Host header. */
export function isAllowedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = request.headers.get('host') ?? new URL(request.url).host;
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') && url.host === host.toLowerCase()
    );
  } catch {
    return false;
  }
}
