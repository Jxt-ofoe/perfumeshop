import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // Get count of unfeatured products
    const unfeaturedProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, false));

    // Update all products to be featured
    await db
      .update(products)
      .set({ featured: true })
      .where(eq(products.featured, false));

    // Revalidate homepage to show updated products
    revalidatePath('/');
    
    return NextResponse.json({ 
      success: true, 
      count: unfeaturedProducts.length,
      message: `Featured ${unfeaturedProducts.length} products on homepage` 
    });
  } catch (error) {
    console.error('Error featuring products:', error);
    return NextResponse.json({ 
      error: 'Failed to feature products' 
    }, { status: 500 });
  }
}