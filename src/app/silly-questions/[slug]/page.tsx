import { getSillyQuestion, getSillyQuestionSlugs } from '@/lib/content';
import { SillyQuestionStructuredData } from '@/components/StructuredData';
import { SocialShare } from '@/components/SocialShare';
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

  return {
    title: `${question.question} | Silly Questions`,
    description: `A silly mistake I made: ${question.question}. Learn from my experience and avoid this common pitfall.`,
    keywords: [...question.tags, 'coding mistakes', 'programming errors', 'debugging'],
    authors: [{ name: "Ratnesh Maurya" }],
    category: question.category,
    alternates: {
      canonical: `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`,
    },
    openGraph: {
      title: question.question,
      description: `A silly mistake I made: ${question.question}. Learn from my experience and avoid this common pitfall.`,
      type: 'article',
      publishedTime: question.date,
      modifiedTime: question.date,
      authors: ["Ratnesh Maurya"],
      tags: question.tags,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: question.question,
        }
      ],
      url: `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`,
      siteName: 'Ratnesh Maurya\'s Blog',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: question.question,
      description: `A silly mistake I made: ${question.question}`,
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
      'article:section': question.category,
      'article:tag': question.tags.join(', '),
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link
              href="/silly-questions"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Silly Questions
            </Link>
          </div>

          <article className="bg-yellow-50 rounded-lg p-4 sm:p-6 lg:p-8 border border-yellow-200">
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
                <span>{format(new Date(question.date), 'MMMM dd, yyyy')}</span>
                <span className="hidden sm:inline">•</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                  {question.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                {question.question}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <span key={tag} className="bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-code:text-pink-600 prose-code:bg-yellow-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: question.answer }}
            />

            {/* Social Sharing */}
            <div className="mt-8 pt-6 border-t border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this silly question</h3>
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
    </>
  );
}
