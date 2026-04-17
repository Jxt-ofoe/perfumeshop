'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useCart } from '@/lib/store/cart-context';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

function formatPrice(priceInCents: number): string {
  return `GH₵${(priceInCents / 100).toFixed(2)}`;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to your bag`, {
      description: `${product.size} — ${formatPrice(product.price)}`,
    });
    openCart();
  };

  return (
    <Link
      href={`/collection/${product.slug}`}
      className="product-card"
      style={{ animationDelay: `${index * 0.08}s` }}
      id={`product-card-${product.slug}`}
    >
      <div className="product-card-image">
        <svg
          viewBox="0 0 24 24"
          width="60"
          height="60"
          fill="rgba(201,169,110,0.2)"
        >
          <path d="M10 21V19C8.34 19 7 17.66 7 16V10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10V16C13 17.66 11.66 19 10 19V21H10M14 21V19C15.66 19 17 17.66 17 16V10C17 8.34 15.66 7 14 7C12.34 7 11 8.34 11 10V16C11 17.66 12.34 19 14 19V21H14ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
        </svg>
      </div>

      <div className="product-card-tag">
        {product.scentFamily} · {product.category}
      </div>

      <h3 className="product-card-name">{product.name}</h3>

      <div className="product-card-notes">
        <div>
          <span>Top</span> {product.topNotes}
        </div>
        <div>
          <span>Heart</span> {product.heartNotes}
        </div>
        <div>
          <span>Base</span> {product.baseNotes}
        </div>
      </div>

      <div className="product-card-footer">
        <span className="product-card-price">{formatPrice(product.price)}</span>
        <button className="btn-add" onClick={handleAddToCart} id={`add-to-cart-${product.slug}`}>
          Add to Bag
        </button>
      </div>
    </Link>
  );
}
