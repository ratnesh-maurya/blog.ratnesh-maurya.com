import Link from 'next/link';

/**
 * In-article newsletter CTA — placed after the article body so it appears
 * exactly when a reader has finished the piece.
 */
export function NewsletterCta() {
  return (
    <div
      className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      style={{
        background: 'linear-gradient(135deg, var(--glass-bg) 0%, color-mix(in srgb, var(--accent-50) 55%, var(--glass-bg)) 100%)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow-sm)',
        backdropFilter: 'blur(10px) saturate(160%)',
        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
      }}
    >
      <div>
        <p className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Enjoyed this one?
        </p>
        <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
          Get new deep dives on backend, distributed systems, and AI engineering — no noise, unsubscribe anytime.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/newsletter?utm_source=blog&utm_medium=inline-cta"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--accent-500)', color: '#fff' }}
        >
          Subscribe
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        <Link
          href="/feed.xml"
          className="text-sm font-semibold px-4 py-2.5 rounded-full"
          style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}
        >
          RSS
        </Link>
      </div>
    </div>
  );
}
