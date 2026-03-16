export default function TermsLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse mb-10">
          <div className="h-8 rounded-lg w-56 mb-3" style={{ backgroundColor: 'var(--surface-muted)' }} />
          <div className="h-4 rounded-lg w-96" style={{ backgroundColor: 'var(--surface-muted)' }} />
        </div>
        <div className="animate-pulse mb-6">
          <div className="h-10 rounded-xl w-full" style={{ backgroundColor: 'var(--surface-muted)' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border p-5 animate-pulse" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="h-4 rounded w-2/3 mb-2" style={{ backgroundColor: 'var(--surface-muted)' }} />
              <div className="h-3 rounded w-full" style={{ backgroundColor: 'var(--surface-muted)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
