import { BlogImage } from '@/components/BlogImage';
import { CodeCopyButton } from '@/components/CodeCopyButton';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { mdxComponents } from '@/components/mdx';
import { OgImageInBody } from '@/components/OgImageInBody';
import { PostNavigation } from '@/components/PostNavigation';
import { ReadingProgress } from '@/components/ReadingProgress';
import { RelatedPosts } from '@/components/RelatedPosts';
import { SocialShare } from '@/components/SocialShare';
import { BlogStructuredData, BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData';
import { TableOfContents } from '@/components/TableOfContents';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { getAllBlogPosts, getBlogPost, getBlogPostSlugs } from '@/lib/content';
import { getStoredOgImageUrl } from '@/lib/og';
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

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

  const ogImage = post.socialImage || getStoredOgImageUrl('blog-slug', post.slug);
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author, url: 'https://ratnesh-maurya.com' }],
    category: post.category,
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
      languages: {
        'en-US': `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [`https://ratnesh-maurya.com`],
      tags: post.tags,
      url: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
      siteName: 'Ratn Labs',
      locale: 'en_US',
      countryName: 'India',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      article: {
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: [`https://ratnesh-maurya.com`],
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
      'pinterest-rich-pin': 'true',
      'article:author': post.author,
      'article:published_time': post.date,
      'article:modified_time': post.date,
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
  const [post, allPosts] = await Promise.all([getBlogPost(slug), getAllBlogPosts()]);

  if (!post) {
    notFound();
  }

  const ogImage = post.socialImage || getStoredOgImageUrl('blog-slug', post.slug);
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' },
    { name: post.title, url: `https://blog.ratnesh-maurya.com/blog/${post.slug}` }
  ];

  // Prepare FAQ questions for structured data (if questions exist)
  // These questions appear in metadata for SEO but are not displayed on the page
  const faqQuestions = post.questions && post.questions.length > 0
    ? post.questions.map((question) => {
      // Create a comprehensive answer that references the blog post
      const answer = `${post.description} This blog post covers ${post.title.toLowerCase()} in detail, providing insights and explanations on this topic.`;
      return {
        question,
        answer,
        slug: post.slug,
      };
    })
    : [];

  return (
    <>
      <OgImageInBody src={ogImage} alt={post.title} />
      <BlogStructuredData post={post} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {faqQuestions.length > 0 && <FAQStructuredData questions={faqQuestions} />}
      <ReadingProgress />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Back navigation bar */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={undefined}
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All posts
            </Link>
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--accent-500)' }}>
                {post.category}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-4xl xl:max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
          <div className="xl:grid xl:grid-cols-[minmax(0,_48rem)_200px] xl:gap-10">
            <article>
              {/* Article Header */}
              <header className="mb-12">
                {/* Title */}
                <h1 className="text-[32px] sm:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight mb-6"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-source-serif, Georgia, serif)', letterSpacing: '-0.02em' }}>
                  {post.title}
                </h1>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-5 text-sm mb-6"
                  style={{ color: 'var(--text-muted)' }}>
                  <time dateTime={post.date} className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readingTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {post.author}
                  </span>
                </div>

                {/* Hero image */}
                {post.image && (
                  <div
                    className="mt-6 mb-8 overflow-hidden rounded-2xl border"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
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

                {/* Description */}
                {post.description && (
                  <p className="text-lg md:text-xl leading-relaxed mb-8"
                    style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-300)', paddingLeft: '1rem' }}>
                    {post.description}
                  </p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-medium px-3 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Separator */}
              <div className="mb-12" style={{ borderTop: '1px solid var(--border)' }} />

              {/* Article Content */}
              <div className="prose max-w-none">
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
              <div className="mt-16 space-y-8">
                {post.tags.length > 0 && (
                  <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: 'var(--text-muted)' }}>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag}`}
                          className="inline-block text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                          style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ color: 'var(--text-muted)' }}>
                    Share this post
                  </h3>
                  <SocialShare
                    url={`/blog/${post.slug}`}
                    title={post.title}
                    description={post.description}
                  />
                </div>

                {/* Author box — E-E-A-T signal */}
                <div className="mt-12 pt-8 flex flex-col sm:flex-row items-start gap-4 rounded-xl p-5"
                  style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://avatars.githubusercontent.com/u/85143283?v=4"
                    alt="Ratnesh Maurya"
                    className="w-14 h-14 rounded-xl flex-shrink-0 object-cover"
                    style={{ outline: '2px solid var(--accent-200)' }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Ratnesh Maurya</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                        Software Engineer
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Backend engineer at Initializ.ai — building scalable systems with Go, Elixir, and Kubernetes.
                      Writing about distributed systems, AWS, and the bugs that cost me hours.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="https://ratnesh-maurya.com" target="_blank" rel="noopener noreferrer author"
                        className="text-xs font-semibold transition-colors" style={{ color: 'var(--accent-500)' }}>
                        Portfolio ↗
                      </a>
                      <a href="https://github.com/ratnesh-maurya" target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>
                        GitHub
                      </a>
                      <a href="https://linkedin.com/in/ratnesh-maurya" target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>
                        LinkedIn
                      </a>
                      <a href="/about" className="text-xs font-semibold transition-colors" style={{ color: 'var(--text-muted)' }}>
                        About
                      </a>
                    </div>
                  </div>
                </div>

                {/* Related posts — internal linking for SEO */}
                <RelatedPosts
                  currentSlug={post.slug}
                  currentCategory={post.category}
                  currentTags={post.tags}
                  allPosts={allPosts}
                />

                {/* Prev / Next navigation */}
                <PostNavigation
                  prev={prevPost ? { slug: prevPost.slug, title: prevPost.title, href: `/blog/${prevPost.slug}`, label: prevPost.category } : null}
                  next={nextPost ? { slug: nextPost.slug, title: nextPost.title, href: `/blog/${nextPost.slug}`, label: nextPost.category } : null}
                />

                {/* Back to Blog CTA */}
                <div className="pt-6 flex items-center justify-between">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                    style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to all posts
                  </Link>
                </div>
              </div>
            </article>

            {/* Table of Contents — right sidebar on xl screens */}
            <aside className="hidden xl:block self-start sticky top-24">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </div>
      <ViewIncrementer type="blog" slug={post.slug} />
      <FloatingUpvoteButton type="blog" slug={post.slug} />
    </>
  );
}
