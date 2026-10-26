import { ContinueReading } from '@/components/ContinueReading';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { TermOfTheDay } from '@/components/TermOfTheDay';
import { getAllBlogPostsForListing, getAllNewsPostsForListing, getAllTechnicalTermsForListing } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ratn Labs - Systems, Backend and AI Engineering',
  description: 'Practical notes on backend architecture, distributed systems, and AI engineering. Browse deep dives, cheatsheets, TILs, and technical terms.',
  keywords: [
    'Ratnesh Maurya', 'backend engineering blog', 'system design', 'AI engineering',
    'Go programming', 'Elixir', 'TypeScript', 'distributed systems', 'scalable architecture',
    'Kubernetes', 'AWS', 'microservices', 'API design', 'software engineering blog',
  ],
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
      ...oembedAlternate('/'),
    },
  },
  openGraph: {
    title: 'Ratn Labs - Systems, Backend and AI Engineering Blog',
    description: 'Systems thinking, backend architecture, and AI engineering by Ratnesh Maurya.',
    url: SITE_URL,
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
  { label: 'Blog', href: '/blog', desc: 'Original posts and series' },
  { label: 'Technical Terms', href: '/technical-terms', desc: 'System design glossary' },
  { label: 'News', href: '/news', desc: 'Curated daily digests' },
  { label: 'Cheatsheets', href: '/cheatsheets', desc: 'Quick references' },
  { label: 'TIL', href: '/til', desc: 'Small lessons' },
  { label: 'Questions', href: '/silly-questions', desc: 'Silly but useful' },
  { label: 'Resources', href: '/resources', desc: 'Books, tools and talks' },
];

const glassCard = {
  backgroundColor: 'transparent',
  border: '1px solid var(--line)',
  borderRadius: 'var(--r-md)',
} as const;

