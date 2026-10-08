import type { MetadataRoute } from 'next';
import { business } from '@/shared/config/business';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${business.domain}/sitemap.xml`,
    host: business.domain,
  };
}
