import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://campiq.in'}/sitemap.xml`,
  };
}
