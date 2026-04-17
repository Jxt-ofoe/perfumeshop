'use client';

import { motion } from 'framer-motion';

export default function StorySection() {
  return (
    <section id="story" className="section-padding story-section">
      <div className="story-layout">
        <motion.h2
          className="story-quote"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          &ldquo;Perfume is the unseen, unforgettable, ultimate accessory of
          haute couture.&rdquo;
        </motion.h2>

        <motion.div
          className="story-text"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p>
            Born in the heart of Grasse, France, Velour represents the pinnacle
            of artisanal perfumery. Our master noses blend the rarest ingredients
            sourced from around the globe, creating olfactive journeys that
            transcend time.
          </p>
          <p>
            Each flacon is a testament to our heritage — a delicate balance of
            traditional craftsmanship and avant-garde composition. We do not
            merely create fragrances; we bottle emotion.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
