import { OgImageInBody } from '@/components/OgImageInBody';
import { SillyQuestionsListingClient } from '@/components/SillyQuestionsListingClient';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllSillyQuestionsForListing } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = getStoredOgImageUrl('silly-questions');
  return {
    title: "Silly Questions & Coding Mistakes",
    description: "Common coding mistakes and silly questions every developer hits. Learn from real debugging writeups, troubleshooting patterns, and practical fixes. Save time debugging →",
    keywords: [
      "coding mistakes",
      "programming errors",
      "debugging",
      "silly questions",
      "developer mistakes",
      "learning from errors",
      "troubleshooting",
      "common coding errors",
      "programming tips",
      "debugging tips",
      "javascript errors",
      "css mistakes",
      "code debugging"
    ],
    authors: [{ name: "Ratnesh Maurya" }],
    alternates: {
      canonical: "https://blog.ratnesh-maurya.com/silly-questions/",
      types: { ...oembedAlternate('/silly-questions') },
    },
    openGraph: {
      title: "Silly Questions & Mistakes | Ratn Labs",
      description: "We all make silly mistakes while coding. Here are some of mine, with the lessons learned—so you can debug faster.",
      url: "https://blog.ratnesh-maurya.com/silly-questions/",
      siteName: "Ratn Labs",
      type: "website",
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Silly Questions & Coding Mistakes' }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Silly Questions & Mistakes | Ratn Labs",
      description: "We all make silly mistakes while coding. Here are some of mine, along with the lessons learned.",
      creator: '@ratnesh_maurya',
      site: '@ratnesh_maurya',
      images: [ogImage],
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
  const questions = await getAllSillyQuestionsForListing();
  const allCategories = Array.from(new Set(questions.map(q => q.category).filter(Boolean)));

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Silly Questions', url: 'https://blog.ratnesh-maurya.com/silly-questions' }
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('silly-questions')} alt="Silly Questions & Coding Mistakes" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="hero-gradient-bg">
          <div className="page-header max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Debug Diary
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Silly Questions &{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Mistakes
              </span>
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl"
              style={{ color: 'var(--text-muted)' }}>
              We all make silly mistakes while coding. Here are some of mine, along with the lessons
              learned — hopefully they&apos;ll save you some debugging time.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6"
              style={{ borderTop: '1px solid var(--border)' }}>
              <span className="nb-badge nb-badge-muted">
                {questions.length} questions & answers
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
                {allCategories.length} categories
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <SillyQuestionsListingClient questions={questions} />
        </div>
      </div>
    </>
  );
}
