import { Metadata } from 'next';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';

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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-500)' }}>
              Insights
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Post analytics
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Views, upvotes, and engagement across content. Footer total includes only blog, technical terms, silly questions, and cheatsheets.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnalyticsCharts />
        </div>
      </div>
    </>
  );
}
