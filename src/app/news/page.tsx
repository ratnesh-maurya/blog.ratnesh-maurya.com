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
    images: [{ url: '/og/news.png', width: 1200, height: 630, alt: 'Daily AI and software development news' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily AI & Software Development News — Ratn Labs',
    description: 'Daily curated AI and software development news digests.',
    creator: '@ratnesh_maurya',
    site: '@ratnesh_maurya',
    images: ['/og/news.png'],
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

  // Featured latest digest + rest grouped by month for scannability
  const latest = posts[0];
  const latestIsToday = latest
    ? new Date(latest.date).toDateString() === new Date().toDateString()
    : false;
  const monthMap = new Map<string, typeof posts>();
  for (const post of posts.slice(1)) {
    const month = new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const list = monthMap.get(month) ?? [];
    list.push(post);
    monthMap.set(month, list);
  }
  const months = [...monthMap.entries()];

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
            and research signals that are worth tracking. These are curated roundups — not long-form original posts.
          </p>
        </header>

        <div
          className="mb-8 p-4 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--accent-500) 8%, var(--glass-bg))',
            border: '1px solid color-mix(in srgb, var(--accent-500) 22%, var(--glass-border))',
            color: 'var(--text-secondary)',
          }}
        >
          Looking for original writing? Start with the{' '}
          <Link href="/blog/" className="font-bold" style={{ color: 'var(--accent-500)' }}>
            Blog
          </Link>
          {' '}— deep dives and architecture notes by Ratnesh Maurya.
        </div>

        {posts.length === 0 ? (
          <div
            className="nb-card p-8"
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
              backdropFilter: 'blur(10px) saturate(160%)',
              WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            }}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              No digests yet
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              The first automated digest will appear here after the scheduled GitHub workflow runs.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* ── Featured: latest digest ── */}
            <Link href={`/news/${latest.slug}`} className="group block">
              <article
                className="nb-card p-6 sm:p-8"
                style={{
                  background: 'linear-gradient(135deg, var(--glass-bg) 0%, color-mix(in srgb, var(--accent-50) 55%, var(--glass-bg)) 100%)',
                  border: '1px solid color-mix(in srgb, var(--accent-500) 25%, var(--glass-border))',
                  boxShadow: 'var(--glass-shadow-sm)',
                  backdropFilter: 'blur(10px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--accent-500)', color: '#fff' }}
                  >
                    {latestIsToday ? 'Today' : 'Latest'}
                  </span>
                  <time className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {fmtDate(latest.date)}
                  </time>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-snug mb-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                  {latest.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                  {latest.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {latest.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-700)' }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--accent-500)' }}>
                    Read the digest
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>

            {/* ── Archive, grouped by month ── */}
            {months.map(([month, monthPosts]) => (
              <section key={month}>
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-4 pb-2"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--nb-border)' }}
                >
                  {month} <span style={{ fontWeight: 500 }}>· {monthPosts.length} digest{monthPosts.length === 1 ? '' : 's'}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {monthPosts.map((post) => (
                    <Link key={post.slug} href={`/news/${post.slug}`} className="group block h-full">
                      <article
                        className="nb-card h-full p-5 flex flex-col gap-3"
                        style={{
                          backgroundColor: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                          boxShadow: 'var(--glass-shadow-sm)',
                          backdropFilter: 'blur(10px) saturate(160%)',
                          WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                        }}
                      >
                        <time className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {fmtDate(post.date)}
                        </time>

                        <h3 className="text-lg font-extrabold leading-snug nb-title-hover" style={{ color: 'var(--text-primary)' }}>
                          {post.title}
                        </h3>

                        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
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
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
