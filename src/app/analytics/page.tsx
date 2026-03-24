import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { AnalyticsDashboard } from '@/components/analytics/dashboard';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post Analytics — Ratn Labs',
  description: 'Views, upvotes, and engagement analytics across blog, technical terms, silly questions, and cheatsheets.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/analytics', types: { ...oembedAlternate('/analytics') } },
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
      <div className="min-h-screen hero-gradient-bg" style={{ backgroundColor: 'var(--background)' }}>
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
                See how posts perform over time: overall footprint, today&apos;s stats, content leaders, and UTM-driven sessions.
                Drag section headers to reorder the layout to match how you think.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <div
                className="nb-card rounded-2xl px-4 py-3 text-xs sm:text-sm flex flex-col gap-2 lg:min-w-[220px]"
                style={{ backgroundColor: 'var(--nb-card-3)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  How to read this page
                </p>
                <ul className="space-y-1 list-disc pl-4" style={{ color: 'var(--text-secondary)' }}>
                  <li>Use the top cards to check overall health.</li>
                  <li>Use the date pickers to zoom in on launches.</li>
                  <li>Use UTM charts to validate campaigns.</li>
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
