import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Permit this workstation's LAN preview to load Next.js development resources.
  // This does not change production origins or booking API origin validation.
  allowedDevOrigins: ['192.168.1.4'],
  async redirects() {
    return [{ source: '/pestvia_3d_interactive_website.html', destination: '/', permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
