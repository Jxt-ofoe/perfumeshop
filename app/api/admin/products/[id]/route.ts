import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, orderItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();

    const [updated] = await db
      .update(products)
      .set(body)
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Update Product Error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    
    // Check for active orders referencing this product
    // For MVP, we'll just check if it exists in any order. In real app we might soft-delete.
    const references = await db
      .select({ id: orderItems.id })
      .from(orderItems)
      .where(eq(orderItems.productId, id))
      .limit(1);

    if (references.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product because it has been ordered by customers. Consider marking it as inactive instead.' 
      }, { status: 400 });
    }

    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Product Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
