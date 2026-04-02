import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPostsForListing, getAllNewsPostsForListing, getAllTechnicalTermsForListing } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ratn Labs - Systems, Backend and AI Engineering',
  description: 'Practical engineering notes, deep dives, and daily signals on backend systems, AI tooling, and developer workflows.',
  keywords: [
    'Ratnesh Maurya', 'backend engineering blog', 'system design', 'AI engineering',
    'Go programming', 'Elixir', 'TypeScript', 'distributed systems', 'scalable architecture',
    'Kubernetes', 'AWS', 'microservices', 'API design', 'software engineering blog',
  ],
  alternates: {
    canonical: 'https://blog.ratnesh-maurya.com',
    types: {
      'application/rss+xml': 'https://blog.ratnesh-maurya.com/feed.xml',
      ...oembedAlternate('/'),
    },
  },
  openGraph: {
    title: 'Ratn Labs - Systems, Backend and AI Engineering Blog',
    description: 'Systems thinking, backend architecture, and AI engineering by Ratnesh Maurya.',
    url: 'https://blog.ratnesh-maurya.com',
    siteName: 'Ratn Labs',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Ratn Labs - Engineering Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ratn Labs - Systems, Backend and AI Engineering',
    description: 'Notes on building scalable software in Go, Elixir, and TypeScript.',
    creator: '@ratnesh_maurya',
    site: '@ratnesh_maurya',
    images: ['/og/home.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const exploreItems = [
  { label: 'Blog', href: '/blog', desc: 'Long-form notes and architecture stories', emoji: '✍️' },
  { label: 'News', href: '/news', desc: 'Daily AI and software signals', emoji: '🗞️' },
  { label: 'Technical Terms', href: '/technical-terms', desc: 'Backend and systems glossary', emoji: '📖' },
  { label: 'Cheatsheets', href: '/cheatsheets', desc: 'Fast references for daily work', emoji: '⚡' },
  { label: 'TIL', href: '/til', desc: 'Small lessons worth keeping', emoji: '💡' },
  { label: 'Resources', href: '/resources', desc: 'Books, tools, and talks', emoji: '🔗' },
];

const sectionCard = {
  backgroundColor: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow-sm)',
  backdropFilter: 'blur(10px) saturate(160%)',
  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
} as const;

const sectionCardDeep = {
  backgroundColor: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow)',
  backdropFilter: 'blur(14px) saturate(170%)',
  WebkitBackdropFilter: 'blur(14px) saturate(170%)',
} as const;

const neutralHeroPanel = {
  backgroundColor: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow)',
  backdropFilter: 'blur(16px) saturate(170%)',
  WebkitBackdropFilter: 'blur(16px) saturate(170%)',
} as const;

