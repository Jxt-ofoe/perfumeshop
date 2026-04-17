'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/cart-context';
import { toast } from 'sonner';

function formatPrice(priceInCents: number): string {
  return `GH₵${(priceInCents / 100).toFixed(2)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  });

  if (state.items.length === 0) {
    return (
      <div className="section-padding" style={{ minHeight: '60vh', textAlign: 'center', paddingTop: '10rem' }}>
        <h1 className="section-title">Your Bag is Empty</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Please add items to your bag before proceeding to checkout.
        </p>
        <button className="btn-gold" onClick={() => router.push('/collection')}>
          Return to Collection
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        totalAmount: subtotal,
        items: state.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to Paystack checkout URL
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Invalid payment initialization response');
      }

    } catch (error: any) {
      toast.error('Checkout failed', {
        description: error.message || 'Please try again later.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="container checkout-layout">
      {/* Checkout Form */}
      <div className="checkout-form">
        <h2>Delivery Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State / Province</label>
              <input
                type="text"
                name="state"
                className="form-input"
                required
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold-filled"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${formatPrice(subtotal)} with Paystack`}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="checkout-items">
          {state.items.map((item) => (
            <div key={item.product.id} className="checkout-item">
              <div>
                <div className="checkout-item-name">{item.product.name}</div>
                <div className="checkout-item-qty">Qty: {item.quantity}</div>
              </div>
              <div className="checkout-item-price">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-total">
          <span className="checkout-total-label">Total</span>
          <span className="checkout-total-value">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
