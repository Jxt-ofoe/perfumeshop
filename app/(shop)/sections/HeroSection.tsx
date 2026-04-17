'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        Scent is the <span>language</span> of memory.
      </motion.h1>

      <motion.p
        className="hero-subtext"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        Discover artisanal French perfumery
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.9 }}
      >
        <Link href="/collection" className="btn-gold" id="hero-cta">
          Explore Collection
        </Link>
      </motion.div>
    </section>
  );
}