export default async function Home() {
  const [posts, technicalTerms, newsPosts] = await Promise.all([
    getAllBlogPostsForListing(),
    getAllTechnicalTermsForListing(),
    getAllNewsPostsForListing(),
  ]);

  const featured = posts.slice(0, 5);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const latest = posts.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 6);

  const centerFeatured = featured.slice(0, 1);
  const leftFeatured = featured.slice(1, 3);
  const rightFeatured = featured.slice(3, 5);
  const hasMagazineLayout = featured.length >= 3;

  const breadcrumbItems = [{ name: 'Home', url: SITE_URL }];

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

        {/* ── Hero (Ledger, mirrors ratneshmaurya.com) ── */}
        <section className="lg-hero">
          <span className="lg-rail" lang="hi" aria-hidden="true"><span>रत्न</span></span>
          <div className="wrap lg-hero-in">
            <div>
              <p className="lg-greet"><span lang="hi">नमस्ते,</span> this is</p>
              <h1 className="lg-h1">Ratn <em>Labs</em></h1>
              <p className="lg-roleline">
                Notes on backend, distributed systems and AI engineering by{' '}
                <Link href="/about">Ratnesh Maurya</Link>
              </p>
            </div>

            <dl className="lg-ledger">
              <div>
                <dt>Writes about</dt>
                <dd>Backend architecture · distributed systems · AI agents in production</dd>
              </div>
              {posts[0] && (
                <div>
                  <dt>Latest post</dt>
                  <dd><Link href={`/blog/${posts[0].slug}`}>{posts[0].title}</Link></dd>
                </div>
              )}
              {newsPosts[0] && (
                <div>
                  <dt>Daily digest · {formatDate(newsPosts[0].date)}</dt>
                  <dd><Link href={`/news/${newsPosts[0].slug}`}>{newsPosts[0].title}</Link></dd>
                </div>
              )}
              <div>
                <dt>By</dt>
                <dd className="lg-by">
                  <Image
                    src="https://avatars.githubusercontent.com/u/85143283?v=4"
                    alt="Ratnesh Maurya"
                    width={28}
                    height={28}
                    priority
                  />
                  <span><Link href="/about">Ratnesh Maurya</Link> · SDE at Initializ</span>
                </dd>
              </div>
            </dl>

            <div className="lg-hero-foot">
              <div className="lg-hero-lead">
                <p className="lg-lead">
                  Deep dives written from building and debugging real systems — Go and Elixir services,
                  Postgres, Kafka, Kubernetes — plus a curated daily digest for builders who ship.
                </p>
                <div className="lg-ctas">
                  <Link className="btn btn-primary btn-lg" href="/blog">Read the blog →</Link>
                  <Link className="btn btn-secondary btn-lg" href="/news">Daily news</Link>
                  <div className="lg-socials-text">
                    <a href="/feed.xml">RSS ↗</a>
                    <Link href="/newsletter">Newsletter ↗</Link>
                    <a href="https://ratneshmaurya.com" target="_blank" rel="noopener">Portfolio ↗</a>
                  </div>
                </div>
              </div>
              <dl className="lg-stats">
                <div><dt>long-form posts</dt><dd>{posts.length}</dd></div>
                <div><dt>technical terms explained</dt><dd>{technicalTerms.length}</dd></div>
                <div><dt>daily news digests</dt><dd>{newsPosts.length}</dd></div>
                <div><dt>topics, from Go to Kubernetes</dt><dd>{new Set(posts.map((p) => p.category)).size}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <ContinueReading />

        
        {/* ── Featured Posts ── */}
        <section className="lg-sec">
          <div className="wrap">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="eyebrow">§ 01 — Featured</p>
                <h2 className="lg-h2">Start <em>here</em> if you are new.
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-bold pb-px"
                style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', textDecoration: 'none' }}
              >
                Browse all →
              </Link>
            </div>

            {hasMagazineLayout ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:min-h-[460px]">
                <div className="flex flex-col gap-4">
                  {leftFeatured.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block flex-1">
                      <article
                        className="h-full p-4 flex flex-col gap-3 transition-all duration-200 group-hover:-translate-y-0.5"
                        style={glassCard}
                      >
                        {post.image && (
                          <div
                            className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"
                            style={{ border: '1px solid var(--glass-border)' }}
                          >
                            <Image src={post.image} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="nb-badge nb-badge-primary mb-2 inline-block" style={{ fontSize: '0.6rem' }}>
                            {post.category}
                          </span>
                          <h3 className="font-semibold text-[14px] leading-snug nb-title-hover" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </h3>
                          <p className="text-[11px] font-semibold mt-2" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(post.date)}{post.readingTime ? ` · ${post.readingTime}` : ''}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  {centerFeatured.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                      <article
                        className="h-full p-5 flex flex-col gap-4 transition-all duration-200 group-hover:-translate-y-0.5"
                        style={{
                          backgroundColor: 'var(--glass-bg)',
                          backdropFilter: 'blur(12px) saturate(160%)',
                          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                          border: '1px solid var(--glass-border)',
                          boxShadow: 'var(--glass-shadow)',
                          borderRadius: '20px',
                        }}
                      >
                        <div
                          className="relative w-full aspect-[16/9] rounded-xl overflow-hidden"
                          style={{ border: '1px solid var(--glass-border)', backgroundColor: 'var(--surface-muted)' }}
                        >
                          {post.image ? (
                            <Image src={post.image} alt={post.title} fill sizes="50vw" className="object-cover" priority />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-5xl font-semibold" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="nb-badge nb-badge-primary mb-3 inline-block">{post.category}</span>
                          <h3 className="font-semibold text-xl md:text-2xl leading-snug nb-title-hover mt-2" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </h3>
                          {post.description && (
                            <p className="mt-2 text-sm font-medium leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                              {post.description}
                            </p>
                          )}
                          <p className="text-xs font-semibold mt-4" style={{ color: 'var(--text-muted)' }}>
                            {post.author} · {formatDate(post.date)}{post.readingTime ? ` · ${post.readingTime}` : ''}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  {rightFeatured.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block flex-1">
                      <article
                        className="h-full p-4 flex flex-col gap-3 transition-all duration-200 group-hover:-translate-y-0.5"
                        style={glassCard}
                      >
                        {post.image && (
                          <div
                            className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"
                            style={{ border: '1px solid var(--glass-border)' }}
                          >
                            <Image src={post.image} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="nb-badge nb-badge-primary mb-2 inline-block" style={{ fontSize: '0.6rem' }}>
                            {post.category}
                          </span>
                          <h3 className="font-semibold text-[14px] leading-snug nb-title-hover" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                          </h3>
                          <p className="text-[11px] font-semibold mt-2" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(post.date)}{post.readingTime ? ` · ${post.readingTime}` : ''}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article
                      className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5"
                      style={glassCard}
                    >
                      <div
                        className="relative w-full aspect-[16/10] rounded-t-2xl overflow-hidden"
                        style={{ borderBottom: '1px solid var(--glass-border)' }}
                      >
                        {post.image ? (
                          <Image src={post.image} alt={post.title} fill sizes="33vw" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-muted)' }}>
                            <span className="text-4xl font-semibold" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                              {post.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="nb-badge nb-badge-primary mb-3 inline-block">{post.category}</span>
                        <h3 className="font-semibold text-base nb-title-hover" style={{ color: 'var(--text-primary)' }}>
                          {post.title}
                        </h3>
                        <p className="text-xs font-semibold mt-2" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(post.date)}{post.readingTime ? ` · ${post.readingTime}` : ''}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        
        {/* ── Latest Writing ── */}
        <section className="lg-sec">
          <div className="wrap">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="eyebrow">§ 02 — Latest writing</p>
                <h2 className="lg-h2">Fresh from the <em>lab</em>.
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-bold pb-px"
                style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', textDecoration: 'none' }}
              >
                All posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article
                    className="h-full flex flex-col overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5"
                    style={glassCard}
                  >
                    {post.image && (
                      <div
                        className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl"
                        style={{ borderBottom: '1px solid var(--glass-border)' }}
                      >
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <span className="nb-badge nb-badge-primary self-start">{post.category}</span>
                      <h3
                        className="text-base font-semibold leading-snug nb-title-hover line-clamp-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <span
                          className="inline-flex w-6 h-6 rounded-full items-center justify-center flex-shrink-0"
                          style={{
                            background: 'color-mix(in srgb, var(--accent-500) 12%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--accent-500) 25%, transparent)',
                          }}
                        >
                          <span className="text-[8px] font-semibold" style={{ color: 'var(--accent-500)' }}>RM</span>
                        </span>
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(post.date)}{post.readingTime ? ` · ${post.readingTime}` : ''}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        
        {/* ── Explore Library ── */}
        <section className="lg-sec">
          <div className="wrap">
            <div className="mb-8">
              <p className="eyebrow">§ 03 — Explore the library</p>
              <h2 className="lg-h2">Pick a format, dive <em>deep</em>.
              </h2>
            </div>

            <div className="rows">
              {exploreItems.map((item, i) => (
                <Link key={item.href} href={item.href} className="row">
                  <span className="row-kind">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-main">
                    <h3>{item.label}</h3>
                    <p>{item.desc}</p>
                  </span>
                  <span className="row-side">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <TermOfTheDay terms={technicalTerms} />

        
        {/* ── FAQ + Newsletter ── */}
        <section className="lg-sec">
          <div className="wrap">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
              <div>
                <p className="eyebrow">§ 04 — FAQ</p>
                <h2 className="lg-h2 mb-6">Frequently <em>asked</em>.
                </h2>
                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div key={f.q} className="p-5" style={{ ...glassCard, borderRadius: '14px' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.q}</p>
                      <p className="text-sm mt-2 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky top-24">
                <div className="p-6" style={{ ...glassCard, borderRadius: '20px' }}>
                  <span className="nb-badge nb-badge-primary mb-4 inline-block">Newsletter</span>
                  <h3 className="text-xl font-semibold mt-3" style={{ color: 'var(--text-primary)' }}>
                    Updates without noise.
                  </h3>
                  <p className="text-sm font-medium mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    New posts, cheatsheets, and technical terms delivered occasionally.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href="/newsletter"
                      className="btn btn-primary w-full"
                    >
                      Subscribe →
                    </Link>
                    <Link
                      href="/about"
                      className="w-full inline-flex justify-center items-center rounded-xl py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: 'var(--glass-bg-subtle)', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--glass-border)' }}
                    >
                      About Ratnesh
                    </Link>
                  </div>
                  <p className="mt-5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Prefer RSS?{' '}
                    <a href="/feed.xml" className="font-bold underline decoration-1" style={{ color: 'var(--text-secondary)' }}>
                      feed.xml
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
