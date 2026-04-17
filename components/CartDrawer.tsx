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
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="rgba(201,169,110,0.2)"
                      >
                        <path d="M10 21V19C8.34 19 7 17.66 7 16V10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10V16C13 17.66 11.66 19 10 19V21H10M14 21V19C15.66 19 17 17.66 17 16V10C17 8.34 15.66 7 14 7C12.34 7 11 8.34 11 10V16C11 17.66 12.34 19 14 19V21H14ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                      </svg>
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
