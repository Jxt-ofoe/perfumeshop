'use client';

import Link from 'next/link';

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '7rem 5%',
      }}
    >
      <h1
        className="section-title"
        style={{ fontSize: '2rem', marginBottom: '1rem' }}
      >
        Product not found
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        The fragrance you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-gold" onClick={reset}>
          Try Again
        </button>
        <Link href="/collection" className="btn-gold">
          View Collection
        </Link>
      </div>
    </div>
  );
}
