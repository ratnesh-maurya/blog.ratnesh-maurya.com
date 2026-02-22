import { getSillyQuestion, getSillyQuestionSlugs, getAllSillyQuestions } from '@/lib/content';
import { PostNavigation } from '@/components/PostNavigation';
import { SillyQuestionStructuredData } from '@/components/StructuredData';
import { SocialShare } from '@/components/SocialShare';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { OgImageInBody } from '@/components/OgImageInBody';
import { getStoredOgImageUrl } from '@/lib/og';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface SillyQuestionPageProps {
  params: Promise<{ slug: string }>;
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
      url: `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`,
      siteName: 'Ratn Labs',
      locale: 'en_US',
      images: [{ url: getStoredOgImageUrl('silly-question', question.slug), width: 1200, height: 630, alt: question.question }],
    },
    twitter: {
      card: 'summary_large_image',
      title: question.question,
      description: seoDescription.substring(0, 200),
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
      images: [getStoredOgImageUrl('silly-question', question.slug)],
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
  const [question, allQuestions] = await Promise.all([getSillyQuestion(slug), getAllSillyQuestions()]);

  if (!question) {
    notFound();
  }

  const currentIndex = allQuestions.findIndex(q => q.slug === slug);
  const prevQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;
  const nextQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('silly-question', question.slug)} alt={question.question} />
      <SillyQuestionStructuredData question={question} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        {/* Back navigation */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              href="/silly-questions"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All silly questions
            </Link>
            <span className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--coral-400)' }}>
              Debug Diary
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
          <article>
            {/* Header */}
            <header className="mb-10">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <time dateTime={question.date}
                  className="flex items-center gap-1.5 text-sm"
                  style={{ color: 'var(--text-muted)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(new Date(question.date), 'MMMM d, yyyy')}
                </time>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--coral-50)', color: 'var(--coral-500)' }}>
                  {question.category}
                </span>
              </div>

              {/* Question as heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-5"
                style={{ color: 'var(--text-primary)' }}>
                {question.question}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--coral-50)', color: 'var(--coral-500)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Answer section */}
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border)' }}>
              {/* Answer label */}
              <div className="px-6 py-3 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(90deg, var(--coral-50) 0%, var(--accent-50) 100%)',
                  borderBottom: '1px solid var(--border)',
                }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--coral-400), var(--gold-400))' }}>
                  A
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  The Answer
                </span>
              </div>

              <div className="px-6 sm:px-8 py-8">
                <div className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: question.answer }} />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 space-y-8">
              {/* Share */}
              <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: 'var(--text-muted)' }}>
                  Share this question
                </h3>
                <SocialShare
                  url={`/silly-questions/${question.slug}`}
                  title={question.question}
                  description={`A silly coding mistake: ${question.question}`}
                />
              </div>

              {/* Prev / Next navigation */}
              <PostNavigation
                prev={prevQuestion ? { slug: prevQuestion.slug, title: prevQuestion.question, href: `/silly-questions/${prevQuestion.slug}`, label: prevQuestion.category } : null}
                next={nextQuestion ? { slug: nextQuestion.slug, title: nextQuestion.question, href: `/silly-questions/${nextQuestion.slug}`, label: nextQuestion.category } : null}
                accentVar="--coral-500"
              />

              {/* CTA */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Have you made a similar mistake? We&apos;ve all been there! 😅
                </p>
                <Link
                  href="/silly-questions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, var(--coral-400), var(--coral-500))',
                    color: '#FAFAF8',
                  }}
                >
                  More Silly Questions
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
      <ViewIncrementer type="silly-questions" slug={question.slug} />
      <FloatingUpvoteButton type="silly-questions" slug={question.slug} />
    </>
  );
}
