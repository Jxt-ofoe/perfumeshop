export default function ProductLoading() {
  return (
    <div className="product-detail section-padding">
      <div className="product-detail-layout">
        <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4' }} />
        <div style={{ padding: '2rem 0' }}>
          <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '1rem' }} />
          <div className="skeleton skeleton-text-lg" style={{ width: '80%', height: '36px', marginBottom: '1rem' }} />
          <div className="skeleton skeleton-text-lg" style={{ width: '30%', height: '24px', marginBottom: '2rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '80px', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '160px', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
