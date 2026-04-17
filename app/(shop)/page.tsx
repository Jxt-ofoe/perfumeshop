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
  title: 'VELOUR | Luxury Fragrance — Artisanal French Perfumery',
  description:
    'Discover artisanal French perfumery. Hand-crafted luxury fragrances from the heart of Grasse, France.',
};

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(6);
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
