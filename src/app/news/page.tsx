import { BreadcrumbStructuredData, NewsListStructuredData } from '@/components/StructuredData';
import { getAllNewsPostsForListing } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Daily AI & Software Development News',
  description:
    'Daily curated AI and software development news digests with source links, images, and quick summaries.',
  keywords: [
    'AI news',
    'software development news',
    'daily tech digest',
    'developer news roundup',
    'engineering updates',
  ],
  alternates: {
    canonical: 'https://blog.ratnesh-maurya.com/news/',
    types: { ...oembedAlternate('/news') },
  },
  openGraph: {
    title: 'Daily AI & Software Development News — Ratn Labs',
    description:
      'Daily curated AI and software development news digests with source links, images, and quick summaries.',
    url: 'https://blog.ratnesh-maurya.com/news/',
    siteName: 'Ratn Labs',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Daily AI and software development news' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily AI & Software Development News — Ratn Labs',
    description: 'Daily curated AI and software development news digests.',
    creator: '@ratnesh_maurya',
    site: '@ratnesh_maurya',
    images: ['/og/home.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function fmtDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function NewsPage() {
  const posts = await getAllNewsPostsForListing();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'News', url: 'https://blog.ratnesh-maurya.com/news' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <NewsListStructuredData posts={posts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-10 pt-4">
          <span className="nb-badge nb-badge-primary mb-3 inline-block">Newsroom</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Daily AI + Software Development News
          </h1>
          <p className="mt-3 text-base leading-relaxed max-w-3xl font-medium" style={{ color: 'var(--text-muted)' }}>
            One digest per day, focused on practical updates for engineers: launches, tooling updates, open-source releases,
            and research signals that are worth tracking.
          </p>
        </header>

        {posts.length === 0 ? (
          <div
            className="nb-card p-8"
            style={{ backgroundColor: 'var(--nb-card-1)', border: '2px solid var(--nb-border)' }}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              No digests yet
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              The first automated digest will appear here after the scheduled GitHub workflow runs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/news/${post.slug}`} className="group block h-full">
                <article
                  className="nb-card h-full p-5 flex flex-col gap-3"
                  style={{ backgroundColor: `var(--nb-card-${index % 6})` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="nb-badge nb-badge-primary">Daily Digest</span>
                    <time className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {fmtDate(post.date)}
                    </time>
                  </div>

                  <h2 className="text-lg md:text-xl font-extrabold leading-snug nb-title-hover" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </h2>

                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {post.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
