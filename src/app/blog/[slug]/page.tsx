import { BlogImage } from '@/components/BlogImage';
import { CodeCopyButton } from '@/components/CodeCopyButton';
import { CopyMarkdownButton } from '@/components/CopyMarkdownButton';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { mdxComponents } from '@/components/mdx';
import { OgImageInBody } from '@/components/OgImageInBody';
import { PostNavigation } from '@/components/PostNavigation';
import { ReadingProgress } from '@/components/ReadingProgress';
import { RelatedPosts } from '@/components/RelatedPosts';
import { RelatedTerms } from '@/components/RelatedTerms';
import { SocialShare } from '@/components/SocialShare';
import { BlogStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { TableOfContents } from '@/components/TableOfContents';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { getAllBlogPosts, getAllTechnicalTermsForListing, getBlogPost, getBlogPostSlugs } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
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
      canonical: `https://blog.ratnesh-maurya.com/blog/${post.slug}/`,
      languages: {
        'en-US': `https://blog.ratnesh-maurya.com/blog/${post.slug}/`,
      },
      types: { ...oembedAlternate(`/blog/${post.slug}`) },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [`https://ratnesh-maurya.com`],
      tags: post.tags,
      url: `https://blog.ratnesh-maurya.com/blog/${post.slug}/`,
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
  const [post, allPosts, allTerms] = await Promise.all([getBlogPost(slug), getAllBlogPosts(), getAllTechnicalTermsForListing()]);

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
            className="nb-btn inline-flex items-center gap-2 text-sm mb-8"
            style={{ backgroundColor: 'var(--nb-card-0)', color: 'var(--text-primary)' }}
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
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                        style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-700)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight mb-6"
                  style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                  {post.title}
                </h1>

                {/* Description / lede */}
                {post.description && (
                  <p className="text-xl leading-relaxed mb-8 font-medium"
                    style={{ color: 'var(--text-secondary)' }}>
                    {post.description}
                  </p>
                )}

                {/* Author strip + metadata */}
                <div className="flex items-center gap-3 text-sm pb-8 border-b"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://avatars.githubusercontent.com/u/85143283?v=4"
                    alt="Ratnesh Maurya"
                    className="w-10 h-10 rounded-full flex-shrink-0 object-cover border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold border-b border-transparent hover:border-current transition-colors cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5 mt-0.5" style={{ fontSize: '13px' }}>
                      <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </span>
                  </div>
                </div>

                {/* Hero image */}
                {post.image && (
                  <div
                    className="mt-10 overflow-hidden rounded-xl shadow-sm border"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
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

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:font-medium prose-img:rounded-xl"
                style={{
                  '--tw-prose-body': 'var(--text-secondary)',
                  '--tw-prose-headings': 'var(--text-primary)',
                  '--tw-prose-links': 'var(--accent-600)',
                  '--tw-prose-bold': 'var(--text-primary)',
                  '--tw-prose-code': 'var(--text-primary)',
                  '--tw-prose-quotes': 'var(--text-secondary)',
                  '--tw-prose-hr': 'var(--border)',
                  '--tw-prose-th-borders': 'var(--border)',
                  '--tw-prose-td-borders': 'var(--border)',
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
                {post.tags.length > 0 && (
                  <div className="pt-10" style={{ borderTop: '1px solid var(--border)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: 'var(--text-muted)' }}>
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag}`}
                          className="inline-block text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200 hover:brightness-95"
                          style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-10" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)' }}>
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
                        className="nb-btn inline-flex items-center gap-1.5 text-xs"
                        style={{ backgroundColor: 'var(--nb-card-2)', color: 'var(--text-primary)' }}
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

                {/* Author box — E-E-A-T signal */}
                <div className="mt-14 flex flex-col sm:flex-row items-start gap-5 rounded-2xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, var(--surface) 0%, color-mix(in srgb, var(--accent-50) 40%, var(--surface)) 100%)',
                    border: '1px solid var(--border)',
                  }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://avatars.githubusercontent.com/u/85143283?v=4"
                    alt="Ratnesh Maurya"
                    className="w-16 h-16 rounded-2xl flex-shrink-0 object-cover"
                    style={{ outline: '2px solid var(--accent-200)' }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Ratnesh Maurya</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                        Software Engineer
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
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

                <RelatedTerms
                  terms={allTerms.filter(term => {
                    const t = term.title.toLowerCase();
                    return post.tags.some(tag => t.includes(tag.toLowerCase())) ||
                      t.includes(post.category.toLowerCase()) ||
                      post.title.toLowerCase().includes(t);
                  }).slice(0, 8)}
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
                    className="nb-btn inline-flex items-center gap-2 text-sm"
                    style={{ backgroundColor: 'var(--nb-card-0)', color: 'var(--text-primary)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to library
                  </Link>
                </div>
              </div>
            </article>

            {/* Table of Contents — right sidebar on xl screens */}
            <aside className="hidden xl:block self-start sticky top-24 xl:translate-x-12">
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
