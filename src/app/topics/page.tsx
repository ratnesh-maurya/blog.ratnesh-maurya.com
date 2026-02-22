import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts, getAllSillyQuestions } from '@/lib/content';
import { getTopicsMeta } from '@/lib/static-content';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { OgImageInBody } from '@/components/OgImageInBody';
import { getStoredOgImageUrl } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Topics — Ratn Labs',
  description: 'Browse all topics covered on Ratn Labs: system design, Go, AWS, web development, computer science, and more. Find articles by category.',
  keywords: ['topics', 'categories', 'system design', 'golang', 'AWS', 'web development', 'backend engineering'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/topics' },
  openGraph: {
    title: 'Topics — Ratn Labs',
    description: 'Browse all topics covered on Ratn Labs: system design, Go, AWS, web development, and more.',
    url: 'https://blog.ratnesh-maurya.com/topics',
    siteName: 'Ratn Labs',
    type: 'website',
    locale: 'en_US',
    images: [{ url: getStoredOgImageUrl('topics'), width: 1200, height: 630, alt: 'Topics — Ratn Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topics — Ratn Labs',
    description: 'Browse all topics covered on Ratn Labs: system design, Go, AWS, web development, and more.',
    creator: '@ratnesh_maurya',
    images: [getStoredOgImageUrl('topics')],
  },
  robots: { index: true, follow: true },
};

const defaultMeta = { emoji: '📝', description: 'Articles on this topic.', color: 'var(--surface-muted)', textColor: 'var(--text-secondary)' };

export default async function TopicsPage() {
  const categoryMeta = getTopicsMeta();
  const [posts, questions] = await Promise.all([getAllBlogPosts(), getAllSillyQuestions()]);

  const blogByCategory = posts.reduce<Record<string, number>>((acc, post) => {
    const cat = post.category || 'Uncategorised';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const questionsByCategory = questions.reduce<Record<string, number>>((acc, q) => {
    const cat = q.category || 'Uncategorised';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const allTags = Array.from(new Set([
    ...posts.flatMap(p => p.tags),
    ...questions.flatMap(q => q.tags),
  ])).sort();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Topics', url: 'https://blog.ratnesh-maurya.com/topics' },
  ];

  const allCategories = Array.from(new Set([
    ...Object.keys(blogByCategory),
    ...Object.keys(questionsByCategory),
  ]));

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('topics')} alt="Topics — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              All topics
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              Browse by Topic
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {posts.length} articles and {questions.length} Q&amp;As across {allCategories.length} categories.
              Find exactly what you&apos;re looking for.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

          {/* Blog categories */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Blog Post Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(blogByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const meta = categoryMeta[category] ?? defaultMeta;
                  const tagSlug = encodeURIComponent(category.trim().toLowerCase().replace(/\s+/g, '-'));
                  return (
                    <Link
                      key={category}
                      href={`/blog/tag/${tagSlug}`}
                      className="group flex flex-col p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{meta.emoji}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: meta.color, color: meta.textColor }}>
                          {count} {count === 1 ? 'post' : 'posts'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mb-2 group-hover:text-[var(--accent-500)] transition-colors"
                        style={{ color: 'var(--text-primary)' }}>
                        {category}
                      </h3>
                      <p className="text-sm leading-relaxed flex-1"
                        style={{ color: 'var(--text-muted)' }}>
                        {(categoryMeta[category] ?? defaultMeta).description}
                      </p>
                      <span className="mt-4 text-xs font-semibold flex items-center gap-1"
                        style={{ color: 'var(--accent-500)' }}>
                        Browse posts
                        <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  );
                })}
            </div>
          </section>

          {/* Silly Questions categories */}
          {Object.keys(questionsByCategory).length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: 'var(--text-muted)' }}>
                Silly Questions Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(questionsByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => {
                    const meta = categoryMeta[category] ?? defaultMeta;
                    const tagSlug = encodeURIComponent(category.trim().toLowerCase().replace(/\s+/g, '-'));
                    return (
                      <Link
                        key={category}
                        href={`/silly-questions?category=${tagSlug}`}
                        className="group flex flex-col p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{meta.emoji}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: meta.color, color: meta.textColor }}>
                            {count} {count === 1 ? 'Q&A' : 'Q&As'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold mb-2 group-hover:text-[var(--accent-500)] transition-colors"
                          style={{ color: 'var(--text-primary)' }}>
                          {category}
                        </h3>
                        <p className="text-sm leading-relaxed flex-1"
                          style={{ color: 'var(--text-muted)' }}>
                          {(categoryMeta[category] ?? defaultMeta).description}
                        </p>
                        <span className="mt-4 text-xs font-semibold flex items-center gap-1"
                          style={{ color: 'var(--coral-500)' }}>
                          Browse Q&amp;As
                          <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </section>
          )}

          {/* All Tags cloud */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              All Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const tagSlug = encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
                return (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tagSlug}`}
                    className="text-sm px-3 py-1.5 rounded-full border font-medium transition-all duration-150"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}
                  >
                    #{tag}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Quick links */}
          <section className="rounded-2xl p-8"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-base font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Quick Navigation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'All Blog Posts', desc: `${posts.length} articles`, href: '/blog', color: 'var(--accent-50)', textColor: 'var(--accent-600)' },
                { label: 'Silly Questions', desc: `${questions.length} Q&As`, href: '/silly-questions', color: 'var(--coral-50)', textColor: 'var(--coral-600)' },
                { label: 'Search Everything', desc: 'Find by keyword', href: '/search', color: 'var(--surface-muted)', textColor: 'var(--text-secondary)' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 group"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.color, color: item.textColor }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
