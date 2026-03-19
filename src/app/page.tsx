import { getAllBlogPostsForListing } from '@/lib/content';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Link from 'next/link';

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

export default async function Home() {
  // Home page only needs lightweight listing metadata (title/date/category/slug).
  // Using the listing loader avoids expensive markdown->HTML work during the build.
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
      a: 'Most posts aim for “clear first, deep second”: you’ll find high-level explanations, concrete examples, and links to go further.',
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
        <section className="pt-24 pb-14 hero-gradient-bg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide mb-6"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-500)' }} />
                Systems, Backend & AI Engineering — in public
              </div>

              <h1
                className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
              >
                Build systems that <span className="gradient-text-primary">don’t flake</span>.
                <br />
                Ship code that <span className="gradient-text-primary">stays shipped</span>.
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Practical notes on backend architecture, distributed systems, and AI engineering.
                Deep dives, cheatsheets, and “why did this break?” writeups—built for builders.
              </p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
                If you’re here for reliability: you’ll find patterns to build systems that don’t flake—and habits to ship code that stays shipped.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}
                >
                  Start reading
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}
                >
                  Get updates
                </Link>
                <a
                  href="/feed.xml"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface)' }}
                >
                  RSS
                </a>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { k: 'Deep dives', v: 'Architecture + trade-offs' },
                  { k: 'Cheatsheets', v: 'Fast recall for tools' },
                  { k: 'Technical terms', v: 'Glossary you’ll actually use' },
                ].map((item) => (
                  <div
                    key={item.k}
                    className="card p-4 border-0"
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.k}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Featured
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Start here if you’re new.
                </p>
              </div>
              <Link href="/blog" className="text-xs font-semibold" style={{ color: 'var(--accent-500)' }}>
                Browse all posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group card card-interactive p-5 border-0"
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-base font-semibold leading-snug group-hover:text-[var(--accent-500)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest */}
        <section className="py-14" style={{ backgroundColor: 'var(--surface-muted)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Latest writing
              </h2>
              <Link href="/blog" className="text-xs font-semibold" style={{ color: 'var(--accent-500)' }}>
                All posts →
              </Link>
            </div>
            <div className="space-y-1">
              {latest.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 -mx-4 rounded-xl transition-colors group"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-medium leading-snug truncate group-hover:text-[var(--accent-500)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {post.category}
                    </p>
                  </div>
                  <time className="text-xs tabular-nums flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Explore */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Explore the library
                </h2>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Pick a format depending on what you need today.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {[
                { label: 'Blog', href: '/blog', desc: 'Posts & series' },
                { label: 'Technical Terms', href: '/technical-terms', desc: 'System design glossary' },
                { label: 'Cheatsheets', href: '/cheatsheets', desc: 'Quick references' },
                { label: 'TIL', href: '/til', desc: 'Small lessons' },
                { label: 'Questions', href: '/silly-questions', desc: 'Silly but useful' },
                { label: 'Resources', href: '/resources', desc: 'Books, tools & talks' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group card card-interactive border-0 p-4 transition-all duration-200 will-change-transform"
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  <p className="text-sm font-semibold group-hover:text-[var(--accent-500)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
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
                  A quick FAQ
                </h2>
                <div className="mt-6 space-y-4">
                  {faqs.map((f) => (
                    <div key={f.q} className="card p-5 border-0" style={{ backgroundColor: 'var(--surface)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.q}</p>
                      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6 border-0 sticky top-24" style={{ backgroundColor: 'var(--surface)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Get the good stuff
                </p>
                <h3 className="mt-3 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Updates without noise.
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
