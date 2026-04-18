import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // Update all products to be featured
    await db
      .update(products)
      .set({ featured: true })
      .where(eq(products.featured, false));

    // Revalidate homepage to show updated products
    revalidatePath('/');
    
    return NextResponse.json({ 
      success: true, 
      message: 'All products are now featured on homepage' 
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json({ 
      error: 'Failed to update products' 
    }, { status: 500 });
  }
}