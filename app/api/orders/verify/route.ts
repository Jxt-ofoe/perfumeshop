import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/lib/email/order-confirmation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ success: false, error: 'Reference required' }, { status: 400 });
    }

    // MOCK PAYSTACK VERIFICATION
    // We assume the payment is always successful for the MVP mockup.
    // In a real scenario, we'd verify the transaction against Paystack servers here.

    // Update order status in DB
    const [updatedOrder] = await db.update(orders)
      .set({ status: 'paid' })
      .where(eq(orders.reference, reference))
      .returning();

    if (updatedOrder) {
      // Get order items for email
      const items = await db.query.orderItems.findMany({
        where: (orderItems, { eq }) => eq(orderItems.orderId, updatedOrder.id),
      });

      // Send confirmation email asynchronously (don't await so we don't block response)
      resend.emails.send({
        from: 'VELOUR <orders@resend.dev>', // Use a verified domain in production
        to: updatedOrder.email,
        subject: `Order Confirmation - ${reference}`,
        react: OrderConfirmationEmail({
          orderReference: reference,
          firstName: updatedOrder.firstName,
          items: items.map(i => ({ name: i.productName, quantity: i.quantity, price: i.price })),
          totalAmount: updatedOrder.totalAmount,
          deliveryAddress: `${updatedOrder.address}, ${updatedOrder.city}, ${updatedOrder.state}`,
        }) as React.ReactElement,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, order: updatedOrder });

  } catch (error) {
    console.error('Order verification error:', error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
