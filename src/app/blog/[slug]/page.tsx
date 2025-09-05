import { getBlogPost, getBlogPostSlugs } from '@/lib/content';
import { generateTableOfContents, TocItem } from '@/lib/toc';
import { BlogStructuredData } from '@/components/StructuredData';
import { getSocialImageUrl } from '@/components/BlogImage';
import { SocialShare } from '@/components/SocialShare';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:sticky lg:top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li key={item.id} className={`${item.level > 2 ? 'ml-4' : ''}`}>
              <a
                href={`#${item.id}`}
                className={`block text-sm hover:text-blue-600 transition-colors ${item.level === 1 ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
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

  return (
    <>
      <BlogStructuredData post={post} />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Blog
            </Link>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none overflow-hidden">
                <header className="mb-8">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime}</span>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {post.category}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                </header>

                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>
                </div>

                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-pre:max-w-full prose-table:overflow-x-auto prose-table:max-w-full"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Social Sharing */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
                  <SocialShare
                    url={`/blog/${post.slug}`}
                    title={post.title}
                    description={post.description}
                  />
                </div>
              </article>
            </div>

            {/* Sidebar with Table of Contents - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1">
              <TableOfContents toc={toc} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
