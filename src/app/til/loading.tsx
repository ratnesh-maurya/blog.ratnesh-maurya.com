export default function TILLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse mb-10">
          <div className="h-8 rounded-lg w-48 mb-3" style={{ backgroundColor: 'var(--surface-muted)' }} />
          <div className="h-4 rounded-lg w-80" style={{ backgroundColor: 'var(--surface-muted)' }} />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="rounded-xl border p-5 animate-pulse" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--surface-muted)' }} />
              <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--surface-muted)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
