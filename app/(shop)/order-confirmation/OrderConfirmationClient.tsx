'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/store/cart-context';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { OrderSelect, OrderItemSelect } from '@/lib/db/schema';

interface OrderConfirmationClientProps {
  order: OrderSelect;
  items: OrderItemSelect[];
}

function formatPrice(priceInCents: number): string {
  return `GH₵${(priceInCents / 100).toFixed(2)}`;
}

export default function OrderConfirmationClient({
  order,
  items,
}: OrderConfirmationClientProps) {
  const { clearCart } = useCart();
  const verifiedRef = useRef(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // higher resolution
        backgroundColor: '#120e0a' // match theme dark background
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Velour_Receipt_${order.reference}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    clearCart();

    const triggerConfetti = () => {
      const colors = ['#c9a96e', '#f5f0e8', '#ffffff'];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });
      }, 250);
    };

    const verifyOrder = async () => {
      if (verifiedRef.current || order.status === 'paid') return;
      verifiedRef.current = true;

      try {
        const res = await fetch(`/api/orders/verify?reference=${order.reference}`);
        const data = await res.json();
        if (data.success) {
          triggerConfetti();
        }
      } catch (error) {
        console.error('Failed to verify order', error);
      }
    };

    if (order.status === 'paid') {
      triggerConfetti();
    } else {
      verifyOrder();
    }
  }, [clearCart, order]);

  return (
    <div className="confirmation-page">
      <motion.div
        className="confirmation-checkmark"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </motion.div>

      <motion.h1
        className="confirmation-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Thank you, {order.firstName}!
      </motion.h1>

      <motion.div
        className="confirmation-ref"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Order Ref: {order.reference}
      </motion.div>

      <motion.div
        ref={receiptRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ width: '100%', padding: '2rem', background: '#120e0a', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.1)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-cormorant)', color: 'var(--color-gold)', fontSize: '1.5rem' }}>
          VELOUR
        </div>
        <table className="confirmation-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 600 }}>
              <td colSpan={2} style={{ paddingTop: '1.5rem', color: 'var(--color-gold)' }}>Total</td>
              <td style={{ paddingTop: '1.5rem', color: 'var(--color-gold)' }}>{formatPrice(order.totalAmount)}</td>
            </tr>
          </tbody>
        </table>

        <div className="confirmation-delivery">
          <h3>Delivery Details</h3>
          <p>{order.firstName} {order.lastName}</p>
          <p>{order.address}</p>
          <p>{order.city}, {order.state}</p>
          <p style={{ marginTop: '0.5rem' }}>{order.phone}</p>
        </div>

        <p className="confirmation-email-note">A receipt has been sent to {order.email}</p>
        <p className="confirmation-estimate">Estimated delivery: 3–5 business days</p>
      </motion.div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={downloadReceipt} disabled={isDownloading} className="btn-gold" style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', minWidth: '200px' }}>
          {isDownloading ? 'Generating PDF...' : 'Download Receipt'}
        </button>
        <Link href="/collection" className="btn-gold" style={{ minWidth: '200px', display: 'flex', justifyContent: 'center' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
