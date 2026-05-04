import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campiq.in';

  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic college pages
  try {
    // Note: this assumes the API is reachable during sitemap generation
    const res = await api.colleges.getAll({ limit: 1000 });
    const dynamicPages: MetadataRoute.Sitemap = res.data.map((college) => ({
      url: `${baseUrl}/college/${college.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error('Failed to generate sitemap for colleges:', error);
    return staticPages;
  }
}
