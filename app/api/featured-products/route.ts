import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Get featured products with pagination
    const featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count of featured products
    const totalResult = await db
      .select()
      .from(products)
      .where(eq(products.featured, true));
    
    const total = totalResult.length;
    const hasMore = offset + limit < total;

    return NextResponse.json({
      products: featuredProducts,
      total,
      page,
      hasMore,
      nextPage: hasMore ? page + 1 : null
    });

  } catch (error) {
    console.error('Featured Products API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
  }
}