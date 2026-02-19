import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTILEntry, getTILSlugs, getAllTILEntries } from '@/lib/content';
import { PostNavigation } from '@/components/PostNavigation';
import { BreadcrumbStructuredData, TILStructuredData } from '@/components/StructuredData';
import { format } from 'date-fns';

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
    alternates: { canonical: `https://blog.ratnesh-maurya.com/til/${slug}` },
    openGraph: {
      title: entry.title,
      description: `TIL: ${entry.title}`,
      url: `https://blog.ratnesh-maurya.com/til/${slug}`,
      siteName: 'Ratn Labs',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: entry.title,
      description: `TIL: ${entry.title}`,
      creator: '@ratnesh_maurya',
    },
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
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <TILStructuredData entry={entry} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Back */}
          <Link href="/til"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All TILs
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-2xl">{categoryEmoji[entry.category] ?? '💡'}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                {entry.category}
              </span>
              <time className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                {format(new Date(entry.date), 'MMMM dd, yyyy')}
              </time>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug"
              style={{ color: 'var(--text-primary)' }}>
              {entry.title}
            </h1>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

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

          {/* Back to all TILs */}
          <div className="mt-6">
            <Link href="/til"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all duration-200"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}>
              ← All TIL entries
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
