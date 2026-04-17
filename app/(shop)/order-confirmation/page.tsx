import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import type { OrderSelect, OrderItemSelect } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import OrderConfirmationClient from './OrderConfirmationClient';

interface OrderConfirmationPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { ref } = await searchParams;

  if (!ref) {
    notFound();
  }

  let order: OrderSelect | undefined;
  let items: OrderItemSelect[] = [];

  try {
    const results = await db.select().from(orders).where(eq(orders.reference, ref)).limit(1);
    order = results[0];

    if (!order) {
      notFound();
    }

    if (order) {
      const orderId = order.id;
      const itemsResults = await db.query.orderItems.findMany({
        where: (orderItems, { eq }) => eq(orderItems.orderId, orderId),
      });
      items = itemsResults;
    }

  } catch {
    notFound();
  }

  return <OrderConfirmationClient order={order} items={items} />;
}
