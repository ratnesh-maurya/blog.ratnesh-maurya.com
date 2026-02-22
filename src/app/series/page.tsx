import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/content';
import { getSeriesConfig } from '@/lib/static-content';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { OgImageInBody } from '@/components/OgImageInBody';
import { getStoredOgImageUrl } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Series — Learning Paths | Ratn Labs',
  description: 'Grouped reading paths for backend engineering topics — system design, AWS, Go, and more. Read posts in the right order.',
  keywords: ['backend engineering series', 'system design series', 'Go learning path', 'AWS series', 'developer reading path'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/series' },
  openGraph: {
    title: 'Series — Ratn Labs',
    description: 'Grouped reading paths for backend engineering — system design, AWS, Go.',
    url: 'https://blog.ratnesh-maurya.com/series',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('series'), width: 1200, height: 630, alt: 'Series — Ratn Labs' }],
  },
  twitter: { card: 'summary_large_image', title: 'Series — Ratn Labs', creator: '@ratnesh_maurya', images: [getStoredOgImageUrl('series')] },
  robots: { index: true, follow: true },
};

export default async function SeriesPage() {
  const seriesConfig = getSeriesConfig();
  const allPosts = await getAllBlogPosts();

  // Build each series by matching posts against category or tags — fully automatic
  const series = seriesConfig.map(config => {
    let matched = allPosts.filter(post => {
      const catMatch = config.matchCategory
        ? post.category?.toLowerCase() === config.matchCategory.toLowerCase()
        : false;

      const tagMatch = config.matchTags
        ? post.tags.some(t =>
            config.matchTags!.some(mt => t.toLowerCase().includes(mt.toLowerCase()))
          )
        : false;

      return catMatch || tagMatch;
    });

    // Deduplicate (a post could match both category and tag rules)
    matched = Array.from(new Map(matched.map(p => [p.slug, p])).values());

    // Apply explicit order if provided, otherwise keep newest-first
    if (config.orderedSlugs) {
      const bySlug = Object.fromEntries(matched.map(p => [p.slug, p]));
      const ordered = config.orderedSlugs.map(s => bySlug[s]).filter(Boolean);
      // Append any matched posts not in orderedSlugs at the end
      const orderedSet = new Set(config.orderedSlugs);
      const rest = matched.filter(p => !orderedSet.has(p.slug));
      matched = [...ordered, ...rest];
    }

    return { ...config, posts: matched };
  }).filter(s => s.posts.length > 0); // hide empty series

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Series', url: 'https://blog.ratnesh-maurya.com/series' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('series')} alt="Series — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Learning Paths
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Series
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Related posts grouped into reading paths. New posts are added automatically when you publish with the matching category or tag.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{series.length}</span> series
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {series.reduce((sum, s) => sum + s.posts.length, 0)}
                </span> posts total
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {series.map(s => (
            <section key={s.id}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>

              {/* Series header */}
              <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl mt-0.5">{s.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {s.title}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                    <span className="text-xs mt-2 inline-block" style={{ color: 'var(--text-muted)' }}>
                      {s.posts.length} {s.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post list */}
              <div>
                {s.posts.map((post, idx) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="flex items-start gap-4 px-6 py-4 transition-colors group"
                    style={{ borderTop: idx > 0 ? '1px solid var(--border)' : undefined }}>
                    <span className="text-base font-bold flex-shrink-0 w-5 text-right mt-0.5"
                      style={{ color: 'var(--border)' }}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: 'var(--accent-500)' }}>
                        {post.category}
                      </p>
                      <h3 className="text-sm font-semibold leading-snug group-hover:text-[var(--accent-500)] transition-colors"
                        style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {post.readingTime}
                      </p>
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                      style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
