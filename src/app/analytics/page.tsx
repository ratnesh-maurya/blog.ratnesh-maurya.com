import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { AnalyticsDashboard } from '@/components/analytics/dashboard';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post Analytics — Ratn Labs',
  description: 'Views, upvotes, and engagement analytics across blog, technical terms, silly questions, and cheatsheets.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/analytics', types: { ...oembedAlternate('/analytics') } },
  openGraph: {
    title: 'Post Analytics — Ratn Labs',
    description: 'Public, transparent traffic stats for this site.',
    url: 'https://blog.ratnesh-maurya.com/analytics',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('analytics'), width: 1200, height: 630, alt: 'Post Analytics — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Post Analytics — Ratn Labs',
    description: 'Public, transparent traffic stats for this site.',
    images: [getStoredOgImageUrl('analytics')],
  },
  robots: { index: false, follow: true },
};

const breadcrumbItems = [
  { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
  { name: 'Analytics', url: 'https://blog.ratnesh-maurya.com/analytics' },
];

export default function AnalyticsPage() {
  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen hero-gradient-bg" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="nb-section-label mb-2" style={{ color: 'var(--accent-500)' }}>
                Insights
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                Analytics dashboard
              </h1>
              <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                How many people read this site, where they come from, and what they read. The numbers are public and
                update live. The summary below answers the main question; open any section below it for details.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <div
                className="nb-card rounded-2xl px-4 py-3 text-xs sm:text-sm flex flex-col gap-2 lg:min-w-[220px]"
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow-sm)',
                  backdropFilter: 'blur(10px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                }}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  How to use this page
                </p>
                <ul className="space-y-1 list-disc pl-4" style={{ color: 'var(--text-secondary)' }}>
                  <li>Start with the summary: it says how this week compares with last.</li>
                  <li>Use the bar to jump between parts, or filter by type of content.</li>
                  <li>Click a section title to open or close it. Unsure about a word? See &quot;What do these terms mean?&quot; at the bottom.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  );
}
