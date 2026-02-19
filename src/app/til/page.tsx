import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTILEntries } from '@/lib/content';
import { BreadcrumbStructuredData, TILListStructuredData } from '@/components/StructuredData';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Today I Learned — Ratn Labs',
  description: 'Short, practical learnings from real engineering work — Go, PostgreSQL, Kubernetes, AWS, Docker, and backend systems.',
  keywords: ['TIL', 'today I learned', 'Go tips', 'Kubernetes tips', 'PostgreSQL tips', 'AWS tips', 'backend engineering', 'developer learnings'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/til' },
  openGraph: {
    title: 'Today I Learned — Ratn Labs',
    description: 'Short, practical learnings from real engineering work.',
    url: 'https://blog.ratnesh-maurya.com/til',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Today I Learned — Ratn Labs',
    description: 'Short, practical learnings from real engineering work.',
    creator: '@ratnesh_maurya',
  },
  robots: { index: true, follow: true },
};

const categoryEmoji: Record<string, string> = {
  Go: '🐹',
  PostgreSQL: '🐘',
  Kubernetes: '☸️',
  AWS: '☁️',
  Docker: '🐳',
  TypeScript: '🔷',
  Elixir: '💧',
  General: '💡',
};

export default async function TILPage() {
  const entries = await getAllTILEntries();
  const categories = Array.from(new Set(entries.map(e => e.category)));

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'TIL', url: 'https://blog.ratnesh-maurya.com/til' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <TILListStructuredData entries={entries} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Today I Learned
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Short learnings from{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                real engineering
              </span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Small things I learn while building. Not blog posts — just concise notes on gotchas, patterns, and surprises I encounter day-to-day.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{entries.length}</span> entries
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{categories.length}</span> categories
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <span key={cat}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <span>{categoryEmoji[cat] ?? '💡'}</span>
                {cat}
              </span>
            ))}
          </div>

          {/* TIL entries */}
          <div className="space-y-4">
            {entries.map(entry => (
              <Link key={entry.slug} href={`/til/${entry.slug}`}
                className="block group rounded-xl border p-5 transition-all duration-200"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-lg">{categoryEmoji[entry.category] ?? '💡'}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                    {entry.category}
                  </span>
                  <time className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                    {format(new Date(entry.date), 'MMM dd, yyyy')}
                  </time>
                </div>
                <h2 className="text-base font-semibold leading-snug group-hover:text-[var(--accent-500)] transition-colors"
                  style={{ color: 'var(--text-primary)' }}>
                  {entry.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {entry.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              <p className="text-4xl mb-4">📝</p>
              <p className="text-base font-medium">First TIL entry coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
