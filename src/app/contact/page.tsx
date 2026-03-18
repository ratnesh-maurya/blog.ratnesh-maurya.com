import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { OgImageInBody } from '@/components/OgImageInBody';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Ratn Labs',
  description: 'Contact Ratnesh Maurya (Ratn Labs). Ways to reach out about writing, backend engineering, system design, and collaboration.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/contact', types: { ...oembedAlternate('/contact') } },
  openGraph: {
    title: 'Contact — Ratn Labs',
    description: 'Ways to reach out about writing, backend engineering, system design, and collaboration.',
    url: 'https://blog.ratnesh-maurya.com/contact',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('home'), width: 1200, height: 630, alt: 'Contact — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — Ratn Labs',
    description: 'Ways to reach out about writing, backend engineering, system design, and collaboration.',
    images: [getStoredOgImageUrl('home')],
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Contact', url: 'https://blog.ratnesh-maurya.com/contact' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('home')} alt="Contact — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Get in touch
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Contact
            </h1>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              If you spotted an issue, want to suggest a topic, or want to collaborate—these are the best ways to reach me.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <section className="card p-6 border-0" style={{ backgroundColor: 'var(--surface)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Primary channels
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>LinkedIn</span>{' '}
                — <a className="underline" style={{ color: 'var(--accent-600)' }} href="https://linkedin.com/in/ratnesh-maurya" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/ratnesh-maurya
                </a>
              </li>
              <li>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>GitHub</span>{' '}
                — <a className="underline" style={{ color: 'var(--accent-600)' }} href="https://github.com/ratnesh-maurya" target="_blank" rel="noopener noreferrer">
                  github.com/ratnesh-maurya
                </a>
              </li>
              <li>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>X</span>{' '}
                — <a className="underline" style={{ color: 'var(--accent-600)' }} href="https://x.com/ratnesh_maurya_" target="_blank" rel="noopener noreferrer">
                  x.com/ratnesh_maurya_
                </a>
              </li>
            </ul>
          </section>

          <section className="card p-6 border-0" style={{ backgroundColor: 'var(--surface)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              For corrections
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              If you found an error in a post (typo, broken command, inaccurate claim), please include the URL and what you think should be changed.
              I track corrections publicly.
            </p>
            <div className="mt-4">
              <a href="/corrections" className="text-sm font-semibold" style={{ color: 'var(--accent-500)' }}>
                Read the corrections policy →
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

