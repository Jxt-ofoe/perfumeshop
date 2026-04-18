'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products: initialProducts }: FeaturedSectionProps) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 12); // Only show Load More if we got a full page
  const [page, setPage] = useState(2); // Start from page 2 since initial products are page 1

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/featured-products?page=${page}&limit=12`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...data.products]);
        setHasMore(data.hasMore);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="collection" className="section-padding">
      <motion.span
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Our Complete Collection
      </motion.span>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        All Our Fragrances
      </motion.h2>

      <div className="grid-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (i % 12) * 0.1 }}
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </div>

      <motion.div
        style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {hasMore && (
          <button 
            onClick={loadMore}
            disabled={loading}
            className="btn-gold"
            style={{ 
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Loading More...' : 'Load More Products'}
          </button>
        )}
        
        <Link href="/collection" className="btn-gold" id="view-all-cta">
          View All Fragrances
        </Link>
      </motion.div>
    </section>
  );
}
