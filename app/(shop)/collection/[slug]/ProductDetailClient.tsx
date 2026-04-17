'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/lib/store/cart-context';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

function formatPrice(priceInCents: number): string {
  return `GH₵${(priceInCents / 100).toFixed(2)}`;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${product.name} added to your bag`, {
      description: `${quantity}x ${product.size} — ${formatPrice(product.price * quantity)}`,
    });
    openCart();
  };

  return (
    <div className="product-detail section-padding">
      <div className="product-detail-layout">
        {/* Image */}
        <motion.div
          className="product-detail-image"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <svg
            viewBox="0 0 24 24"
            width="120"
            height="120"
            fill="rgba(201,169,110,0.15)"
          >
            <path d="M10 21V19C8.34 19 7 17.66 7 16V10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10V16C13 17.66 11.66 19 10 19V21H10M14 21V19C15.66 19 17 17.66 17 16V10C17 8.34 15.66 7 14 7C12.34 7 11 8.34 11 10V16C11 17.66 12.34 19 14 19V21H14ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
          </svg>
        </motion.div>

        {/* Info */}
        <motion.div
          className="product-detail-info"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="product-detail-tag">
            {product.scentFamily} · {product.category} · {product.size}
          </span>

          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-price">
            {formatPrice(product.price)}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          {/* Scent Pyramid */}
          <motion.div
            className="scent-pyramid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Scent Pyramid</h3>
            <div className="scent-layer">
              <span className="scent-label">Top</span>
              <span className="scent-notes">{product.topNotes}</span>
            </div>
            <div className="scent-layer">
              <span className="scent-label">Heart</span>
              <span className="scent-notes">{product.heartNotes}</span>
            </div>
            <div className="scent-layer">
              <span className="scent-label">Base</span>
              <span className="scent-notes">{product.baseNotes}</span>
            </div>
          </motion.div>

          {/* Add to cart */}
          <motion.div
            className="product-detail-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="qty-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="btn-gold-filled"
              onClick={handleAddToCart}
              style={{ flex: 1 }}
              id="add-to-cart-detail"
            >
              Add to Bag — {formatPrice(product.price * quantity)}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <motion.div
          style={{ marginTop: '6rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="section-subtitle">You may also love</span>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '3rem' }}>
            Related Fragrances
          </h2>
          <div className="grid-3">
            {relatedProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
