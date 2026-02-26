import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses — Tools & Setup · Ratn Labs',
  description: "The tools, software, hardware, and services Ratnesh Maurya uses daily as a backend engineer. Editor, terminal, cloud services, and dev workflow.",
  keywords: ['developer setup', 'tools', 'VS Code', 'Go tools', 'backend developer workflow', 'developer productivity', 'Ratnesh Maurya uses'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/uses' },
  openGraph: {
    title: 'Uses — Tools & Setup · Ratn Labs',
    description: "The tools, software, and hardware I use daily as a backend engineer.",
    url: 'https://blog.ratnesh-maurya.com/uses',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('uses'), width: 1200, height: 630, alt: 'Uses — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uses — Tools & Setup · Ratn Labs',
    description: "The tools and setup I use daily as a backend engineer.",
    creator: '@ratnesh_maurya',
    images: [getStoredOgImageUrl('uses')],
  },
  robots: { index: true, follow: true },
};

import { getUsesContent } from '@/lib/static-content';

export default function UsesPage() {
  const { sections } = getUsesContent();
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Uses', url: 'https://blog.ratnesh-maurya.com/uses' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('uses')} alt="Uses — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Setup & tooling
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              Uses
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The tools, software, and services I use daily. Inspired by{' '}
              <a href="https://uses.tech" target="_blank" rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors"
                style={{ color: 'var(--accent-500)' }}>
                uses.tech
              </a>.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {sections.map(section => (
            <section key={section.title}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{section.emoji}</span>
                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </h2>
              </div>
              <div className="space-y-2">
                {section.items.map(item => (
                  <div key={item.name}
                    className="flex items-start gap-4 p-4 rounded-xl border"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold transition-colors"
                            style={{ color: 'var(--text-primary)' }}>
                            {item.name} ↗
                          </a>
                        ) : (
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {item.name}
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Outro */}
          <div className="rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Curious about something not listed? Reach out on{' '}
              <a href="https://x.com/ratnesh_maurya_" target="_blank" rel="noopener noreferrer"
                className="font-medium" style={{ color: 'var(--accent-500)' }}>
                Twitter/X
              </a>{' '}or{' '}
              <a href="https://linkedin.com/in/ratnesh-maurya" target="_blank" rel="noopener noreferrer"
                className="font-medium" style={{ color: 'var(--accent-500)' }}>
                LinkedIn
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
