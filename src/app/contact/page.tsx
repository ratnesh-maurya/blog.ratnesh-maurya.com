import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
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

const channels = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ratnesh-maurya',
    display: 'linkedin.com/in/ratnesh-maurya',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ratnesh-maurya',
    display: 'github.com/ratnesh-maurya',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/ratnesh_maurya_',
    display: 'x.com/ratnesh_maurya_',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Contact', url: 'https://blog.ratnesh-maurya.com/contact' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('home')} alt="Contact — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <div className="hero-gradient-bg">
          <div className="page-header max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-500)' }}>
              Get in touch
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Contact
            </h1>
            <p className="text-base max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              If you spotted an issue, want to suggest a topic, or want to collaborate — these are the best ways to reach me.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">

          {/* Primary channels */}
          <section>
            <h2 className="nb-section-label mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Primary channels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {channels.map(ch => (
                <a key={ch.label} href={ch.href} target="_blank" rel="noopener noreferrer"
                  className="nb-card flex flex-col items-center gap-3 p-6 transition-all duration-150 hover:-translate-y-1 group"
                  style={{ backgroundColor: 'var(--nb-card-2)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'var(--nb-badge-bg)', color: 'var(--nb-badge-text)' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={ch.icon} />
                    </svg>
                  </div>
                  <span className="text-sm font-bold group-hover:text-[var(--accent-500)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {ch.label}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {ch.display}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* For corrections */}
          <section className="rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--nb-card-1)', border: '2px solid var(--nb-border)', boxShadow: 'var(--nb-shadow)' }}>
            <h2 className="nb-section-label mb-4"
              style={{ color: 'var(--text-muted)' }}>
              For corrections
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              If you found an error in a post (typo, broken command, inaccurate claim), please include the URL and what you think should be changed.
              I track corrections publicly.
            </p>
            <a href="/corrections" className="nb-btn inline-flex items-center gap-1.5 text-sm"
              style={{ backgroundColor: 'var(--nb-card-5)', color: 'var(--text-primary)' }}>
              Read the corrections policy
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
