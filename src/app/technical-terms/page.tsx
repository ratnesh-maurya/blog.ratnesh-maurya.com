import { Metadata } from 'next';
import { getAllTechnicalTermsForListing } from '@/lib/content';
import { BreadcrumbStructuredData, TechnicalTermsStructuredData } from '@/components/StructuredData';
import { TechnicalTermsSearch } from '@/components/TechnicalTermsSearch';

const BASE = 'https://blog.ratnesh-maurya.com';

export const metadata: Metadata = {
  title: 'Technical Terms — Backend & System Design',
  description: 'Definitions and explanations for technical terms: indexing, clustering, CAP theorem, ACID, replication, and more. Backend and system design reference.',
  keywords: ['technical terms', 'system design', 'indexing', 'clustering', 'CAP theorem', 'ACID', 'replication', 'distributed systems', 'backend glossary'],
  alternates: { canonical: `${BASE}/technical-terms` },
  openGraph: {
    title: 'Technical Terms — Backend & System Design',
    description: 'Definitions for indexing, clustering, CAP, ACID, replication, and other backend and system design terms.',
    url: `${BASE}/technical-terms`,
    siteName: 'Ratn Labs',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Terms — Ratn Labs',
    description: 'Definitions for backend and system design technical terms.',
    creator: '@ratnesh_maurya',
  },
  robots: { index: true, follow: true },
};

export default async function TechnicalTermsPage() {
  const terms = await getAllTechnicalTermsForListing();
  const breadcrumbItems = [
    { name: 'Home', url: BASE },
    { name: 'Technical Terms', url: `${BASE}/technical-terms` },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <TechnicalTermsStructuredData terms={terms} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Reference
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Technical{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Terms
              </span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
              Clear definitions and explanations for indexing, databases, distributed systems, and backend concepts — with use cases and trade-offs.
            </p>
            <div className="flex flex-wrap gap-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{terms.length}</span> terms
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TechnicalTermsSearch terms={terms} />
        </div>
      </div>
    </>
  );
}
