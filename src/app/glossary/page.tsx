import { Metadata } from 'next';
import { BreadcrumbStructuredData, GlossaryStructuredData } from '@/components/StructuredData';
import { getGlossaryContent } from '@/lib/static-content';

export const metadata: Metadata = {
  title: 'Glossary — Backend & System Design Terms | Ratn Labs',
  description: 'Definitions for common backend engineering, system design, Go, and distributed systems terms. Clear explanations with real-world context.',
  keywords: ['backend glossary', 'system design terms', 'distributed systems glossary', 'Go terms', 'CAP theorem', 'idempotency', 'microservices', 'inode', 'ACID', 'event sourcing'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/glossary' },
  openGraph: {
    title: 'Glossary — Backend & System Design Terms | Ratn Labs',
    description: 'Clear definitions for common backend, system design, and distributed systems terms.',
    url: 'https://blog.ratnesh-maurya.com/glossary',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Glossary — Backend Terms | Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

export default function GlossaryPage() {
  const { terms } = getGlossaryContent();
  const allTerms = terms.flatMap(c => c.items);
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Glossary', url: 'https://blog.ratnesh-maurya.com/glossary' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <GlossaryStructuredData terms={terms} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Reference
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Engineering{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Glossary
              </span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl mb-6" style={{ color: 'var(--text-secondary)' }}>
              Clear definitions for backend, system design, Go, and distributed systems terms — with real-world context, not just dictionary copy.
            </p>
            <div className="flex flex-wrap gap-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{allTerms.length}</span> terms
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{terms.length}</span> categories
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {terms.map(cat => (
            <section key={cat.category} id={cat.category.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: 'var(--text-muted)' }}>
                {cat.category}
              </h2>
              <div className="space-y-4">
                {cat.items.map(item => (
                  <div key={item.term}
                    id={item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    className="rounded-xl border p-5"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {item.term}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.def}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
