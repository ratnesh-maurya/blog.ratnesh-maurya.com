import { OgImageInBody } from '@/components/OgImageInBody';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPosts } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Newsletter — Ratn Labs',
  description: 'Subscribe to get new articles on system design, Go, AWS, and backend engineering delivered straight to your inbox. No spam, unsubscribe anytime.',
  keywords: ['newsletter', 'backend engineering newsletter', 'system design newsletter', 'Go newsletter', 'developer newsletter'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/newsletter', types: { ...oembedAlternate('/newsletter') } },
  openGraph: {
    title: 'Newsletter — Ratn Labs',
    description: 'Get new articles on system design, Go, and backend engineering in your inbox.',
    url: 'https://blog.ratnesh-maurya.com/newsletter',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('newsletter'), width: 1200, height: 630, alt: 'Newsletter — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter — Ratn Labs',
    description: 'Get new articles on system design, Go, and backend engineering in your inbox.',
    creator: '@ratnesh_maurya',
    images: [getStoredOgImageUrl('newsletter')],
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
      <OgImageInBody src={getStoredOgImageUrl('newsletter')} alt="Newsletter — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        {/* Hero */}
        <div className="hero-gradient-bg">
          <div className="page-header max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Newsletter
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              Engineering insights,<br />straight to you
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              New articles on system design, Go, AWS, and backend engineering — delivered when something worth reading is ready. No fluff, no weekly filler.
            </p>

            {/* Substack embed */}
            <div className="max-w-md mx-auto w-full">
              <iframe
                src="https://ratnlabs.substack.com/embed"
                width="480"
                height="150"
                title="Subscribe to Ratn Labs on Substack"
                style={{ border: '1px solid #EEE', background: 'white', width: '100%', maxWidth: '480px' }}
                frameBorder="0"
                scrolling="no"
              />
            </div>

            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              No spam. Unsubscribe any time. ~{posts.length} articles published so far.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">

          {/* What you'll get */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-center"
              style={{ color: 'var(--text-muted)' }}>
              What you&apos;ll receive
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {perks.map((p) => (
                <div key={p.title} className="on-card p-6 rounded-2xl transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow-sm)',
                    backdropFilter: 'blur(10px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                  }}>
                  <span className="text-2xl mb-3 block">{p.emoji}</span>
                  <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="on-card flex items-start gap-4 p-4 rounded-2xl transition-all duration-150 hover:-translate-y-0.5 group"
                  style={{
                    backgroundColor: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow-sm)',
                    backdropFilter: 'blur(10px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                  }}>
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
          <section className="on-card rounded-2xl p-8 text-center"
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
              backdropFilter: 'blur(12px) saturate(160%)',
              WebkitBackdropFilter: 'blur(12px) saturate(160%)',
            }}>
            <h2 className="text-xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Ready to level up?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Join engineers who read Ratn Labs for real engineering insights.
            </p>
            <div className="max-w-md mx-auto w-full">
              <iframe
                src="https://ratnlabs.substack.com/embed"
                width="480"
                height="150"
                title="Subscribe to Ratn Labs on Substack"
                style={{ border: '1px solid #EEE', background: 'white', width: '100%', maxWidth: '480px' }}
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
