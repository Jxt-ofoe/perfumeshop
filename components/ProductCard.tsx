'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useCart } from '@/lib/store/cart-context';
import type { Product } from '@/lib/types';

function proxyImage(url: string) {
  if (!url) return '';
  if (url.startsWith('/')) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

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
        <img
          src={proxyImage(product.image)}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x500/120e0a/6c8480?text=${encodeURIComponent(product.name)}`;
          }}
        />
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
