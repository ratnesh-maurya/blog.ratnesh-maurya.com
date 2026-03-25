import { NewsContent } from '@/components/NewsContent';
import { RecentNews } from '@/components/RecentNews';
import { RelatedPosts } from '@/components/RelatedPosts';
import { RelatedTerms } from '@/components/RelatedTerms';
import { BreadcrumbStructuredData, NewsArticleStructuredData } from '@/components/StructuredData';
import { getAllBlogPosts, getAllNewsPosts, getAllTechnicalTermsForListing, getNewsPost, getNewsPostSlugs } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface NewsPostPageProps {
  params: Promise<{ slug: string }>;
}

function fmtDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateStaticParams() {
  const slugs = getNewsPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post) {
    return { title: 'News Not Found' };
  }

  const ogUrl = getStoredOgImageUrl('news-slug', post.slug);

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: `https://blog.ratnesh-maurya.com/news/${post.slug}/`,
      types: { ...oembedAlternate(`/news/${post.slug}`) },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      url: `https://blog.ratnesh-maurya.com/news/${post.slug}/`,
      siteName: 'Ratn Labs',
      locale: 'en_US',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
      images: [ogUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const [post, allNews, allBlogPosts, allTerms] = await Promise.all([
    getNewsPost(slug),
    getAllNewsPosts(),
    getAllBlogPosts(),
    getAllTechnicalTermsForListing()
  ]);

  if (!post) {
    notFound();
  }

  const index = allNews.findIndex((item) => item.slug === post.slug);
  const newerPost = index > 0 ? allNews[index - 1] : null;
  const olderPost = index < allNews.length - 1 ? allNews[index + 1] : null;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'News', url: 'https://blog.ratnesh-maurya.com/news' },
    { name: post.title, url: `https://blog.ratnesh-maurya.com/news/${post.slug}` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <NewsArticleStructuredData post={post} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <Link
          href="/news"
          className="nb-btn inline-flex items-center gap-2 text-sm mb-8"
          style={{ backgroundColor: 'var(--nb-card-0)', color: '#1C1C1A' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all digests
        </Link>

        <article className="nb-card p-6 md:p-8" style={{ backgroundColor: 'var(--nb-card-featured)' }}>
          <header className="mb-8 pb-6" style={{ borderBottom: '2px solid var(--nb-border)' }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="nb-badge nb-badge-primary">News Digest</span>
              <time className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                {fmtDate(post.date)}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {post.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <NewsContent html={post.content} />
        </article>

        <RelatedTerms terms={allTerms} count={10} />
        <RelatedPosts allPosts={allBlogPosts} currentTags={post.tags} />
        <RecentNews news={allNews} currentSlug={post.slug} count={6} />

        <aside
          className="nb-card mt-8 p-6"
          style={{ backgroundColor: 'var(--nb-card-2)' }}
        >
          <h2 className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
            Keep Exploring
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" className="nb-btn text-sm" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}>
              Blog
            </Link>
            <Link href="/technical-terms" className="nb-btn text-sm" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}>
              Technical Terms
            </Link>
            <Link href="/topics" className="nb-btn text-sm" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}>
              Topics
            </Link>
            <Link href="/resources" className="nb-btn text-sm" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)' }}>
              Resources
            </Link>
          </div>
        </aside>

        {(newerPost || olderPost) && (
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
            {newerPost ? (
              <Link href={`/news/${newerPost.slug}`} className="nb-card p-4" style={{ backgroundColor: 'var(--nb-card-0)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Newer digest</p>
                <p className="font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{newerPost.title}</p>
              </Link>
            ) : (
              <div />
            )}
            {olderPost ? (
              <Link href={`/news/${olderPost.slug}`} className="nb-card p-4" style={{ backgroundColor: 'var(--nb-card-1)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Older digest</p>
                <p className="font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{olderPost.title}</p>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
