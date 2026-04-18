'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import FilterDrawer from '@/components/FilterDrawer';
import type { Product } from '@/lib/types';

const CATEGORIES = ['Eau de Parfum', 'Extrait de Parfum'];
const SCENT_FAMILIES = ['Floral', 'Woody', 'Oriental', 'Fresh', 'Gourmand'];

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const initialScent = searchParams.get('scent') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [scent, setScent] = useState(initialScent);
  const [sortBy, setSortBy] = useState('name-asc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (scent) params.set('scent', scent);
        if (sortBy) params.set('sort', sortBy);
        params.set('limit', '50');

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, scent, sortBy]);

  const handleClear = () => {
    setCategory('');
    setScent('');
    setSortBy('name-asc');
  };

  return (
    <div className="collection-page">
      <div className="collection-header">
        <motion.span
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Our Creations
        </motion.span>
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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

            <button
              className="filter-mobile-btn"
              onClick={() => setMobileFilterOpen(true)}
              id="mobile-filter-btn"
            >
              ✦ Filters
            </button>

            <select
              className="collection-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
              style={{ display: 'none' }}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <div className="grid-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-image" />
                  <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                  <div className="skeleton skeleton-text-lg" style={{ width: '70%' }} />
                  <div className="skeleton skeleton-text-sm" style={{ width: '85%' }} />
                  <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
                  <div className="skeleton skeleton-text-sm" style={{ width: '75%' }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No fragrances found</p>
              <button className="btn-gold" onClick={handleClear}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
