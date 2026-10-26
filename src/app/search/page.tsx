import SearchPageClient from '@/app/search/SearchPageClient';
import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Search — Ratn Labs',
  description: 'Search across blog posts, daily news digests, technical terms, cheatsheets, TILs, and silly questions. Find system design, Go, AWS, and backend topics fast →',
  keywords: ['search', 'blog search', 'find articles', 'system design', 'Go', 'backend engineering'],
  alternates: { canonical: `${SITE_URL}/search/`, types: { ...oembedAlternate('/search') } },
  openGraph: {
    title: 'Search — Ratn Labs',
    description: 'Search all blog posts and Q&As on Ratn Labs.',
    url: `${SITE_URL}/search/`,
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('search'), width: 1200, height: 630, alt: 'Search — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search — Ratn Labs',
    description: 'Search all blog posts and Q&As on Ratn Labs.',
    creator: '@ratnesh_maurya',
    site: '@ratnesh_maurya',
    images: [getStoredOgImageUrl('search')],
  },
  robots: { index: true, follow: true },
};

function SearchFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'transparent' }}>
      <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--marigold)', borderTopColor: 'transparent' }} />
    </div>
  );
}

export default function SearchPage() {
  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Search', url: `${SITE_URL}/search` },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('search')} alt="Search — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Suspense fallback={<SearchFallback />}>
        <SearchPageClient />
      </Suspense>
    </>
  );
}
