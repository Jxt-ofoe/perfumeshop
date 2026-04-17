'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ScentFamily {
  name: string;
  icon: string;
  slug: string;
}

const families: ScentFamily[] = [
  { name: 'All', icon: '✦', slug: '' },
  { name: 'Floral', icon: '❁', slug: 'Floral' },
  { name: 'Woody', icon: '🌲', slug: 'Woody' },
  { name: 'Oriental', icon: '✨', slug: 'Oriental' },
  { name: 'Fresh', icon: '🌊', slug: 'Fresh' },
  { name: 'Gourmand', icon: '🍰', slug: 'Gourmand' },
];

export default function FamiliesSection() {
  const [active, setActive] = useState('');

  return (
    <section id="families" className="section-padding">
      <motion.span
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Olfactive Universe
      </motion.span>

      <motion.h2
        className="section-title"
        style={{ marginBottom: '2.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Explore Families
      </motion.h2>

      <div className="families-scroller">
        {families.map((family, i) => (
          <motion.div
            key={family.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={family.slug ? `/collection?scent=${family.slug}` : '/collection'}
              className={`family-pill ${active === family.slug ? 'active' : ''}`}
              onMouseEnter={() => setActive(family.slug)}
              id={`family-pill-${family.name.toLowerCase()}`}
            >
              <span className="family-icon">{family.icon}</span>
              <span className="family-name">{family.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        style={{ textAlign: 'center', marginTop: '3rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/collection" className="btn-gold" id="explore-collection-cta">
          Explore Full Collection
        </Link>
      </motion.div>
    </section>
  );
}
