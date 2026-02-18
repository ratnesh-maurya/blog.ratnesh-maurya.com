import { getSillyQuestion, getSillyQuestionSlugs } from '@/lib/content';
import { SillyQuestionStructuredData } from '@/components/StructuredData';
import { SocialShare } from '@/components/SocialShare';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { generateFallbackOGImage } from '@/components/BlogImage';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface SillyQuestionPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getSillyQuestionSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: SillyQuestionPageProps) {
  const { slug } = await params;
  const question = await getSillyQuestion(slug);

  if (!question) {
    return {
      title: 'Question Not Found',
    };
  }

  const ogImageUrl = generateFallbackOGImage(question.question, 'silly-question');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;

  // Extract a preview of the answer for better SEO description
  const answerPreview = question.answer.replace(/<[^>]*>/g, '').substring(0, 150).trim();
  const seoDescription = `${question.question} - Learn from this common ${question.category.toLowerCase()} mistake. ${answerPreview}${answerPreview.length === 150 ? '...' : ''}`;

  return {
    title: `${question.question} | Silly Questions`,
    description: seoDescription,
    keywords: [
      ...question.tags,
      'coding mistakes',
      'programming errors',
      'debugging',
      question.category.toLowerCase(),
      'developer mistakes',
      'common coding errors',
      'troubleshooting',
      'programming tips',
      'learn from mistakes'
    ],
    authors: [{ name: "Ratnesh Maurya", url: "https://ratnesh-maurya.com" }],
    category: question.category,
    alternates: {
      canonical: `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`,
    },
    openGraph: {
      title: question.question,
      description: seoDescription,
      type: 'article',
      publishedTime: question.date,
      modifiedTime: question.date,
      authors: ["Ratnesh Maurya"],
      tags: question.tags,
      section: question.category,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: question.question,
        }
      ],
      url: `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`,
      siteName: 'Blog\'s By Ratnesh',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: question.question,
      description: seoDescription.substring(0, 200),
      images: [fullOgImageUrl],
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
      'article:author': 'Ratnesh Maurya',
      'article:published_time': question.date,
      'article:modified_time': question.date,
      'article:section': question.category,
      'article:tag': question.tags.join(', '),
      'article:expiration_time': undefined,
      'og:locale': 'en_US',
      'og:site_name': 'Blog\'s By Ratnesh',
    },
  };
}

export default async function SillyQuestionPage({ params }: SillyQuestionPageProps) {
  const { slug } = await params;
  const question = await getSillyQuestion(slug);

  if (!question) {
    notFound();
  }

  return (
    <>
      <SillyQuestionStructuredData question={question} />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-6 sm:mb-8 px-2 sm:px-0">
            <Link
              href="/silly-questions"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Silly Questions
            </Link>
          </div>

          <article className="bg-yellow-50 rounded-lg p-3 sm:p-6 lg:p-8 border border-yellow-200">
            <header className="mb-4 sm:mb-6 lg:mb-8">
              <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-2">
                <time dateTime={question.date} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(new Date(question.date), 'MMMM dd, yyyy')}
                </time>
                <span className="hidden sm:inline">•</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                  {question.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                {question.question}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 sm:mb-6">
              </div>

              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {question.tags.map((tag) => (
                  <span key={tag} className="bg-yellow-200 text-yellow-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div
              className="prose prose-base sm:prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-code:text-pink-600 prose-code:bg-yellow-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: question.answer }}
            />

            {/* Social Sharing */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-yellow-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Share this silly question</h3>
              <SocialShare
                url={`/silly-questions/${question.slug}`}
                title={question.question}
                description={`A silly coding mistake: ${question.question}`}
              />
            </div>
          </article>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Have you made a similar mistake? We&apos;ve all been there! 😅
            </p>
            <Link
              href="/silly-questions"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Read More Silly Questions
            </Link>
          </div>
        </div>
      </div>
      <ViewIncrementer slug={`silly-questions/${question.slug}`} />
      <FloatingUpvoteButton slug={`silly-questions/${question.slug}`} />
    </>
  );
}
