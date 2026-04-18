import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import type { Product } from '@/lib/types';
import { eq } from 'drizzle-orm';
import HeroSection from './sections/HeroSection';
import FeaturedSection from './sections/FeaturedSection';
import StorySection from './sections/StorySection';
import FamiliesSection from './sections/FamiliesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import NewsletterSection from './sections/NewsletterSection';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Charlene Luxe | Luxury Fragrance',
  description:
    'Discover luxury fragrances from the heart of Ghana. Hand-crafted scents for the discerning.',
};

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(12);
  } catch {
    featuredProducts = [];
  }

  return (
    <>
      <HeroSection />
      <FeaturedSection products={featuredProducts} />
      <StorySection />
      <FamiliesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
