import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { OgImageInBody } from '@/components/OgImageInBody';
import { PostNavigation } from '@/components/PostNavigation';
import { BreadcrumbStructuredData, TILStructuredData } from '@/components/StructuredData';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { getAllTILEntries, getTILEntry, getTILSlugs } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { format } from 'date-fns';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TILPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTILSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: TILPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getTILEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — TIL | Ratn Labs`,
    description: `Today I Learned: ${entry.title}. A short note on ${entry.category} from Ratnesh Maurya.`,
    keywords: [entry.category, ...entry.tags, 'TIL', 'today I learned'],
    alternates: { canonical: `https://blog.ratnesh-maurya.com/til/${slug}/`, types: { ...oembedAlternate(`/til/${slug}`) } },
    openGraph: {
      title: entry.title,
      description: `TIL: ${entry.title}`,
      url: `https://blog.ratnesh-maurya.com/til/${slug}/`,
      siteName: 'Ratn Labs',
      type: 'article',
      images: [{ url: getStoredOgImageUrl('til-slug', slug), width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: `TIL: ${entry.title}`,
      creator: '@ratnesh_maurya',
      images: [getStoredOgImageUrl('til-slug', slug)],
    },
    robots: { index: true, follow: true },
  };
}

const categoryEmoji: Record<string, string> = {
  Go: '🐹', PostgreSQL: '🐘', Kubernetes: '☸️',
  AWS: '☁️', Docker: '🐳', TypeScript: '🔷', Elixir: '💧', General: '💡',
};

export default async function TILEntryPage({ params }: TILPageProps) {
  const { slug } = await params;
  const [entry, allEntries] = await Promise.all([getTILEntry(slug), getAllTILEntries()]);
  if (!entry) notFound();

  const currentIndex = allEntries.findIndex(e => e.slug === slug);
  const prevEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;
  const nextEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'TIL', url: 'https://blog.ratnesh-maurya.com/til' },
    { name: entry.title, url: `https://blog.ratnesh-maurya.com/til/${slug}` },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('til-slug', slug)} alt={entry.title} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <TILStructuredData entry={entry} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Back navigation */}
          <Link
            href="/til"
            className="group inline-flex items-center gap-1.5 text-xs font-medium mb-10 transition-colors hover:text-[var(--accent-500)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All TILs
          </Link>

          {/* Header */}
          <header className="mb-10">
            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="nb-badge nb-badge-muted inline-flex items-center gap-1.5">
                <span className="text-sm leading-none">{categoryEmoji[entry.category] ?? '💡'}</span>
                {entry.category}
              </span>
              <span aria-hidden="true" style={{ color: 'var(--border)' }}>·</span>
              <time dateTime={entry.date}>
                {format(new Date(entry.date), 'MMMM dd, yyyy')}
              </time>
              <Link
                href={`/utm?${new URLSearchParams({
                  url: `/til/${slug}`,
                  title: entry.title,
                  description: `TIL: ${entry.title}`,
                }).toString()}`}
                className="ml-auto inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors hover:border-[var(--accent-400)] hover:text-[var(--text-primary)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h2l3 8 4-16 4 16 3-8h2" />
                </svg>
                UTM
              </Link>
            </div>

            {/* Title */}
            <h1
              className="font-extrabold text-3xl md:text-4xl tracking-tight leading-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {entry.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content */}
          <article
            className="blog-content prose-sm"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />

          {/* Prev / Next navigation */}
          <PostNavigation
            prev={prevEntry ? { slug: prevEntry.slug, title: prevEntry.title, href: `/til/${prevEntry.slug}`, label: prevEntry.category } : null}
            next={nextEntry ? { slug: nextEntry.slug, title: nextEntry.title, href: `/til/${nextEntry.slug}`, label: nextEntry.category } : null}
          />
        </div>
      </div>
      <ViewIncrementer type="til" slug={slug} />
      <FloatingUpvoteButton type="til" slug={slug} />
    </>
  );
}
