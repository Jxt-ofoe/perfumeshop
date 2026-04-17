import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { sql, and, gte, lte, eq, asc, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const scent = searchParams.get('scent');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '12');

    let queryConditions = [];

    if (category) queryConditions.push(eq(products.category, category));
    if (scent) queryConditions.push(eq(products.scentFamily, scent));
    if (minPrice) queryConditions.push(gte(products.price, parseInt(minPrice)));
    if (maxPrice) queryConditions.push(lte(products.price, parseInt(maxPrice)));
    if (featured === 'true') queryConditions.push(eq(products.featured, true));

    const whereClause = queryConditions.length > 0 ? and(...queryConditions) : undefined;

    let orderByClause;
    switch (sort) {
      case 'price-asc':
        orderByClause = asc(products.price);
        break;
      case 'price-desc':
        orderByClause = desc(products.price);
        break;
      case 'name-desc':
        orderByClause = desc(products.name);
        break;
      case 'newest':
        orderByClause = desc(products.createdAt);
        break;
      case 'name-asc':
      default:
        orderByClause = asc(products.name);
        break;
    }

    const results = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);
      
    const total = countResult[0].count;

    return NextResponse.json({
      products: results,
      total,
      page: 1,
    });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
