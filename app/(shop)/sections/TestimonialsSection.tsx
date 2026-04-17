'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    text: "Nuit d'Or is simply intoxicating. It evolves perfectly on my skin, leaving an unforgettable trail that constantly draws compliments.",
    author: 'E. Sinclair',
  },
  {
    text: 'I have finally found my signature scent. The craftsmanship is evident from the first spray. Velour truly understands luxury.',
    author: 'M. Laurent',
  },
  {
    text: 'A masterpiece in a bottle. The complexity of Bois Cendré completely transformed my perception of modern perfumery.',
    author: 'A. Dupont',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding testimonials-section">
      <motion.span
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Whispers
      </motion.span>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Client Experiences
      </motion.h2>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="testimonial"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <span className="quote-mark">&ldquo;</span>
            <p className="testimonial-text">{t.text}</p>
            <span className="testimonial-author">— {t.author}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
