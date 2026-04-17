import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, state, items, totalAmount } = body;

    // Validate inputs
    if (!email || !items || !items.length || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique reference
    const reference = `VELOUR-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    // Insert order
    const [newOrder] = await db.insert(orders).values({
      reference,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      totalAmount,
      status: 'pending',
    }).returning();

    // Insert items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // MOCK PAYSTACK INITIALIZATION
    // Instead of calling Paystack, we'll mimic a successful response and 
    // redirect the user directly to our order confirmation page to simulate a "completed checkout"
    const mockAuthorizationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?ref=${reference}`;

    return NextResponse.json({
      authorization_url: mockAuthorizationUrl,
      reference,
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
