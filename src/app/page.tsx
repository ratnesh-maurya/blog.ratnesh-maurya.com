import { getAllBlogPostsForListing } from '@/lib/content';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ratn Labs — Systems, Backend & AI Engineering',
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
    title: 'Ratn Labs — Systems, Backend & AI Engineering Blog',
    description: 'Systems thinking, backend architecture, and AI engineering by Ratnesh Maurya.',
    url: 'https://blog.ratnesh-maurya.com',
    siteName: 'Ratn Labs',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Ratn Labs — Engineering Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ratn Labs — Systems, Backend & AI Engineering',
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

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
      style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}
    >
      {initials}
    </div>
  );
}

export default async function Home() {
  const posts = await getAllBlogPostsForListing();
  const featured = posts.slice(0, 3);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const latest = posts.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 6);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
  ];

  const faqs = [
    {
      q: 'What do you write about?',
      a: 'Backend engineering, distributed systems, system design, developer productivity, and practical AI engineering—written from real-world building and debugging.',
    },
    {
      q: 'Is this content beginner-friendly?',
      a: 'Most posts aim for "clear first, deep second": you\'ll find high-level explanations, concrete examples, and links to go further.',
    },
    {
      q: 'How do I stay updated?',
      a: 'Use the RSS feed or the newsletter page—both are linked below.',
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

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Hero */}
        <section className="pt-24 pb-16 hero-gradient-bg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide mb-6"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-500)' }} />
                Systems, Backend & AI Engineering
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                Build systems that{' '}
                <span className="gradient-text-primary">don&#39;t flake</span>.
              </h1>

              <p className="mt-5 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Practical notes on backend architecture, distributed systems, and AI engineering.
                Deep dives, cheatsheets, and debugging writeups—built for builders.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}
                >
                  Start reading
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}
                >
                  Get updates
                </Link>
                <a
                  href="/feed.xml"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}
                >
                  RSS
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured — Magazine Grid */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Featured
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Start here if you&#39;re new.
                </p>
              </div>
              <Link href="/blog" className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent-500)' }}>
                Browse all posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((post, i) => {
                const isHero = i === 0;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={`group rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg ${
                      isHero ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    {/* Cover image */}
                    <div className={`relative w-full overflow-hidden ${isHero ? 'aspect-[16/9]' : 'aspect-[16/10]'}`} style={{ backgroundColor: 'var(--surface-muted)' }}>
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes={isHero ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-extrabold" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className={`p-5 ${isHero ? 'sm:p-6' : ''}`}>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-500)' }}>
                        {post.category}
                      </p>
                      <h3
                        className={`mt-2 font-extrabold leading-snug group-hover:text-[var(--accent-500)] transition-colors ${
                          isHero ? 'text-xl sm:text-2xl' : 'text-base'
                        }`}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {post.title}
                      </h3>
                      {isHero && post.description && (
                        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {post.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <AuthorAvatar name={post.author} />
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>{post.author}</span>
                          <span>·</span>
                          <time>{formatDate(post.date)}</time>
                          {post.readingTime && (
                            <>
                              <span>·</span>
                              <span>{post.readingTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest — Card Grid */}
        <section className="py-16" style={{ backgroundColor: 'var(--surface-muted)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Latest writing
              </h2>
              <Link href="/blog" className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent-500)' }}>
                All posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  {/* Cover image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-extrabold" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-500)' }}>
                      {post.category}
                    </p>
                    <h3
                      className="mt-2 text-base font-extrabold leading-snug group-hover:text-[var(--accent-500)] transition-colors line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <AuthorAvatar name={post.author} />
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <time>{formatDate(post.date)}</time>
                        {post.readingTime && (
                          <>
                            <span>·</span>
                            <span>{post.readingTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Explore */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Explore the library
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Pick a format depending on what you need today.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Blog', href: '/blog', desc: 'Posts & series', icon: '📝' },
                { label: 'Technical Terms', href: '/technical-terms', desc: 'System design glossary', icon: '📖' },
                { label: 'Cheatsheets', href: '/cheatsheets', desc: 'Quick references', icon: '⚡' },
                { label: 'TIL', href: '/til', desc: 'Small lessons', icon: '💡' },
                { label: 'Questions', href: '/silly-questions', desc: 'Silly but useful', icon: '🤔' },
                { label: 'Resources', href: '/resources', desc: 'Books, tools & talks', icon: '🔗' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
                >
                  <span className="text-2xl block mb-3">{item.icon}</span>
                  <p className="text-sm font-bold group-hover:text-[var(--accent-500)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ + CTA */}
        <section className="py-16" style={{ backgroundColor: 'var(--surface-muted)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8 items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Frequently asked
                </h2>
                <div className="mt-6 space-y-3">
                  {faqs.map((f) => (
                    <div key={f.q} className="rounded-xl p-5" style={{ backgroundColor: 'var(--surface)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.q}</p>
                      <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-6 sticky top-24" style={{ backgroundColor: 'var(--surface)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Get the good stuff
                </p>
                <h3 className="mt-3 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Updates without noise.
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  New posts, cheatsheets, and technical terms—delivered occasionally.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    href="/newsletter"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
                    style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}
                  >
                    Subscribe
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}
                  >
                    About Ratnesh
                  </Link>
                </div>
                <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Prefer RSS? Use <a href="/feed.xml" className="underline" style={{ color: 'var(--accent-600)' }}>feed.xml</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
