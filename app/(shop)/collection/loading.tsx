import SkeletonCard from '@/components/SkeletonCard';

export default function CollectionLoading() {
  return (
    <div className="collection-page">
      <div className="collection-header">
        <span className="section-subtitle" style={{ opacity: 0.5 }}>
          Our Creations
        </span>
        <h1 className="section-title" style={{ opacity: 0.5 }}>
          The Collection
        </h1>
      </div>

      <div style={{ padding: '0 5% 5rem' }}>
        <div className="grid-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
