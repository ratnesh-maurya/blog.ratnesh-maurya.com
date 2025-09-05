import { getAllSillyQuestions } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function SillyQuestionsPage() {
  const questions = await getAllSillyQuestions();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Silly Questions & Mistakes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We all make silly mistakes while coding. Here are some of mine, along with the lessons learned.
            Hopefully, they&apos;ll save you some debugging time! 🤦‍♂️
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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
  );
}
