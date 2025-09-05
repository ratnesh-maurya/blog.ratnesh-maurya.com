import { getAllBlogPosts, getAllSillyQuestions } from '@/lib/content';
import { WebsiteStructuredData } from '@/components/StructuredData';
import { BlogCardImage } from '@/components/BlogImage';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import Link from 'next/link';
import { format } from 'date-fns';

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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
              <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                View all posts →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <BlogCardImage post={post} className="h-40" />
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Silly Questions & Mistakes</h2>
              <Link href="/silly-questions" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                View all questions →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentQuestions.map((question) => (
                <Link key={question.slug} href={`/silly-questions/${question.slug}`} className="block">
                  <article className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-sm text-gray-500 mb-2">
                      {format(new Date(question.date), 'MMM dd, yyyy')}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {question.question}
                    </h3>
                    <div className="flex flex-wrap gap-2">
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
