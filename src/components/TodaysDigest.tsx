import Link from 'next/link';

interface TodaysDigestProps {
  post: { slug: string; title: string; date: string; tags?: string[] } | undefined;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

/**
 * Homepage CTA banner for the latest daily news digest — the freshest
 * content on the site, published daily, previously buried behind nav.
 */
export function TodaysDigest({ post }: TodaysDigestProps) {
  if (!post) return null;
  const fresh = isToday(post.date);
  const dateLabel = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <section className="pt-8 pb-2" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={`/news/${post.slug}`}
          className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-2xl px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow-sm)',
            backdropFilter: 'blur(10px) saturate(160%)',
            WebkitBackdropFilter: 'blur(10px) saturate(160%)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0 self-start sm:self-auto"
            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-700)', border: '1px solid var(--accent-100)' }}
          >
            {fresh && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: 'var(--accent-400)' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--accent-500)' }} />
              </span>
            )}
            {fresh ? "Today's digest" : `Latest digest · ${dateLabel}`}
          </span>
          <p className="text-sm sm:text-base font-semibold leading-snug flex-1 min-w-0 group-hover:underline line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </p>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold flex-shrink-0"
            style={{ color: 'var(--accent-500)' }}
          >
            Read it
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
