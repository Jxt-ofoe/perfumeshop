import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import type { Product } from '@/lib/types';
import { eq, desc } from 'drizzle-orm';
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
  let allProducts: Product[] = [];
  try {
    allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(12);
  } catch {
    allProducts = [];
  }

  return (
    <>
      <HeroSection />
      <FeaturedSection products={allProducts} />
      <StorySection />
      <FamiliesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
