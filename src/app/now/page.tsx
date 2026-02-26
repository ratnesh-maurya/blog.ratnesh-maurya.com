import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Now — What I\'m Up To | Ratn Labs',
  description: 'What Ratnesh Maurya is working on, learning, reading, and thinking about right now. Updated regularly.',
  keywords: ['now page', 'Ratnesh Maurya now', 'what I am working on', 'current projects'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/now' },
  openGraph: {
    title: 'Now — Ratn Labs',
    description: "What I'm working on, learning, and reading right now.",
    url: 'https://blog.ratnesh-maurya.com/now',
    siteName: 'Ratn Labs',
    type: 'profile',
    images: [{ url: getStoredOgImageUrl('now'), width: 1200, height: 630, alt: 'Now — Ratn Labs' }],
  },
  twitter: { card: 'summary_large_image', title: 'Now — Ratn Labs', description: 'What Ratnesh Maurya is working on, learning, and thinking about right now.', creator: '@ratnesh_maurya', site: '@ratnesh_maurya', images: [getStoredOgImageUrl('now')] },
  robots: { index: true, follow: true },
};

import { PageStatsTracker } from '@/components/PageStatsTracker';
import { getNowContent } from '@/lib/static-content';

export default function NowPage() {
  const { lastUpdated, sections } = getNowContent();
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Now', url: 'https://blog.ratnesh-maurya.com/now' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('now')} alt="Now — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              /now
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              What I&apos;m doing now
            </h1>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              A snapshot of what I&apos;m focused on right now. Inspired by{' '}
              <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer"
                className="underline underline-offset-2" style={{ color: 'var(--accent-500)' }}>
                Derek Sivers&apos; now page movement
              </a>.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Last updated: {lastUpdated}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map(section => (
              <section key={section.heading} className="flex gap-5">
                <div className="text-2xl mt-0.5 flex-shrink-0">{section.emoji}</div>
                <div>
                  <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {section.heading}
                  </h2>
                  <ul className="space-y-2">
                    {section.content.map((line, i) => (
                      <li key={i} className="text-sm leading-relaxed flex gap-2"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--accent-400)' }} />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 pt-8 text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <p>
              This page is updated whenever something significant changes. If you want to follow along, subscribe to the{' '}
              <a href="/newsletter" className="underline underline-offset-2" style={{ color: 'var(--accent-500)' }}>
                newsletter
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <PageStatsTracker type="now" slug="now" />
    </>
  );
}
