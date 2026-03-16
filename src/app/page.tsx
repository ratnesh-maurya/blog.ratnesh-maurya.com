import { getAllBlogPosts } from '@/lib/content';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { oembedAlternate } from '@/lib/oembed';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ratn Labs — Systems, Backend & AI Engineering Blog',
  description: 'Systems thinking, backend architecture, and AI engineering by Ratnesh Maurya. Notes on Go, Elixir, TypeScript, distributed systems, and scalable software.',
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
  const posts = await getAllBlogPosts();
  const latest = posts.slice(0, 5);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

          <header className="mb-16 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Ratn<span style={{ color: 'var(--accent-500)' }}>Labs</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Systems thinking, backend architecture, and AI engineering.
              Notes from building scalable software in Go, Elixir, and TypeScript.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                About me
              </Link>
              <a href="https://ratnesh-maurya.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}>
                Portfolio &#8599;
              </a>
            </div>
          </header>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                Latest writing
              </h2>
              <Link href="/blog" className="text-xs font-semibold"
                style={{ color: 'var(--accent-500)' }}>
                All posts &rarr;
              </Link>
            </div>
            <div className="space-y-1">
              {latest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 -mx-4 rounded-lg transition-colors group"
                  style={{ color: 'var(--text-primary)' }}>
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
          </section>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Explore
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Blog', href: '/blog', desc: 'All posts & series' },
                { label: 'Questions', href: '/silly-questions', desc: 'Silly but useful' },
                { label: 'TIL', href: '/til', desc: 'Today I learned' },
                { label: 'Topics', href: '/topics', desc: 'Browse by topic' },
                { label: 'Technical Terms', href: '/technical-terms', desc: 'System design glossary' },
                { label: 'Cheatsheets', href: '/cheatsheets', desc: 'Quick references' },
                { label: 'Series', href: '/series', desc: 'Multi-part deep dives' },
                { label: 'Resources', href: '/resources', desc: 'Books, tools & talks' },
                { label: 'About', href: '/about', desc: 'Bio, now & uses' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="group rounded-xl border p-4 transition-all duration-200"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <p className="text-sm font-semibold group-hover:text-[var(--accent-500)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
