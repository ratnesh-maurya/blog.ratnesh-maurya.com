import { getAllBlogPosts } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';
import { BlogCardImage, getDefaultSocialImage } from '@/components/BlogImage';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = getDefaultSocialImage('og', 'blog');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'blog');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;

  return {
    title: "All Blog Posts | Blog's By Ratnesh",
    description: "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.",
    keywords: ["blog posts", "web development", "programming", "javascript", "typescript", "react", "nextjs", "technology"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com/blog",
    },
    openGraph: {
      title: "All Blog Posts | Blog's By Ratnesh",
      description: "Explore all my thoughts on web development, programming, and technology. Learn from real-world experiences and practical insights.",
      url: "https://blog.ratnesh-maurya.com/blog",
      siteName: "Blog's By Ratnesh",
      type: "website",
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: "All Blog Posts - Blog's By Ratnesh",
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "All Blog Posts | Blog's By Ratnesh",
      description: "Explore all my thoughts on web development, programming, and technology.",
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
  };
}

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">All Blog Posts</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Explore all my thoughts on web development, programming, and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <BlogCardImage post={post} className="h-48" />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime}</span>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>
                    )}
                  </div>
                  <div className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read more →
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
