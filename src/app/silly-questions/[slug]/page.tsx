import { getSillyQuestion, getSillyQuestionSlugs } from '@/lib/content';
import { SillyQuestionStructuredData } from '@/components/StructuredData';
import { SocialShare } from '@/components/SocialShare';
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

  return {
    title: `${question.question} | Ratnesh Maurya's Blog`,
    description: `A silly mistake I made: ${question.question}`,
    keywords: question.tags,
    openGraph: {
      title: question.question,
      description: `A silly mistake I made: ${question.question}`,
      type: 'article',
      publishedTime: question.date,
    },
    twitter: {
      card: 'summary',
      title: question.question,
      description: `A silly mistake I made: ${question.question}`,
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

          <article className="bg-yellow-50 rounded-lg p-8 border border-yellow-200">
            <header className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{format(new Date(question.date), 'MMMM dd, yyyy')}</span>
                <span className="mx-2">•</span>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                  {question.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">
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
