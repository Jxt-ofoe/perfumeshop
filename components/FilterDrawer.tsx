'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface FilterDrawerProps {
  categories: string[];
  scentFamilies: string[];
  selectedCategory: string;
  selectedScent: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onScentChange: (scent: string) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function FilterDrawer({
  categories,
  scentFamilies,
  selectedCategory,
  selectedScent,
  sortBy,
  onCategoryChange,
  onScentChange,
  onSortChange,
  onClear,
  mobileOpen = false,
  onMobileClose,
}: FilterDrawerProps) {
  const filterContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontStyle: 'italic', fontSize: '1.3rem' }}>Filters</h2>
        <button className="filter-clear" onClick={onClear}>
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <h3>Category</h3>
        <div
          className={`filter-option ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onCategoryChange('')}
        >
          <span className="filter-radio" />
          All Categories
        </div>
        {categories.map((cat) => (
          <div
            key={cat}
            className={`filter-option ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            <span className="filter-radio" />
            {cat}
          </div>
        ))}
      </div>

      <div className="filter-group">
        <h3>Scent Family</h3>
        <div
          className={`filter-option ${selectedScent === '' ? 'active' : ''}`}
          onClick={() => onScentChange('')}
        >
          <span className="filter-radio" />
          All Families
        </div>
        {scentFamilies.map((scent) => (
          <div
            key={scent}
            className={`filter-option ${selectedScent === scent ? 'active' : ''}`}
            onClick={() => onScentChange(scent)}
          >
            <span className="filter-radio" />
            {scent}
          </div>
        ))}
      </div>

      <div className="filter-group">
        <h3>Sort By</h3>
        {[
          { value: 'name-asc', label: 'Name A-Z' },
          { value: 'name-desc', label: 'Name Z-A' },
          { value: 'price-asc', label: 'Price: Low to High' },
          { value: 'price-desc', label: 'Price: High to Low' },
          { value: 'newest', label: 'Newest First' },
        ].map((opt) => (
          <div
            key={opt.value}
            className={`filter-option ${sortBy === opt.value ? 'active' : ''}`}
            onClick={() => onSortChange(opt.value)}
          >
            <span className="filter-radio" />
            {opt.label}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="filter-sidebar">{filterContent}</div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="filter-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.div
              className="filter-drawer-mobile"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="filter-drawer-handle" />
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
