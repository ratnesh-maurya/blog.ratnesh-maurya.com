export default function BlogLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 rounded-lg w-64 mx-auto mb-4" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
          <div className="h-5 rounded-lg w-96 mx-auto" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 animate-pulse"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="h-3 rounded w-20 mb-4" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
              <div className="h-5 rounded w-full mb-3" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
              <div className="h-4 rounded w-full mb-2" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
              <div className="h-4 rounded w-3/4 mb-5" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
              <div className="flex gap-2">
                <div className="h-5 rounded-full w-14" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
                <div className="h-5 rounded-full w-14" style={{ backgroundColor: 'var(--surface-muted)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
