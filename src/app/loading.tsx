export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="text-center">
        <div
          className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-t-transparent"
          style={{ borderColor: 'var(--accent-300)', borderTopColor: 'transparent' }}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Loading…
        </p>
      </div>
    </div>
  );
}
