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
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x800/120e0a/c9a96e?text=${encodeURIComponent(product.name)}`;
            }}
          />
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
