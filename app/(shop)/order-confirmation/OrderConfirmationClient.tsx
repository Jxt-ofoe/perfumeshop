'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/store/cart-context';
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
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReceipt = () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const margin = 20;
      const pageW = 210;
      const contentW = pageW - margin * 2;
      let y = margin;

      const gold: [number, number, number] = [201, 169, 110];
      const black: [number, number, number] = [10, 8, 5];
      const grey: [number, number, number] = [100, 95, 90];

      // Header background
      pdf.setFillColor(...black);
      pdf.rect(0, 0, pageW, 40, 'F');

      // Brand name
      pdf.setFont('times', 'italic');
      pdf.setFontSize(28);
      pdf.setTextColor(...gold);
      pdf.text('VELOUR', pageW / 2, 22, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(245, 240, 232);
      pdf.text('PARIS — LUXURY FRAGRANCE', pageW / 2, 30, { align: 'center' });

      y = 50;

      // Order reference
      pdf.setFontSize(9);
      pdf.setTextColor(...grey);
      pdf.text('ORDER REFERENCE', margin, y);
      pdf.setFontSize(11);
      pdf.setTextColor(...black);
      pdf.text(order.reference, margin, y + 6);

      // Date (right side)
      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      pdf.setFontSize(9);
      pdf.setTextColor(...grey);
      pdf.text('DATE', pageW - margin, y, { align: 'right' });
      pdf.setFontSize(11);
      pdf.setTextColor(...black);
      pdf.text(dateStr, pageW - margin, y + 6, { align: 'right' });

      y += 20;

      // Divider
      pdf.setDrawColor(...gold);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageW - margin, y);
      y += 10;

      // Items table header
      pdf.setFillColor(245, 242, 238);
      pdf.rect(margin, y, contentW, 8, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(...grey);
      pdf.text('ITEM', margin + 3, y + 5.5);
      pdf.text('QTY', margin + contentW * 0.65, y + 5.5, { align: 'center' });
      pdf.text('PRICE', pageW - margin - 3, y + 5.5, { align: 'right' });
      y += 12;

      // Items rows
      items.forEach((item, i) => {
        if (i % 2 === 0) {
          pdf.setFillColor(252, 251, 249);
          pdf.rect(margin, y - 3, contentW, 9, 'F');
        }
        pdf.setFontSize(10);
        pdf.setTextColor(30, 25, 20);
        pdf.text(item.productName, margin + 3, y + 3);
        pdf.setTextColor(...grey);
        pdf.text(String(item.quantity), margin + contentW * 0.65, y + 3, { align: 'center' });
        pdf.setTextColor(30, 25, 20);
        pdf.text(`GH₵${(item.price * item.quantity / 100).toFixed(2)}`, pageW - margin - 3, y + 3, { align: 'right' });
        y += 10;
      });

      // Total row
      y += 2;
      pdf.setDrawColor(...gold);
      pdf.line(margin, y, pageW - margin, y);
      y += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(...black);
      pdf.text('TOTAL', margin + 3, y + 3);
      pdf.setTextColor(...gold);
      pdf.text(`GH₵${(order.totalAmount / 100).toFixed(2)}`, pageW - margin - 3, y + 3, { align: 'right' });
      y += 16;

      // Delivery details box
      pdf.setFont('helvetica', 'normal');
      pdf.setDrawColor(220, 215, 205);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, y, contentW, 38);
      pdf.setFontSize(8);
      pdf.setTextColor(...grey);
      pdf.text('DELIVERY DETAILS', margin + 4, y + 7);
      pdf.setFontSize(10);
      pdf.setTextColor(30, 25, 20);
      pdf.text(`${order.firstName} ${order.lastName}`, margin + 4, y + 15);
      pdf.text(order.address, margin + 4, y + 22);
      pdf.text(`${order.city}, ${order.state}`, margin + 4, y + 29);
      pdf.text(order.phone, margin + 4, y + 36);
      y += 48;

      // Footer note
      pdf.setFontSize(8.5);
      pdf.setTextColor(...grey);
      pdf.text(`Receipt sent to: ${order.email}`, pageW / 2, y, { align: 'center' });
      y += 6;
      pdf.text('Estimated delivery: 3–5 business days', pageW / 2, y, { align: 'center' });
      y += 12;

      // Bottom border
      pdf.setDrawColor(...gold);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageW - margin, y);
      y += 6;
      pdf.setFontSize(7);
      pdf.setTextColor(...grey);
      pdf.text('© VELOUR PARIS. ALL RIGHTS RESERVED.', pageW / 2, y, { align: 'center' });

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
        <button onClick={downloadReceipt} disabled={isDownloading} className="btn-gold no-print" style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', minWidth: '200px' }}>
          {isDownloading ? 'Generating PDF...' : 'Download Receipt'}
        </button>
        <button onClick={() => window.print()} className="btn-gold no-print" style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', minWidth: '200px' }}>
          Print Receipt
        </button>
        <Link href="/collection" className="btn-gold no-print" style={{ minWidth: '200px', display: 'flex', justifyContent: 'center' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