export default async function Home() {
  const [posts, technicalTerms, newsPosts] = await Promise.all([
    getAllBlogPostsForListing(),
    getAllTechnicalTermsForListing(),
    getAllNewsPostsForListing(),
  ]);

  const featuredPost = posts[0];
  const featuredPosts = posts.slice(1, 5);
  const latestNews = newsPosts.slice(0, 3);
  const latestTerms = technicalTerms.slice(0, 4);

  const breadcrumbItems = [{ name: 'Home', url: 'https://blog.ratnesh-maurya.com' }];

  const faqs = [
    {
      q: 'What do you write about?',
      a: 'Backend engineering, distributed systems, system design, developer productivity, and practical AI engineering written from real-world building and debugging.',
    },
    {
      q: 'Is this content beginner-friendly?',
      a: "Most posts aim for clear first, deep second. You will find high-level explanations, concrete examples, and links to go further.",
    },
    {
      q: 'How do I stay updated?',
      a: 'Use the RSS feed or the newsletter page. Both are linked below.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <section className="relative overflow-hidden px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(900px 420px at 50% 0%, rgba(255,255,255,0.26) 0%, transparent 70%), radial-gradient(600px 360px at 18% 90%, rgba(255,255,255,0.12) 0%, transparent 74%), radial-gradient(520px 300px at 82% 18%, rgba(0, 0, 0, 0.05) 0%, transparent 72%)',
            }}
          />

          <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
            <div className="space-y-6">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{
                  backgroundColor: 'var(--glass-bg-subtle)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  boxShadow: 'var(--glass-shadow-sm)',
                }}
              >
                Systems · Backend · AI Engineering
              </span>

              <div className="space-y-4 max-w-2xl">
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92]"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.05em' }}
                >
                  Practical engineering
                  <br />
                  for real-world systems.
                </h1>
                <p className="text-lg sm:text-xl leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  Backend systems, distributed architecture, and AI notes presented in a clean, desktop-like layout.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--background)',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                  }}
                >
                  Start with the blog
                </Link>
                <Link
                  href="/news"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow-sm)',
                    backdropFilter: 'blur(10px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                    textDecoration: 'none',
                  }}
                >
                  Read the digests
                </Link>
                <a
                  href="/feed.xml"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    textDecoration: 'none',
                  }}
                >
                  RSS
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl pt-2">
                {[
                  { value: posts.length, label: 'Posts' },
                  { value: technicalTerms.length, label: 'Terms' },
                  { value: newsPosts.length, label: 'Digests' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl p-4" style={sectionCard}>
                    <div className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.06),transparent_50%)] blur-2xl" />
              <div className="relative rounded-[28px] p-5 sm:p-6" style={sectionCardDeep}>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                      Featured entry
                    </p>
                    <h2 className="mt-1 text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                      The next read worth opening.
                    </h2>
                  </div>
                  <Link href="/blog" className="text-sm font-bold" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    View all →
                  </Link>
                </div>

                {featuredPost ? (
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <article className="overflow-hidden rounded-[24px]" style={sectionCard}>
                      <div className="relative aspect-[16/10] overflow-hidden border-b" style={{ borderColor: 'var(--glass-border)' }}>
                        {featuredPost.image ? (
                          <Image
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--glass-bg-subtle)' }}>
                            <span className="text-6xl font-black" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                              {featuredPost.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="nb-badge nb-badge-muted">Featured story</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(featuredPost.date)}
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {featuredPost.title}
                        </h3>
                        {featuredPost.description && (
                          <p className="mt-3 text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                            {featuredPost.description}
                          </p>
                        )}
                        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                          <span>{featuredPost.category}</span>
                          <span>·</span>
                          <span>{featuredPost.author}</span>
                          {featuredPost.readingTime && (
                            <>
                              <span>·</span>
                              <span>{featuredPost.readingTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ) : (
                  <div className="rounded-[24px] p-6 text-center" style={sectionCard}>
                    <p style={{ color: 'var(--text-muted)' }}>No posts yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="rounded-[28px] p-5 sm:p-6" style={sectionCard}>
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="nb-section-label mb-1">Recent writing</p>
                  <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                    Latest posts, surfaced cleanly.
                  </h2>
                </div>
                <Link href="/blog" className="text-sm font-bold" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  All posts →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article className="overflow-hidden rounded-[22px] transition-transform duration-200 group-hover:-translate-y-0.5" style={sectionCard}>
                      <div className="relative aspect-[16/10] overflow-hidden border-b" style={{ borderColor: 'var(--glass-border)' }}>
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 28vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--glass-bg-subtle)' }}>
                            <span className="text-5xl font-black" style={{ color: 'var(--text-muted)', opacity: 0.28 }}>
                              {post.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="nb-badge nb-badge-muted">{post.category}</span>
                        </div>
                        <h3 className="text-base sm:text-[1.05rem] font-black leading-snug" style={{ color: 'var(--text-primary)' }}>
                          {post.title}
                        </h3>
                        <p className="mt-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(post.date)}{post.readingTime ? ` · ${post.readingTime}` : ''}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] p-5 sm:p-6" style={sectionCard}>
                <div className="flex items-end justify-between gap-4 mb-5">
                  <div>
                    <p className="nb-section-label mb-1">Explore</p>
                    <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                      Fast paths into the site.
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {exploreItems.map((item) => (
                    <Link key={item.href} href={item.href} className="group block">
                      <div className="h-full rounded-[20px] p-4 transition-transform duration-200 group-hover:-translate-y-0.5" style={sectionCard}>
                        <span className="text-2xl block mb-3">{item.emoji}</span>
                        <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] p-5 sm:p-6" style={sectionCard}>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="nb-section-label mb-1">Signals</p>
                    <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                      News and terms at a glance.
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {latestNews.map((post) => (
                    <Link key={post.slug} href={`/news/${post.slug}`} className="group block">
                      <div className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-transform duration-200 group-hover:-translate-y-0.5" style={sectionCard}>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                            News digest
                          </p>
                          <p className="text-sm font-bold leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(post.date)}
                        </span>
                      </div>
                    </Link>
                  ))}

                  {latestTerms.map((term) => (
                    <Link key={term.slug} href={`/technical-terms/${term.slug}`} className="group block">
                      <div className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-transform duration-200 group-hover:-translate-y-0.5" style={sectionCard}>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                            Technical term
                          </p>
                          <p className="text-sm font-bold leading-snug line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                            {term.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                            {term.description}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                          Read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-6xl mx-auto rounded-[32px] p-6 sm:p-8" style={sectionCardDeep}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
              <div>
                <p className="nb-section-label mb-1">Why this site</p>
                <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  A compact place for engineering notes that stay useful.
                </h2>
              </div>
              <div className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                New posts, digest summaries, and reference pages are arranged to get you to the right entry point fast.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'System design', value: 'Tradeoffs, architecture, and scalability' },
                { label: 'Developer signals', value: 'AI updates, product changes, and tooling' },
                { label: 'Reference material', value: 'Cheatsheets, glossary entries, and TILs' },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] p-5" style={sectionCard}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </p>
                  <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/newsletter"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--background)',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                }}
              >
                Subscribe for updates
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                  textDecoration: 'none',
                }}
              >
                About Ratnesh
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
