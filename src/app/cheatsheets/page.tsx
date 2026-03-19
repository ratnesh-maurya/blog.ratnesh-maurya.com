import { CheatsheetsListingClient } from '@/components/CheatsheetsListingClient';
import { OgImageInBody } from '@/components/OgImageInBody';
import { SocialShare } from '@/components/SocialShare';
import { BreadcrumbStructuredData, CheatsheetsListStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { getCheatsheet, getCheatsheetSlugs } from '@/lib/static-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cheatsheets — Go, Docker, PostgreSQL, Kubectl',
  description: 'Bookmarkable cheatsheets for Go, Docker, PostgreSQL, and kubectl: commands, syntax, and patterns you need while building. Browse the library →',
  keywords: ['Go cheatsheet', 'Docker cheatsheet', 'PostgreSQL cheatsheet', 'kubectl cheatsheet', 'Kubernetes commands', 'Go syntax', 'backend reference'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets/', types: { ...oembedAlternate('/cheatsheets') } },
  openGraph: {
    title: 'Cheatsheets — Ratn Labs',
    description: 'Quick reference for Go, Docker, PostgreSQL, and Kubernetes.',
    url: 'https://blog.ratnesh-maurya.com/cheatsheets/',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('cheatsheets'), width: 1200, height: 630, alt: 'Cheatsheets' }],
  },
  twitter: { card: 'summary_large_image', title: 'Cheatsheets — Ratn Labs', description: 'Quick reference cheatsheets for Go, Docker, PostgreSQL, and kubectl.', creator: '@ratnesh_maurya', site: '@ratnesh_maurya', images: [getStoredOgImageUrl('cheatsheets')] },
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
      <CheatsheetsListStructuredData sheets={sheets} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="hero-gradient-bg">
          <div className="page-header max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Quick Reference
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Cheatsheets
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              The commands and syntax I look up most. Bookmarkable quick references for the tools in my daily stack.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                {sheets.length} cheatsheets
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <CheatsheetsListingClient sheets={sheets} />
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)' }}>
              Share this page
            </h2>
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
