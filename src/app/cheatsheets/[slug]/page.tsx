import { CheatsheetCodeBlock } from '@/components/CheatsheetCodeBlock';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { OgImageInBody } from '@/components/OgImageInBody';
import { SocialShare } from '@/components/SocialShare';
import { BreadcrumbStructuredData, CheatsheetStructuredData } from '@/components/StructuredData';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { getStoredOgImageUrl } from '@/lib/og';
import { getCheatsheet, getCheatsheetSlugs } from '@/lib/static-content';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const BASE = 'https://blog.ratnesh-maurya.com';

export async function generateStaticParams() {
  return getCheatsheetSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getCheatsheet(slug);
  if (!data) return { title: 'Not Found' };
  const url = `${BASE}/cheatsheets/${slug}`;
  const ogTitle = data.title.includes(' — ') ? data.title.split(' — ')[0] + ' — Ratn Labs' : data.title + ' — Ratn Labs';
  return {
    title: `${data.title} | Ratn Labs`,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      url,
      siteName: 'Ratn Labs',
      type: 'article',
      images: [{ url: getStoredOgImageUrl('cheatsheet', slug), width: 1200, height: 630, alt: data.title }],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, creator: '@ratnesh_maurya', images: [getStoredOgImageUrl('cheatsheet', slug)] },
    robots: { index: true, follow: true },
  };
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getCheatsheet(slug);
  if (!data) notFound();

  const displayTitle = data.title.includes(' — ') ? data.title.split(' — ')[0] : data.title;
  const breadcrumbItems = [
    { name: 'Home', url: BASE },
    { name: 'Cheatsheets', url: `${BASE}/cheatsheets` },
    { name: displayTitle, url: `${BASE}/cheatsheets/${slug}` },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('cheatsheet', slug)} alt={data.title} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CheatsheetStructuredData
        title={data.title}
        description={data.description}
        slug={slug}
        keywords={data.keywords}
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <Link href="/cheatsheets" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Cheatsheets
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <span className="text-4xl">{data.emoji ?? '📄'}</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {displayTitle}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {data.subtitle ?? ''}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {data.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}>
                  {section.title}
                </h2>
                <CheatsheetCodeBlock code={section.code} title={section.title} />
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)' }}>
              Share this cheatsheet
            </h3>
            <SocialShare
              url={`/cheatsheets/${slug}`}
              title={data.title}
              description={data.description}
            />
          </div>
        </div>
      </div>
      <ViewIncrementer type="cheatsheets" slug={slug} />
      <FloatingUpvoteButton type="cheatsheets" slug={slug} />
    </>
  );
}
