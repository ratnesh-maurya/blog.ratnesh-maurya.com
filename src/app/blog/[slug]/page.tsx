import { ArticleMetadata } from '@/components/ArticleMetadata';
import { AuthorCard } from '@/components/AuthorCard';
import { BlogImage } from '@/components/BlogImage';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BookmarkButton } from '@/components/BookmarkButton';
import { CodeCopyButton } from '@/components/CodeCopyButton';
import { Comments } from '@/components/Comments';
import { CopyMarkdownButton } from '@/components/CopyMarkdownButton';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { NewsletterCta } from '@/components/NewsletterCta';
import { ReadingHistoryTracker } from '@/components/ReadingHistoryTracker';
import { mdxComponents } from '@/components/mdx';
import { MobileToc } from '@/components/MobileToc';
import { OgImageInBody } from '@/components/OgImageInBody';
import { PreferredSourceButton } from '@/components/PreferredSourceButton';
import { PostNavigation } from '@/components/PostNavigation';
import { ReadingProgress } from '@/components/ReadingProgress';
import { RecentNews } from '@/components/RecentNews';
import { RelatedPosts } from '@/components/RelatedPosts';
import { RelatedTerms } from '@/components/RelatedTerms';
import { SocialShare } from '@/components/SocialShare';
import { BlogStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { ArticleReferences, TechnicalDetails } from '@/components/TechnicalDetails';
import { TableOfContents } from '@/components/TableOfContents';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { getAllBlogPosts, getAllNewsPosts, getAllTechnicalTermsForListing, getBlogPost, getBlogPostSlugs } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { PORTFOLIO_URL, SITE_URL } from '@/lib/site';
import { tagPath } from '@/lib/taxonomy';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getBlogPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const ogImage = post.socialImage || getStoredOgImageUrl('blog-slug', post.slug) || '/og/home.png';
  const publishedTime = new Date(post.date).toISOString();
  const modifiedTime = post.updated
    ? new Date(post.updated).toISOString()
    : publishedTime;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author, url: `${SITE_URL}/about/` }],
    category: post.category,
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}/`,
      languages: {
        'en-US': `${SITE_URL}/blog/${post.slug}/`,
      },
      types: { ...oembedAlternate(`/blog/${post.slug}`) },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [`${PORTFOLIO_URL}`],
      tags: post.tags,
      url: `${SITE_URL}/blog/${post.slug}/`,
      siteName: 'Ratn Labs',
      locale: 'en_US',
      countryName: 'India',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      article: {
        publishedTime,
        modifiedTime,
        authors: [`${PORTFOLIO_URL}`],
        section: post.category,
        tags: post.tags,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
      images: [ogImage],
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
    applicationName: 'Blog',
    appleWebApp: {
      title: 'Ratnesh Blog',
      capable: true,
      statusBarStyle: 'default',
    },
    other: {
      'article:author': post.author,
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
      'profile:username': 'ratnesh_maurya',
      ...(post.questions && post.questions.length > 0 && {
        'article:questions': post.questions.join(' | '),
        'faq:questions': JSON.stringify(post.questions),
      }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, allPosts, allTerms, allNews] = await Promise.all([getBlogPost(slug), getAllBlogPosts(), getAllTechnicalTermsForListing(), getAllNewsPosts()]);

  if (!post) {
    notFound();
  }

  const ogImage = post.socialImage || getStoredOgImageUrl('blog-slug', post.slug) || '/og/home.png';
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` }
  ];

  return (
    <>
      <OgImageInBody src={ogImage} alt={post.title} />
      <BlogStructuredData post={post} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <ReadingProgress />

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <Link
            href="/blog"
            className="nb-btn inline-flex items-center gap-2 text-sm mb-8 nb-btn-tint"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to library
          </Link>

          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12 xl:gap-16">
            <article className="min-w-0">
              {/* Article Header */}
              <header className="mb-10 lg:mb-14">
                <Breadcrumbs
                  className="mb-5"
                  items={[
                    { name: 'Home', href: '/' },
                    { name: 'Blog', href: '/blog' },
                    { name: post.title, href: `/blog/${post.slug}/` },
                  ]}
                />
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                        style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight mb-6"
                  style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
                  {post.title}
                </h1>

                {/* Description / lede */}
                {post.description && (
                  <p className="text-xl leading-relaxed mb-8 font-medium"
                    style={{ color: 'var(--body)' }}>
                    {post.description}
                  </p>
                )}

                <ArticleMetadata
                  author={post.author}
                  date={post.date}
                  updated={post.updated}
                  readingTime={post.readingTime}
                  category={post.category}
                  actions={<BookmarkButton type="blog" slug={post.slug} title={post.title} href={`/blog/${post.slug}`} />}
                />

                {/* Hero image */}
                {post.image && (
                  <div
                    className="mt-10 overflow-hidden rounded-xl shadow-sm border"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}
                  >
                    <BlogImage
                      src={post.image}
                      alt={post.title}
                      width={1200}
                      height={630}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                )}
              </header>

              <TechnicalDetails
                language={post.language}
                framework={post.framework}
                softwareVersion={post.softwareVersion}
                testedEnvironment={post.testedEnvironment}
                repo={post.repo}
              />

              {/* Mobile table of contents (sidebar TOC is lg+ only) */}
              <MobileToc />

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:font-medium prose-img:rounded-xl"
                style={{
                  '--tw-prose-body': 'var(--body)',
                  '--tw-prose-headings': 'var(--text)',
                  '--tw-prose-links': 'var(--accent-600)',
                  '--tw-prose-bold': 'var(--text)',
                  '--tw-prose-code': 'var(--text)',
                  '--tw-prose-quotes': 'var(--body)',
                  '--tw-prose-hr': 'var(--line)',
                  '--tw-prose-th-borders': 'var(--line)',
                  '--tw-prose-td-borders': 'var(--line)',
                } as React.CSSProperties}
              >
                {post.format === 'mdx' ? (
                  <MDXRemote
                    source={post.content}
                    components={mdxComponents}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeSlug, rehypeHighlight],
                      },
                    }}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
              <CodeCopyButton />

              {/* Footer — Tags & Share */}
              <div className="mt-20 space-y-10">
                <ArticleReferences references={post.references} />

                {post.tags.length > 0 && (
                  <div className="pt-10" style={{ borderTop: '1px solid var(--line)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: 'var(--muted)' }}>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={tagPath(tag)}
                          className="inline-block text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 hover:brightness-95"
                          style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-10" style={{ borderTop: '1px solid var(--line)' }}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--muted)' }}>
                      Share this post
                    </h3>
                    <div className="flex items-center gap-2">
                      {post.rawContent && (
                        <CopyMarkdownButton
                          rawContent={post.rawContent}
                          title={post.title}
                          slug={post.slug}
                          image={post.image}
                        />
                      )}
                      <Link
                        href={`/utm?${new URLSearchParams({
                          url: `/blog/${post.slug}`,
                          title: post.title,
                          description: post.description || '',
                        }).toString()}`}
                        className="nb-btn inline-flex items-center gap-1.5 text-xs nb-btn-tint"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h2l3 8 4-16 4 16 3-8h2" />
                        </svg>
                        UTM
                      </Link>
                    </div>
                  </div>
                  <SocialShare
                    url={`/blog/${post.slug}`}
                    title={post.title}
                    description={post.description}
                  />
                </div>

                <NewsletterCta />

                {/* Author box — E-E-A-T signal */}
                <AuthorCard name={post.author} />

                <PreferredSourceButton />

                {/* Related posts — internal linking for SEO */}
                <RelatedPosts
                  currentSlug={post.slug}
                  currentCategory={post.category}
                  currentTags={post.tags}
                  allPosts={allPosts}
                />

                <RelatedTerms
                  terms={allTerms.filter(term => {
                    const t = term.title.toLowerCase();
                    return post.tags.some(tag => t.includes(tag.toLowerCase())) ||
                      t.includes(post.category.toLowerCase()) ||
                      post.title.toLowerCase().includes(t);
                  }).slice(0, 8)}
                />

                <RecentNews news={allNews} count={3} />

                <Comments />

                {/* Prev / Next navigation */}
                <PostNavigation
                  prev={prevPost ? { slug: prevPost.slug, title: prevPost.title, href: `/blog/${prevPost.slug}`, label: prevPost.category } : null}
                  next={nextPost ? { slug: nextPost.slug, title: nextPost.title, href: `/blog/${nextPost.slug}`, label: nextPost.category } : null}
                />

                {/* Back to Blog CTA */}
                <div className="pt-6 flex items-center justify-between">
                  <Link
                    href="/blog"
                    className="nb-btn inline-flex items-center gap-2 text-sm nb-btn-tint"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to library
                  </Link>
                </div>
              </div>
            </article>

            {/* Table of Contents — right sidebar on lg+ screens */}
            <aside className="hidden lg:block self-start sticky top-24 xl:translate-x-12">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </div>
      <ViewIncrementer type="blog" slug={post.slug} />
      <ReadingHistoryTracker type="blog" slug={post.slug} title={post.title} href={`/blog/${post.slug}`} />
      <FloatingUpvoteButton type="blog" slug={post.slug} />
    </>
  );
}
