import { getAllSillyQuestions } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';
import { getDefaultSocialImage } from '@/components/BlogImage';
import { FAQStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = getDefaultSocialImage('og', 'silly-questions');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'silly-questions');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;

  return {
    title: "Silly Questions & Mistakes | Blog's By Ratnesh",
    description: "We all make silly mistakes while coding. Here are some of mine, along with the lessons learned. Hopefully, they'll save you some debugging time! 🤦‍♂️",
    keywords: ["coding mistakes", "programming errors", "debugging", "silly questions", "developer mistakes", "learning from errors"],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com/silly-questions",
    },
    openGraph: {
      title: "Silly Questions & Mistakes | Blog's By Ratnesh",
      description: "We all make silly mistakes while coding. Here are some of mine, along with the lessons learned. Hopefully, they'll save you some debugging time! 🤦‍♂️",
      url: "https://blog.ratnesh-maurya.com/silly-questions",
      siteName: "Blog's By Ratnesh",
      type: "website",
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: "Silly Questions & Mistakes - Blog's By Ratnesh",
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "Silly Questions & Mistakes | Blog's By Ratnesh",
      description: "We all make silly mistakes while coding. Here are some of mine, along with the lessons learned.",
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

export default async function SillyQuestionsPage() {
  const questions = await getAllSillyQuestions();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Silly Questions', url: 'https://blog.ratnesh-maurya.com/silly-questions' }
  ];

  return (
    <>
      <FAQStructuredData questions={questions} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Silly Questions & Mistakes</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We all make silly mistakes while coding. Here are some of mine, along with the lessons learned.
              Hopefully, they&apos;ll save you some debugging time! 🤦‍♂️
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {questions.map((question) => (
              <Link key={question.slug} href={`/silly-questions/${question.slug}`} className="block">
                <article className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{format(new Date(question.date), 'MMM dd, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                      {question.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                    {question.question}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag) => (
                      <span key={tag} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Read the answer →
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No silly questions yet. Check back soon for some embarrassing mistakes! 😅</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
