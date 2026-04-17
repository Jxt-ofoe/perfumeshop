import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return NextResponse.json({ order: { ...order, items } });
  } catch (error) {
    console.error('Fetch Order Error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();

    const allowedStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status: body.status })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Update Order Error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
