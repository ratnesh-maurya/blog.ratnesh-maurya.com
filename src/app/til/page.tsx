import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData, TILListStructuredData } from '@/components/StructuredData';
import { TILListingClient } from '@/components/TILListingClient';
import { getAllTILEntries } from '@/lib/content';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';

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
    images: [{ url: getStoredOgImageUrl('til'), width: 1200, height: 630, alt: 'Today I Learned' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Today I Learned — Ratn Labs',
    description: 'Short, practical learnings from real engineering work.',
    creator: '@ratnesh_maurya',
    site: '@ratnesh_maurya',
    images: [getStoredOgImageUrl('til')],
  },
  robots: { index: true, follow: true },
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
      <OgImageInBody src={getStoredOgImageUrl('til')} alt="Today I Learned" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <TILListStructuredData entries={entries} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Today I Learned
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TILListingClient entries={entries} categories={categories} />
        </div>
      </div>
    </>
  );
}
