'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  return (
    <section id="collection" className="section-padding">
      <motion.span
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Exquisite Creations
      </motion.span>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        The Signature Collection
      </motion.h2>

      <div className="grid-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </div>

      <motion.div
        style={{ textAlign: 'center', marginTop: '4rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Link href="/collection" className="btn-gold" id="view-all-cta">
          View All Fragrances
        </Link>
      </motion.div>
    </section>
  );
}
