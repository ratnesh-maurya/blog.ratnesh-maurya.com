import { Metadata } from 'next';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getCheatsheetSlugs, getCheatsheet } from '@/lib/static-content';
import { CheatsheetsListingClient } from '@/components/CheatsheetsListingClient';
import { SocialShare } from '@/components/SocialShare';
import { OgImageInBody } from '@/components/OgImageInBody';
import { getStoredOgImageUrl } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Cheatsheets — Go, Docker, PostgreSQL, Kubectl | Ratn Labs',
  description: 'Quick reference cheatsheets for Go, Docker, PostgreSQL, and Kubernetes kubectl. Commands, syntax, and patterns you need while building.',
  keywords: ['Go cheatsheet', 'Docker cheatsheet', 'PostgreSQL cheatsheet', 'kubectl cheatsheet', 'Kubernetes commands', 'Go syntax', 'backend reference'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets' },
  openGraph: {
    title: 'Cheatsheets — Ratn Labs',
    description: 'Quick reference for Go, Docker, PostgreSQL, and Kubernetes.',
    url: 'https://blog.ratnesh-maurya.com/cheatsheets',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('cheatsheets'), width: 1200, height: 630, alt: 'Cheatsheets' }],
  },
  twitter: { card: 'summary_large_image', title: 'Cheatsheets — Ratn Labs', creator: '@ratnesh_maurya', images: [getStoredOgImageUrl('cheatsheets')] },
  robots: { index: true, follow: true },
};

export default function CheatsheetsPage() {
  const slugs = getCheatsheetSlugs();
  const sheets = slugs.map((slug) => {
    const data = getCheatsheet(slug);
    return data
      ? {
          slug,
          title: data.title.split(' ')[0] ?? data.title,
          subtitle: data.subtitle ?? '',
          emoji: data.emoji ?? '📄',
          tags: data.keywords ?? [],
        }
      : null;
  }).filter(Boolean) as Array<{ slug: string; title: string; subtitle: string; emoji: string; tags: string[] }>;
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Cheatsheets', url: 'https://blog.ratnesh-maurya.com/cheatsheets' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('cheatsheets')} alt="Cheatsheets" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Quick Reference
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Cheatsheets
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              The commands and syntax I look up most. Bookmarkable quick references for the tools in my daily stack.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CheatsheetsListingClient sheets={sheets} />
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)' }}>
              Share this page
            </h3>
            <SocialShare
              url="/cheatsheets"
              title="Cheatsheets — Go, Docker, PostgreSQL, Kubectl | Ratn Labs"
              description="Quick reference cheatsheets for Go, Docker, PostgreSQL, and Kubernetes kubectl."
            />
          </div>
        </div>
      </div>
    </>
  );
}
