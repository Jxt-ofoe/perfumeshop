import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  let product;
  try {
    const results = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    product = results[0];
  } catch {
    return { title: 'Product Not Found' };
  }

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — ${product.category}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | VELOUR`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  let relatedProducts;
  try {
    const results = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    product = results[0];

    if (product) {
      relatedProducts = await db
        .select()
        .from(products)
        .where(eq(products.scentFamily, product.scentFamily))
        .limit(4);
      relatedProducts = relatedProducts.filter((p) => p.id !== product!.id).slice(0, 3);
    }
  } catch {
    notFound();
  }

  if (!product) notFound();

  return <ProductDetailClient product={product} relatedProducts={relatedProducts || []} />;
}
