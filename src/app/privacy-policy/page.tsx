import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { getPrivacyPolicyContent } from '@/lib/static-content';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Ratn Labs',
  description: 'Privacy policy for Ratn Labs (blog.ratnesh-maurya.com). How we collect, use, and protect your information.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/privacy-policy', types: { ...oembedAlternate('/privacy-policy') } },
  openGraph: {
    title: 'Privacy Policy — Ratn Labs',
    description: 'How we collect, use, and protect your information.',
    url: 'https://blog.ratnesh-maurya.com/privacy-policy',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('privacy-policy'), width: 1200, height: 630, alt: 'Privacy Policy — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Ratn Labs',
    description: 'How we collect, use, and protect your information.',
    images: [getStoredOgImageUrl('privacy-policy')],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  const { lastRevised, tldr, sections } = getPrivacyPolicyContent();
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Privacy Policy', url: 'https://blog.ratnesh-maurya.com/privacy-policy' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('privacy-policy')} alt="Privacy Policy — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid var(--nb-border)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-muted)' }}>
              Legal
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Applies to blog.ratnesh-maurya.com · Last revised: {lastRevised}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* TL;DR */}
          <div className="nb-card p-5 mb-10"
            style={{ backgroundColor: 'var(--nb-card-3)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-600)' }}>
              TL;DR
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {tldr}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={section.title} className="nb-card p-6" style={{ backgroundColor: `var(--nb-card-${i % 6})` }}>
                <h2 className="text-base font-bold mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}>
                  <span className="text-xs font-mono w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--nb-badge-bg)', color: 'var(--nb-badge-text)' }}>
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}>
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="mt-12 pt-8 flex flex-wrap gap-4"
            style={{ borderTop: '2px solid var(--nb-border)' }}>
            <Link href="/" className="nb-btn text-sm" style={{ backgroundColor: 'var(--nb-card-5)', color: '#1C1C1A' }}>
              ← Back to blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
