import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch all product slugs for dynamic routes
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const allProducts = await db.select({ slug: products.slug }).from(products);
    productUrls = allProducts.map((p) => ({
      url: `${baseUrl}/collection/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to generate sitemap for products:', error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...productUrls];
}
