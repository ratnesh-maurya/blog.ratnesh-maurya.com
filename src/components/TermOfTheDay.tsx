import Link from 'next/link';

interface TermOfTheDayProps {
  terms: Array<{ slug: string; title: string; description?: string }>;
}

/**
 * Homepage module surfacing one glossary term per day (deterministic
 * pick by day-of-year, so it's stable across builds within a day).
 */
export function TermOfTheDay({ terms }: TermOfTheDayProps) {
  if (terms.length === 0) return null;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const term = terms[dayOfYear % terms.length];

  return (
    <section className="py-16" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, var(--glass-bg) 0%, color-mix(in srgb, var(--accent-50) 60%, var(--glass-bg)) 100%)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow-sm)',
            backdropFilter: 'blur(10px) saturate(160%)',
            WebkitBackdropFilter: 'blur(10px) saturate(160%)',
          }}
        >
          <div className="min-w-0">
            <p className="nb-section-label mb-2" style={{ color: 'var(--accent-500)' }}>
              Term of the day
            </p>
            <Link href={`/technical-terms/${term.slug}`} className="group">
              <h2
                className="text-2xl sm:text-3xl font-black tracking-tight mb-2 group-hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {term.title}
              </h2>
            </Link>
            {term.description && (
              <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                {term.description}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Link
              href={`/technical-terms/${term.slug}`}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--accent-500)', color: '#fff' }}
            >
              Read the definition
            </Link>
            <Link
              href="/technical-terms"
              className="inline-flex items-center justify-center text-sm font-semibold px-5 py-2.5 rounded-full"
              style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}
            >
              Browse all {terms.length} terms
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
