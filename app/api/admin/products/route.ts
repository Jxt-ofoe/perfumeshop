import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { desc, sql, like, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');

    const conditions = [];
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          like(products.name, searchPattern),
          like(products.scentFamily, searchPattern),
          like(products.slug, searchPattern)
        )
      );
    }

    let whereClause = undefined;
    if (conditions.length > 0) {
      whereClause = sql.join(conditions, sql` AND `);
    }

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);
    
    const total = countResult[0].count;

    const data = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      products: data,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}


// Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const slug = body.slug || body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Slug uniqueness check
    const existingSku = await db
      .select({ id: products.id })
      .from(products)
      .where(sql`${products.slug} = ${slug}`)
      .limit(1);

    if (existingSku.length > 0) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }

    const [inserted] = await db.insert(products).values({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: body.description || '',
      price: parseInt(body.price),
      image: body.image || '/images/bottle-placeholder.jpg',
      category: body.category || '',
      scentFamily: body.scentFamily || '',
      topNotes: body.topNotes || '',
      heartNotes: body.heartNotes || '',
      baseNotes: body.baseNotes || '',
      size: body.size || '100ml',
      featured: body.featured !== undefined ? body.featured : true,
    }).returning();

    revalidatePath('/');
    revalidatePath('/collection');
    return NextResponse.json({ success: true, product: inserted });
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
