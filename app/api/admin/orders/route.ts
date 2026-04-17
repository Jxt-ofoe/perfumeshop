import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { desc, sql, like, or } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const search = searchParams.get('search');
    const statusFilter = searchParams.get('status');

    // Build conditions
    const conditions = [];
    if (statusFilter && statusFilter !== 'all') {
      conditions.push(sql`${orders.status} = ${statusFilter}`);
    }
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          like(orders.reference, searchPattern),
          like(orders.email, searchPattern),
          like(orders.firstName, searchPattern),
          like(orders.lastName, searchPattern)
        )
      );
    }

    let whereClause = undefined;
    if (conditions.length > 0) {
      // Create a raw SQL condition by combining them with AND
      whereClause = sql.join(conditions, sql` AND `);
    }

    // Get Total Count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause);
    
    const total = countResult[0].count;

    // Get Paginated Data
    const data = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      orders: data,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
