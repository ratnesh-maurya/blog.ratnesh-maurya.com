import { getBlogPost, getBlogPostSlugs } from '@/lib/content';
import { BlogStructuredData, BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData';
import { getSocialImageUrl } from '@/components/BlogImage';
import { SocialShare } from '@/components/SocialShare';
import { ReadingProgress } from '@/components/ReadingProgress';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
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

  const socialImageUrl = getSocialImageUrl({ post, type: 'og' });
  const twitterImageUrl = getSocialImageUrl({ post, type: 'twitter' });
  const fullSocialImageUrl = socialImageUrl.startsWith('/')
    ? `https://blog.ratnesh-maurya.com${socialImageUrl}`
    : socialImageUrl;
  const fullTwitterImageUrl = twitterImageUrl.startsWith('/')
    ? `https://blog.ratnesh-maurya.com${twitterImageUrl}`
    : twitterImageUrl;

  return {
    title: `${post.title} | Blog's By Ratnesh`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    category: post.category,
    alternates: {
      canonical: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: fullSocialImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      url: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
      siteName: 'Ratnesh Maurya\'s Blog',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [
        {
          url: fullTwitterImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
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
    other: {
      'pinterest-rich-pin': 'true',
      'article:author': post.author,
      'article:published_time': post.date,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

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
      <BlogStructuredData post={post} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {faqQuestions.length > 0 && <FAQStructuredData questions={faqQuestions} />}
      <ReadingProgress />

      <div className="min-h-screen bg-white">
        {/* Back Navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group text-sm"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-16 py-8 lg:py-16">
          <article>
            {/* Article Header */}
            <header className="mb-12  ">
              {/* Category */}
              {post.category && (
                <div className="mb-4">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight text-center">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 mb-8">
                <time dateTime={post.date} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(new Date(post.date), 'MMM dd, yyyy')}
                </time>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.readingTime}
                </span>
              </div>

              {/* Description */}
              {post.description && (
                <p className="text-lg text-center text-gray-600 mb-8 leading-relaxed">
                  {post.description}
                </p>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Separator */}
            <div className="border-t border-gray-200 mb-12"></div>

            {/* Article Content */}
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-12 prose-headings:mb-6 prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-10 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-blue-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-li:text-gray-700 prose-li:mb-2 prose-hr:my-12 prose-hr:border-gray-200">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags Section */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="inline-block text-sm font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Share</h3>
              <SocialShare
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
              />
            </div>
          </article>
        </div>
      </div>
      <ViewIncrementer slug={post.slug} />
      <FloatingUpvoteButton slug={post.slug} />
    </>
  );
}
