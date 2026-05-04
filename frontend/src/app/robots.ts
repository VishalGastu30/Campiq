import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campiq.in';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/saved', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
