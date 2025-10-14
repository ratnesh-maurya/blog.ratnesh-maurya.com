import { getBlogPost, getBlogPostSlugs } from '@/lib/content';
import { generateTableOfContents } from '@/lib/toc';
import { BlogStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { getSocialImageUrl } from '@/components/BlogImage';
import { SocialShare } from '@/components/SocialShare';
import { ReadingProgress } from '@/components/ReadingProgress';
import { EnhancedTableOfContents } from '@/components/EnhancedTableOfContents';
import { ArticleHeader } from '@/components/ArticleHeader';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
      images: [fullTwitterImageUrl],
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

  const toc = generateTableOfContents(post.content);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Blog', url: 'https://blog.ratnesh-maurya.com/blog' },
    { name: post.title, url: `https://blog.ratnesh-maurya.com/blog/${post.slug}` }
  ];

  return (
    <>
      <BlogStructuredData post={post} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <ReadingProgress />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Back Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-12">
                  <ArticleHeader post={post} />

                  {/* Article Content */}
                  <div className="prose prose-base sm:prose-lg max-w-none">
                    <div
                      className="prose-headings:scroll-mt-24 prose-headings:font-bold prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700 prose-img:rounded-xl prose-img:shadow-lg"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>

                {/* Social Sharing */}
                <div className="px-4 sm:px-6 lg:px-12 pb-4 sm:pb-6 lg:pb-12">
                  <div className="pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200">
                    <div className="flex items-center mb-4 sm:mb-6">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Share this article</h3>
                    </div>
                    <SocialShare
                      url={`/blog/${post.slug}`}
                      title={post.title}
                      description={post.description}
                    />
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar with Table of Contents */}
            <div className="hidden lg:block lg:col-span-1">
              <EnhancedTableOfContents toc={toc} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
