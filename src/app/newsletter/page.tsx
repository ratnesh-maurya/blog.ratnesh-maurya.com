import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/content';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Newsletter — Ratn Labs',
  description: 'Subscribe to get new articles on system design, Go, AWS, and backend engineering delivered straight to your inbox. No spam, unsubscribe anytime.',
  keywords: ['newsletter', 'backend engineering newsletter', 'system design newsletter', 'Go newsletter', 'developer newsletter'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/newsletter' },
  openGraph: {
    title: 'Newsletter — Ratn Labs',
    description: 'Get new articles on system design, Go, and backend engineering in your inbox.',
    url: 'https://blog.ratnesh-maurya.com/newsletter',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter — Ratn Labs',
    description: 'Get new articles on system design, Go, and backend engineering in your inbox.',
    creator: '@ratnesh_maurya',
  },
  robots: { index: true, follow: true },
};

const perks = [
  { emoji: '📐', title: 'System Design deep-dives', desc: 'How real systems are built, scaled, and broken. Practical tradeoffs over theory.' },
  { emoji: '🐹', title: 'Go & backend patterns', desc: 'Idiomatic patterns, performance tips, and the gotchas that cost hours.' },
  { emoji: '☁️', title: 'Cloud & infrastructure', desc: 'AWS, containers, CI/CD — real config and cost patterns from production.' },
  { emoji: '🐛', title: 'Silly engineering stories', desc: 'The bugs, the fixes, and the lessons. Learning from failure is underrated.' },
];

export default async function NewsletterPage() {
  const posts = await getAllBlogPosts();
  const recentPosts = posts.slice(0, 4);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Newsletter', url: 'https://blog.ratnesh-maurya.com/newsletter' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Hero */}
        <div className="hero-gradient-bg">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Newsletter
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              Engineering insights,<br />straight to you
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              New articles on system design, Go, AWS, and backend engineering — delivered when something worth reading is ready. No fluff, no weekly filler.
            </p>

            {/* Subscribe form */}
            <form
              action="https://buttondown.email/api/emails/embed-subscribe/ratnlab"
              method="post"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}
              >
                Subscribe free
              </button>
            </form>

            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              No spam. Unsubscribe any time. ~{posts.length} articles published so far.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* What you'll get */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-center"
              style={{ color: 'var(--text-muted)' }}>
              What you&apos;ll receive
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {perks.map(p => (
                <div key={p.title} className="p-5 rounded-xl border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <span className="text-2xl mb-3 block">{p.emoji}</span>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {p.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sample posts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                Recent articles
              </h2>
              <Link href="/blog" className="text-xs font-semibold" style={{ color: 'var(--accent-500)' }}>
                All posts →
              </Link>
            </div>
            <div className="space-y-2">
              {recentPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 group"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                      style={{ color: 'var(--accent-500)' }}>
                      {post.category}
                    </p>
                    <p className="text-sm font-semibold leading-snug line-clamp-1 group-hover:text-[var(--accent-500)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </p>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5"
                    style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          {/* Second subscribe CTA */}
          <section className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: 'var(--accent-50)', border: '1px solid var(--accent-200)' }}>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Ready to level up?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Join engineers who read Ratn Labs for real engineering insights.
            </p>
            <form
              action="https://buttondown.email/api/emails/embed-subscribe/ratnlab"
              method="post"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap"
                style={{ backgroundColor: 'var(--accent-500)', color: 'var(--text-inverse)' }}>
                Subscribe
              </button>
            </form>
          </section>

        </div>
      </div>
    </>
  );
}
