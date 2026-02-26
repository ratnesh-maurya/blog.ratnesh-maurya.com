import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { AnalyticsDashboard } from '@/components/analytics/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post Analytics — Ratn Labs',
  description: 'Views, upvotes, and engagement analytics across blog, technical terms, silly questions, and cheatsheets.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/analytics' },
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="hero-gradient-bg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-500)' }}>
              Insights
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 font-serif" style={{ color: 'var(--text-primary)' }}>
              Analytics
            </h1>
            <p className="text-base leading-relaxed max-w-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
              Overall and today&apos;s metrics, post views by date range, and UTM traffic. Drag section headers to reorder.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Each section can have its own date range where applicable.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  );
}
