import { MetadataRoute } from 'next';
import { countriesApi, collegesApi, blogsApi } from '@/lib/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://intermost.in';

  // Core Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/apply',
    '/blogs',
    '/news',
    '/colleges',
    '/countries',
    '/compare',
    '/brochure-chat',
    '/nmc-approved-universities',
    '/privacy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Country Routes
  let countryRoutes: MetadataRoute.Sitemap = [];
  try {
    const countries = await countriesApi.getAll({ active: true });
    countryRoutes = countries.map((c) => ({
      url: `${baseUrl}/countries/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.debug('Sitemap: Failed to load dynamic countries, using fallback defaults.');
    const fallbackSlugs = ['russia', 'georgia', 'nepal', 'uzbekistan', 'kazakhstan'];
    countryRoutes = fallbackSlugs.map((slug) => ({
      url: `${baseUrl}/countries/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  }

  // Dynamic College Routes
  let collegeRoutes: MetadataRoute.Sitemap = [];
  try {
    const colleges = await collegesApi.getAll({ is_active: true });
    collegeRoutes = colleges.map((c) => ({
      url: `${baseUrl}/colleges/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.debug('Sitemap: Failed to load dynamic colleges.');
  }

  // Dynamic Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await blogsApi.getAll({ published: true });
    if (Array.isArray(blogs)) {
      blogRoutes = blogs.map((b) => ({
        url: `${baseUrl}/blogs/${b.slug}`,
        lastModified: new Date(b.updated_at || b.created_at || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.debug('Sitemap: Failed to load dynamic blogs.');
  }

  return [...staticRoutes, ...countryRoutes, ...collegeRoutes, ...blogRoutes];
}
