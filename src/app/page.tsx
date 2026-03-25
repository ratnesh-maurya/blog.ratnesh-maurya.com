import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPostsForListing, getAllNewsPostsForListing, getAllTechnicalTermsForListing } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ratn Labs - Systems, Backend and AI Engineering',
  description: 'Practical notes on backend architecture, distributed systems, and AI engineering. Browse deep dives, cheatsheets, TILs, and technical terms.',
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
  { label: 'Blog', href: '/blog', desc: 'Posts and series', emoji: '✍️', colorIdx: 0 },
  { label: 'News', href: '/news', desc: 'Daily AI and dev digest', emoji: '🗞️', colorIdx: 2 },
  { label: 'Technical Terms', href: '/technical-terms', desc: 'System design glossary', emoji: '📖', colorIdx: 1 },
  { label: 'Cheatsheets', href: '/cheatsheets', desc: 'Quick references', emoji: '⚡', colorIdx: 3 },
  { label: 'TIL', href: '/til', desc: 'Small lessons', emoji: '💡', colorIdx: 4 },
  { label: 'Questions', href: '/silly-questions', desc: 'Silly but useful', emoji: '🤔', colorIdx: 4 },
  { label: 'Resources', href: '/resources', desc: 'Books, tools and talks', emoji: '🔗', colorIdx: 5 },
];

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
        <section className="min-h-[76vh] relative flex items-center justify-center overflow-hidden px-4 sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(980px 440px at 50% -10%, color-mix(in srgb, var(--accent-200) 35%, transparent) 0%, transparent 68%), radial-gradient(700px 380px at 20% 110%, color-mix(in srgb, var(--nb-card-4) 30%, transparent) 0%, transparent 70%)',
            }}
          />

          <div className="relative max-w-4xl w-full text-center">
            <span className="nb-badge nb-badge-primary">Systems · Backend · AI Engineering</span>

            <h1
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.94]"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
            >
              Practical engineering
              <br />
              for real-world systems
            </h1>

            <p
              className="mt-6 text-lg sm:text-xl leading-relaxed font-medium mx-auto max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Deep dives, architecture notes, and daily developer news for builders who ship.
            </p>

            <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
              <Link href="/blog" className="nb-btn nb-btn-primary justify-center" style={{ textDecoration: 'none' }}>
                Read
              </Link>
              <Link href="/news" className="nb-btn justify-center" style={{ backgroundColor: 'var(--nb-card-5)', color: '#1C1C1A', textDecoration: 'none' }}>
                Daily News
              </Link>
              <a href="/feed.xml" className="nb-btn justify-center" style={{ backgroundColor: 'var(--nb-card-2)', color: '#1C1C1A', textDecoration: 'none' }}>
                RSS Feed
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                { value: posts.length.toString(), label: 'Posts' },
                { value: technicalTerms.length.toString(), label: 'Technical Terms' },
                { value: newsPosts.length.toString(), label: 'News Digests' },
              ].map((item, index) => (
                <span
                  key={item.label}
                  className="nb-tag"
                  style={{
                    backgroundColor: `var(--nb-card-${(index + 1) % 6 || 5})`,
                    color: '#1C1C1A',
                  }}
                >
                  {item.value} {item.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <hr className="nb-separator" />

        <section className="py-16" style={{ backgroundColor: 'transparent' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="nb-section-label mb-1">Featured</p>
                <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Start here if you are new.
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-bold pb-px"
                style={{
                  color: 'var(--text-primary)',
                  borderBottom: '2px solid var(--nb-border)',
                  textDecoration: 'none',
                }}
              >
                Browse all →
              </Link>
            </div>

            {hasMagazineLayout ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:min-h-[460px]">
                <div className="flex flex-col gap-4">
                  {leftFeatured.map((post, i) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block flex-1">
                      <article
                        className="nb-card h-full p-4 flex flex-col gap-3"
                        style={{ backgroundColor: `var(--nb-card-${i})` }}
                      >
                        {post.image && (
                          <div
                            className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"
                            style={{ border: '2px solid var(--nb-border)' }}
                          >
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="25vw"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <span className="nb-badge nb-badge-primary mb-2 inline-block" style={{ fontSize: '0.6rem' }}>
                            {post.category}
                          </span>
                          <h3
                            className="font-extrabold text-[14px] leading-snug nb-title-hover"
                            style={{ color: 'var(--text-primary)' }}
                          >
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
                        className="nb-card h-full p-5 flex flex-col gap-4"
                        style={{ backgroundColor: 'var(--nb-card-featured)' }}
                      >
                        <div
                          className="relative w-full aspect-[16/9] rounded-xl overflow-hidden"
                          style={{ border: '2px solid var(--nb-border)', backgroundColor: 'var(--surface-muted)' }}
                        >
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="50vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className="text-5xl font-black"
                                style={{ color: 'var(--text-muted)', opacity: 0.3 }}
                              >
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="nb-badge nb-badge-primary mb-3 inline-block">
                            {post.category}
                          </span>
                          <h3
                            className="font-black text-xl md:text-2xl leading-snug nb-title-hover mt-2"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {post.title}
                          </h3>
                          {post.description && (
                            <p
                              className="mt-2 text-sm font-medium leading-relaxed line-clamp-2"
                              style={{ color: 'var(--text-secondary)' }}
                            >
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
                  {rightFeatured.map((post, i) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block flex-1">
                      <article
                        className="nb-card h-full p-4 flex flex-col gap-3"
                        style={{ backgroundColor: `var(--nb-card-${(i + 3) % 6})` }}
                      >
                        {post.image && (
                          <div
                            className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"
                            style={{ border: '2px solid var(--nb-border)' }}
                          >
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="25vw"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <span className="nb-badge nb-badge-primary mb-2 inline-block" style={{ fontSize: '0.6rem' }}>
                            {post.category}
                          </span>
                          <h3
                            className="font-extrabold text-[14px] leading-snug nb-title-hover"
                            style={{ color: 'var(--text-primary)' }}
                          >
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
                {featured.map((post, i) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article
                      className="nb-card h-full"
                      style={{ backgroundColor: `var(--nb-card-${i % 6})` }}
                    >
                      <div
                        className="relative w-full aspect-[16/10] rounded-t-[10px] overflow-hidden"
                        style={{ borderBottom: '2px solid var(--nb-border)' }}
                      >
                        {post.image ? (
                          <Image src={post.image} alt={post.title} fill sizes="33vw" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-muted)' }}>
                            <span className="text-4xl font-black" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                              {post.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="nb-badge nb-badge-primary mb-3 inline-block">{post.category}</span>
                        <h3
                          className="font-extrabold text-base nb-title-hover"
                          style={{ color: 'var(--text-primary)' }}
                        >
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

        <hr className="nb-separator" />

        <section className="py-16" style={{ backgroundColor: 'transparent' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="nb-section-label mb-1">Latest Writing</p>
                <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Fresh from the lab.
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-bold pb-px"
                style={{ color: 'var(--text-primary)', borderBottom: '2px solid var(--nb-border)', textDecoration: 'none' }}
              >
                All posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latest.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article
                    className="nb-card h-full flex flex-col"
                    style={{ backgroundColor: `var(--nb-card-${i % 6})` }}
                  >
                    {post.image && (
                      <div
                        className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[10px]"
                        style={{ borderBottom: '2px solid var(--nb-border)' }}
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
                      <span className="nb-badge nb-badge-primary self-start">
                        {post.category}
                      </span>
                      <h3
                        className="text-base font-extrabold leading-snug nb-title-hover line-clamp-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <span
                          className="inline-flex w-6 h-6 rounded-full items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: 'var(--nb-badge-bg)',
                            border: '2px solid var(--nb-border)',
                          }}
                        >
                          <span className="text-[8px] font-black" style={{ color: 'var(--nb-badge-text)' }}>RM</span>
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

        <hr className="nb-separator" />

        <section className="py-16" style={{ backgroundColor: 'transparent' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="nb-section-label mb-1">Explore the Library</p>
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                Pick a format, dive deep.
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {exploreItems.map((item) => (
                <Link key={item.href} href={item.href} className="group block">
                  <div
                    className="nb-card p-5 h-full"
                    style={{ backgroundColor: `var(--nb-card-${item.colorIdx})` }}
                  >
                    <span className="text-2xl block mb-3">{item.emoji}</span>
                    <p
                      className="text-sm font-black nb-title-hover"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>
                      {item.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <hr className="nb-separator" />

        <section className="py-16" style={{ backgroundColor: 'transparent' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-start">
              <div>
                <p className="nb-section-label mb-1">FAQ</p>
                <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
                  Frequently asked.
                </h2>
                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div
                      key={f.q}
                      className="nb-card p-5"
                      style={{ backgroundColor: 'var(--nb-surface-card)' }}
                    >
                      <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{f.q}</p>
                      <p className="text-sm mt-2 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky top-24">
                <div
                  className="nb-card p-6"
                  style={{ backgroundColor: 'var(--nb-card-3)' }}
                >
                  <span className="nb-badge nb-badge-primary mb-4 inline-block">
                    Newsletter
                  </span>
                  <h3 className="text-xl font-black mt-3" style={{ color: 'var(--text-primary)' }}>
                    Updates without noise.
                  </h3>
                  <p className="text-sm font-medium mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    New posts, cheatsheets, and technical terms delivered occasionally.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href="/newsletter"
                      className="nb-btn nb-btn-primary w-full justify-center rounded-xl py-3 text-sm"
                    >
                      Subscribe →
                    </Link>
                    <Link
                      href="/about"
                      className="nb-btn w-full justify-center rounded-xl py-3 text-sm"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--nb-border)',
                      }}
                    >
                      About Ratnesh
                    </Link>
                  </div>
                  <p className="mt-5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Prefer RSS?{' '}
                    <a
                      href="/feed.xml"
                      className="font-bold underline decoration-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
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
