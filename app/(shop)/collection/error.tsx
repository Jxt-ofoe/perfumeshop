'use client';

import Link from 'next/link';

export default function CollectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="collection-page"
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
        Something went wrong
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        We couldn&apos;t load the collection. Please try again.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-gold" onClick={reset}>
          Try Again
        </button>
        <Link href="/" className="btn-gold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
