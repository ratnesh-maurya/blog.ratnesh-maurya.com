import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTechnicalTerm, getTechnicalTermSlugs, getAllTechnicalTerms } from '@/lib/content';
import { BreadcrumbStructuredData, TechnicalTermFAQStructuredData } from '@/components/StructuredData';
import { PostNavigation } from '@/components/PostNavigation';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { SocialShare } from '@/components/SocialShare';
import { OgImageInBody } from '@/components/OgImageInBody';
import { getStoredOgImageUrl } from '@/lib/og';

const BASE = 'https://blog.ratnesh-maurya.com';

export async function generateStaticParams() {
  return getTechnicalTermSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTechnicalTerm(slug);
  if (!term) return { title: 'Not Found' };
  const url = `${BASE}/technical-terms/${slug}`;
  const title = `${term.title} | Technical Terms`;
  const ogImage = getStoredOgImageUrl('technical-term', slug);
  return {
    title,
    description: term.description,
    alternates: { canonical: url },
    openGraph: {
      title: term.title,
      description: term.description,
      url,
      siteName: 'Ratn Labs',
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: term.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: term.title,
      description: term.description,
      creator: '@ratnesh_maurya',
      ...(ogImage && { images: [ogImage] }),
    },
    robots: { index: true, follow: true },
  };
}

export default async function TechnicalTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [term, allTerms] = await Promise.all([
    getTechnicalTerm(slug),
    getAllTechnicalTerms(),
  ]);
  if (!term) notFound();

  const index = allTerms.findIndex((t) => t.slug === slug);
  const prevTerm = index > 0 ? allTerms[index - 1] : null;
  const nextTerm = index >= 0 && index < allTerms.length - 1 ? allTerms[index + 1] : null;

  const breadcrumbItems = [
    { name: 'Home', url: BASE },
    { name: 'Technical Terms', url: `${BASE}/technical-terms` },
    { name: term.title, url: `${BASE}/technical-terms/${slug}` },
  ];

  const termUrl = `${BASE}/technical-terms/${slug}`;

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('technical-term', slug)} alt={term.title} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {term.questions && term.questions.length > 0 && (
        <TechnicalTermFAQStructuredData
          termTitle={term.title}
          termUrl={termUrl}
          faq={term.questions}
        />
      )}
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <Link
            href="/technical-terms"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Technical Terms
          </Link>

          <article>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: term.content }}
            />
          </article>

          <PostNavigation
            prev={prevTerm ? { slug: prevTerm.slug, title: prevTerm.title, href: `/technical-terms/${prevTerm.slug}`, description: prevTerm.description } : null}
            next={nextTerm ? { slug: nextTerm.slug, title: nextTerm.title, href: `/technical-terms/${nextTerm.slug}`, description: nextTerm.description } : null}
          />

          <div className="pt-8 mt-8 space-y-6" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-muted)' }}>
                Share this definition
              </h3>
              <SocialShare
                url={`/technical-terms/${slug}`}
                title={term.title}
                description={term.description}
              />
            </div>
            <Link
              href="/technical-terms"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all duration-200"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}
            >
              ← All technical terms
            </Link>
          </div>
        </div>
      </div>
      <ViewIncrementer type="technical-terms" slug={slug} />
      <FloatingUpvoteButton type="technical-terms" slug={slug} />
    </>
  );
}
