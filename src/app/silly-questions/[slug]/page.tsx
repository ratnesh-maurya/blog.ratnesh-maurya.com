import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import { OgImageInBody } from '@/components/OgImageInBody';
import { PostNavigation } from '@/components/PostNavigation';
import { SocialShare } from '@/components/SocialShare';
import { SillyQuestionStructuredData } from '@/components/StructuredData';
import { ViewIncrementer } from '@/components/ViewIncrementer';
import { getAllSillyQuestions, getSillyQuestion, getSillyQuestionSlugs } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
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
      types: { ...oembedAlternate(`/silly-questions/${question.slug}`) },
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">

          {/* Back navigation */}
          <Link
            href="/silly-questions"
            className="group inline-flex items-center gap-1.5 text-xs font-medium mb-10 transition-colors hover:text-[var(--accent-500)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Silly Questions
          </Link>

          <article>
            {/* Header */}
            <header className="mb-10">
              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="nb-badge nb-badge-primary inline-flex items-center">
                  {question.category}
                </span>
                <span aria-hidden="true" style={{ color: 'var(--border)' }}>·</span>
                <time dateTime={question.date}>
                  {format(new Date(question.date), 'MMMM d, yyyy')}
                </time>
                <Link
                  href={`/utm?${new URLSearchParams({
                    url: `/silly-questions/${question.slug}`,
                    title: question.question,
                    description: `A silly coding mistake: ${question.question}`,
                  }).toString()}`}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors hover:border-[var(--accent-400)] hover:text-[var(--text-primary)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h2l3 8 4-16 4 16 3-8h2" />
                  </svg>
                  UTM
                </Link>
              </div>

              {/* Question title */}
              <h1
                className="font-extrabold text-3xl md:text-4xl tracking-tight leading-tight mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {question.question}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <span key={tag} className="nb-badge nb-badge-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Answer section */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid var(--nb-border)', boxShadow: 'var(--nb-shadow)' }}>
              <div
                className="px-5 py-3 flex items-center gap-2.5"
                style={{
                  backgroundColor: 'var(--nb-card-0)',
                  borderBottom: '2px solid var(--nb-border)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: 'var(--accent-500)' }}
                >
                  A
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                  The Answer
                </span>
              </div>

              <div className="px-6 sm:px-8 py-8">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: question.answer }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 space-y-8">
              {/* Share */}
              <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
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
              />
            </div>
          </article>
        </div>
      </div>
      <ViewIncrementer type="silly-questions" slug={question.slug} />
      <FloatingUpvoteButton type="silly-questions" slug={question.slug} />
    </>
  );
}
