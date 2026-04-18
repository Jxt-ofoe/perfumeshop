export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      <div className="skeleton skeleton-text-lg" style={{ width: '70%' }} />
      <div className="skeleton skeleton-text-sm" style={{ width: '85%' }} />
      <div className="skeleton skeleton-text-sm" style={{ width: '80%' }} />
      <div className="skeleton skeleton-text-sm" style={{ width: '75%' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(201,169,110,0.1)',
        }}
      >
        <div className="skeleton skeleton-text" style={{ width: '60px' }} />
        <div className="skeleton skeleton-text" style={{ width: '90px', height: '32px' }} />
      </div>
    </div>
  );
}
