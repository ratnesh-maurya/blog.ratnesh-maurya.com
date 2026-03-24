import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corrections Policy — Ratn Labs',
  description: 'How Ratn Labs handles corrections, updates, and reader-reported issues.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/corrections', types: { ...oembedAlternate('/corrections') } },
  openGraph: {
    title: 'Corrections Policy — Ratn Labs',
    description: 'How Ratn Labs handles corrections, updates, and reader-reported issues.',
    url: 'https://blog.ratnesh-maurya.com/corrections',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('home'), width: 1200, height: 630, alt: 'Corrections Policy — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corrections Policy — Ratn Labs',
    description: 'How Ratn Labs handles corrections, updates, and reader-reported issues.',
    images: [getStoredOgImageUrl('home')],
  },
  robots: { index: true, follow: true },
};

export default function CorrectionsPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Corrections', url: 'https://blog.ratnesh-maurya.com/corrections' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('home')} alt="Corrections — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div style={{ borderBottom: '2px solid var(--nb-border)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Transparency
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Corrections policy
            </h1>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Engineering content can go stale. This policy explains how issues are reported, fixed, and documented.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-0)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              What counts as a correction
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Factual inaccuracies or misleading statements.</li>
              <li>Broken commands, code, links, or configuration examples.</li>
              <li>Material version drift (an approach no longer works as written).</li>
            </ul>
          </section>

          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-1)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              How to report an issue
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Send the URL, the problematic snippet (quote or screenshot), and what you believe is correct.
            </p>
            <div className="mt-4">
              <a href="/contact" className="nb-btn text-sm" style={{ backgroundColor: 'var(--nb-card-5)', color: 'var(--text-primary)' }}>
                Contact →
              </a>
            </div>
          </section>

          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-2)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              How updates are shown
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Small fixes (typos, broken links) may be applied silently.</li>
              <li>Material corrections should be noted in the post (e.g. an “Update” section or a short changelog line).</li>
              <li>If a post becomes fundamentally incorrect, it may be revised heavily or archived with a clear note.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
