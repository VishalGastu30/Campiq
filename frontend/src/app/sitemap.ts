import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campiq.in';

  try {
    // We only need a paginated call to get the slugs, but for the sitemap we can fetch up to a certain limit
    const res = await api.colleges.getAll({ limit: 1000, page: 1, sort: 'nirfRank' });
    const colleges = res.data;

    const collegeUrls = colleges.map((college) => ({
      url: `${baseUrl}/college/${college.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
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
        url: `${baseUrl}/find-my-college`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/compare`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/decide`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      ...collegeUrls,
    ];
  } catch (err) {
    // Fallback if API fails during build
    return [
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
    ];
  }
}
