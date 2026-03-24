import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial Policy — Ratn Labs',
  description: 'How Ratn Labs publishes and maintains engineering content: sourcing, accuracy, updates, and disclosure.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/editorial-policy', types: { ...oembedAlternate('/editorial-policy') } },
  openGraph: {
    title: 'Editorial Policy — Ratn Labs',
    description: 'How Ratn Labs publishes and maintains engineering content: sourcing, accuracy, updates, and disclosure.',
    url: 'https://blog.ratnesh-maurya.com/editorial-policy',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('home'), width: 1200, height: 630, alt: 'Editorial Policy — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Policy — Ratn Labs',
    description: 'How Ratn Labs publishes and maintains engineering content: sourcing, accuracy, updates, and disclosure.',
    images: [getStoredOgImageUrl('home')],
  },
  robots: { index: true, follow: true },
};

export default function EditorialPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Editorial Policy', url: 'https://blog.ratnesh-maurya.com/editorial-policy' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('home')} alt="Editorial Policy — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div style={{ borderBottom: '2px solid var(--nb-border)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Transparency
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Editorial policy
            </h1>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              This page explains how content is written, reviewed, updated, and corrected on Ratn Labs.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-0)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              What gets published
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Engineering notes from real projects: backend architecture, distributed systems, infra, and AI engineering.</li>
              <li>Cheatsheets and technical terms intended to be practical while building.</li>
              <li>Postmortem-style “what went wrong” writeups when the lesson is transferable.</li>
            </ul>
          </section>

          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-1)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Accuracy & sourcing
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>Claims are intended to match what is visible in the article (code, benchmarks, diagrams, or linked references).</li>
              <li>When a post references external facts (e.g. documentation, RFCs), links are provided where reasonable.</li>
              <li>Examples are tested when feasible, and revised if behavior changes across versions.</li>
            </ul>
          </section>

          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-2)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Updates & corrections
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              If something is wrong or outdated, I prefer fixing it quickly and noting the change. See the corrections policy for how updates are tracked.
            </p>
            <div className="mt-4">
              <a href="/corrections" className="nb-btn text-sm" style={{ backgroundColor: 'var(--nb-card-5)', color: 'var(--text-primary)' }}>
                Read the corrections policy →
              </a>
            </div>
          </section>

          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-3)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Disclosures
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>If a post includes affiliate links or sponsorships in the future, it will be clearly labeled on the page.</li>
              <li>Product mentions are not endorsements unless explicitly stated.</li>
            </ul>
          </section>

          <section className="nb-card p-6" style={{ backgroundColor: 'var(--nb-card-4)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Contact
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              If you want to report an issue or suggest an improvement, use the contact page.
            </p>
            <div className="mt-4">
              <a href="/contact" className="nb-btn text-sm" style={{ backgroundColor: 'var(--nb-card-5)', color: 'var(--text-primary)' }}>
                Contact →
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
