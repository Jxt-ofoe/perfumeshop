'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Welcome to the inner circle', {
        description: `Confirmation sent to ${email}`,
      });
      setEmail('');
    }
  };

  return (
    <section id="contact" className="section-padding newsletter-section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Join the Inner Circle
      </motion.h2>

      <motion.p
        style={{ color: 'rgba(245,240,232,0.7)', marginTop: '1rem', textAlign: 'center' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Receive exclusive invites to private clearings and new releases.
      </motion.p>

      <motion.form
        className="newsletter-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="email"
          className="newsletter-input"
          placeholder="Your Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="newsletter-email-input"
        />
        <button type="submit" className="newsletter-btn" id="newsletter-submit-btn">
          Subscribe
        </button>
      </motion.form>
    </section>
  );
}
