import { getAllBlogPosts, getAllSillyQuestions } from '@/lib/content';
import { WebsiteStructuredData } from '@/components/StructuredData';
import { BlogCardImage, getDefaultSocialImage } from '@/components/BlogImage';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import Link from 'next/link';
import { format } from 'date-fns';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = getDefaultSocialImage('og', 'home');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'home');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;

  return {
    title: "Blog's By Ratnesh - Web Development & Programming",
    description: "A blog about web development, programming, and the silly mistakes we all make along the way. Learn from my experiences and avoid common pitfalls.",
    keywords: ["web development", "programming", "javascript", "typescript", "react", "nextjs", "coding mistakes", "developer blog"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com",
    },
    openGraph: {
      title: "Blog's By Ratnesh - Web Development & Programming",
      description: "A blog about web development, programming, and the silly mistakes we all make along the way. Learn from my experiences and avoid common pitfalls.",
      url: "https://blog.ratnesh-maurya.com",
      siteName: "Blog's By Ratnesh",
      type: "website",
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: "Blog's By Ratnesh - Web Development & Programming",
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog's By Ratnesh - Web Development & Programming",
      description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
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

export default async function Home() {
  const [blogPosts, sillyQuestions] = await Promise.all([
    getAllBlogPosts(),
    getAllSillyQuestions()
  ]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 6);
  const recentQuestions = sillyQuestions.slice(0, 3);

  return (
    <>
      <WebsiteStructuredData />
      <div className="min-h-screen bg-white">
        {/* Featured Posts Carousel */}
        <FeaturedCarousel posts={featuredPosts} />

        {/* Recent Posts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recent Posts</h2>
              <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm sm:text-base">
                View all posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <BlogCardImage post={post} className="h-48 flex-shrink-0" />
                    <div className="p-6 flex flex-col flex-grow">
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
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.description}</p>
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
                      <div className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-auto">
                        Read more →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Silly Questions Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Silly Questions & Mistakes</h2>
              <Link href="/silly-questions" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm sm:text-base">
                View all questions →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentQuestions.map((question) => (
                <Link key={question.slug} href={`/silly-questions/${question.slug}`} className="block h-full">
                  <article className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="text-sm text-gray-500 mb-2">
                      {format(new Date(question.date), 'MMM dd, yyyy')}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors flex-grow">
                      {question.question}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {question.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
