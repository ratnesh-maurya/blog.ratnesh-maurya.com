import { getAllSillyQuestions } from '@/lib/content';
import { FAQStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { SillyQuestionsListingClient } from '@/components/SillyQuestionsListingClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Silly Questions & Coding Mistakes",
    description: "Common coding mistakes and silly questions every developer encounters. Learn from real debugging experiences, troubleshooting tips, and programming errors. Save time debugging with these practical lessons! 🤦‍♂️",
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
      canonical: "https://blog.ratnesh-maurya.com/silly-questions",
    },
    openGraph: {
      title: "Silly Questions & Mistakes | Ratn Labs",
      description: "We all make silly mistakes while coding. Here are some of mine, along with the lessons learned. Hopefully, they'll save you some debugging time! 🤦‍♂️",
      url: "https://blog.ratnesh-maurya.com/silly-questions",
      siteName: "Ratn Labs",
      type: "website",
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "Silly Questions & Mistakes | Ratn Labs",
      description: "We all make silly mistakes while coding. Here are some of mine, along with the lessons learned.",
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

interface SillyQuestionsPageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function SillyQuestionsPage({ searchParams }: SillyQuestionsPageProps) {
  const questions = await getAllSillyQuestions();

  const resolvedParams = await searchParams;
  const rawCategory = resolvedParams?.category;
  // Decode slug back to display label: "css" → "CSS", "javascript" → "JavaScript"
  const initialCategory = rawCategory
    ? decodeURIComponent(rawCategory).replace(/-/g, ' ').trim()
    : null;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Silly Questions', url: 'https://blog.ratnesh-maurya.com/silly-questions' }
  ];

  return (
    <>
      <FAQStructuredData questions={questions} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SillyQuestionsListingClient questions={questions} initialCategory={initialCategory} />
    </>
  );
}
