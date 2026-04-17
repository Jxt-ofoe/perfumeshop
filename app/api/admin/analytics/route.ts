import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { sql, eq, and, gte, between } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d'; // 7d, 30d, 90d, 12m

    // Calculate date ranges
    const now = new Date();
    let startDate = new Date();
    switch (range) {
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      case '12m': startDate.setMonth(now.getMonth() - 12); break;
      case '30d':
      default: startDate.setDate(now.getDate() - 30); break;
    }

    // Convert to ISO string for SQLite comparison
    const startIso = startDate.toISOString();
    const endIso = now.toISOString();

    // 1. Basic Stats (Total Revenue, Total Orders within range)
    const statsResult = await db
      .select({
        revenue: sql<number>`sum(${orders.totalAmount})`,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(and(
        gte(orders.createdAt, startIso),
        eq(orders.status, 'paid')
      ));

    // 2. Orders by Status
    const statusCounts = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(gte(orders.createdAt, startIso))
      .groupBy(orders.status);

    // 3. Top Products by Revenue
    // Using a raw query for simplicity due to SQLite aggregate limits
    const topProducts = await db.all(sql`
      SELECT 
        p.name, 
        SUM(oi.quantity) as total_sold, 
        SUM(oi.price * oi.quantity) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status = 'paid' AND o.created_at >= ${startIso}
      GROUP BY p.id
      ORDER BY total_revenue DESC
      LIMIT 5
    `);

    // 4. Revenue Time Series
    // SQLite uses strftime to group by date
    let timeGroupFormat = '%Y-%m-%d';
    if (range === '12m') timeGroupFormat = '%Y-%m';

    const revenueOverTime = await db.all(sql`
      SELECT 
        strftime(${timeGroupFormat}, created_at) as date,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status = 'paid' AND created_at >= ${startIso}
      GROUP BY date
      ORDER BY date ASC
    `);

    return NextResponse.json({
      summary: {
        revenue: statsResult[0]?.revenue || 0,
        orders: statsResult[0]?.count || 0,
      },
      statusDistribution: statusCounts,
      topProducts,
      revenueOverTime
    });

  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
