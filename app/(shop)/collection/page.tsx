'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import FilterDrawer from '@/components/FilterDrawer';
import type { Product } from '@/lib/types';

const CATEGORIES = ['Eau de Parfum', 'Extrait de Parfum', 'Mini Perfumes'];
const SCENT_FAMILIES = ['Floral', 'Woody', 'Oriental', 'Fresh', 'Gourmand'];
const LIMIT = 24;

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const initialScent = searchParams.get('scent') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('');
  const [scent, setScent] = useState(initialScent);
  const [sortBy, setSortBy] = useState('name-asc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async (pageNum: number, append: boolean) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (scent) params.set('scent', scent);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', String(pageNum));
      params.set('limit', String(LIMIT));

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      const fetched: Product[] = data.products || [];

      setProducts(prev => append ? [...prev, ...fetched] : fetched);
      setTotal(data.total || 0);
      setHasMore(data.hasMore || false);
      setPage(pageNum);
    } catch {
      if (!append) setProducts([]);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, [category, scent, sortBy]);

  // Reset and refetch when filters change
  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  const handleClear = () => {
    setCategory('');
    setScent('');
    setSortBy('name-asc');
  };

  return (
    <div className="collection-page">
      <div className="collection-header">
        <motion.span className="section-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Our Creations
        </motion.span>
        <motion.h1 className="section-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          The Collection
        </motion.h1>
      </div>

      <div className="collection-layout">
        <FilterDrawer
          categories={CATEGORIES}
          scentFamilies={SCENT_FAMILIES}
          selectedCategory={category}
          selectedScent={scent}
          sortBy={sortBy}
          onCategoryChange={setCategory}
          onScentChange={setScent}
          onSortChange={setSortBy}
          onClear={handleClear}
          mobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />

        <div className="collection-content">
          <div className="collection-toolbar">
            <span className="collection-count">
              {loading ? '...' : `${total} Fragrances`}
            </span>
            <button className="filter-mobile-btn" onClick={() => setMobileFilterOpen(true)} id="mobile-filter-btn">
              ✦ Filters
            </button>
          </div>

          {loading ? (
            <div className="grid-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-image" />
                  <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                  <div className="skeleton skeleton-text-lg" style={{ width: '70%' }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No fragrances found</p>
              <button className="btn-gold" onClick={handleClear}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % LIMIT) * 0.03 }}
                  >
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button
                    className="btn-gold"
                    onClick={() => fetchProducts(page + 1, true)}
                    disabled={loadingMore}
                    style={{ opacity: loadingMore ? 0.6 : 1, cursor: loadingMore ? 'not-allowed' : 'pointer' }}
                  >
                    {loadingMore ? 'Loading...' : `Load More (${total - products.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
