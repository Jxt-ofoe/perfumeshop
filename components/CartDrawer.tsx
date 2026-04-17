'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/lib/store/cart-context';

interface CartDrawerProps {
  isOpen: boolean;
}

function formatPrice(priceInCents: number): string {
  return `GH₵${(priceInCents / 100).toFixed(2)}`;
}

export default function CartDrawer({ isOpen }: CartDrawerProps) {
  const { state, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="cart-drawer-header">
              <h2>Your Bag</h2>
              <button
                className="cart-drawer-close"
                onClick={closeCart}
                aria-label="Close cart"
                id="close-cart-btn"
              >
                ✕
              </button>
            </div>

            <div className="cart-drawer-items">
              {state.items.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">✦</div>
                  <p>Your bag is empty</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Discover our collection of artisanal fragrances
                  </p>
                </div>
              ) : (
                state.items.map((item) => (
                  <div className="cart-item" key={item.product.id}>
                    <div className="cart-item-image">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/70x90/120e0a/c9a96e?text=${encodeURIComponent(item.product.name)}`;
                        }}
                      />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.product.name}</div>
                      <div className="cart-item-size">{item.product.size}</div>
                      <div className="cart-item-price">
                        {formatPrice(item.product.price)}
                      </div>
                      <div className="cart-item-qty">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {state.items.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-subtotal">
                  <span className="cart-subtotal-label">Subtotal</span>
                  <span className="cart-subtotal-value">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="cart-checkout-btn"
                  onClick={closeCart}
                  id="checkout-link"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
