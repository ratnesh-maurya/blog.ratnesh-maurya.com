import { getAllSillyQuestions } from '@/lib/content';
import { getDefaultSocialImage } from '@/components/BlogImage';
import { FAQStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { SillyQuestionsListingClient } from '@/components/SillyQuestionsListingClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = getDefaultSocialImage('og', 'silly-questions');
  const twitterImageUrl = getDefaultSocialImage('twitter', 'silly-questions');
  const fullOgImageUrl = `https://blog.ratnesh-maurya.com${ogImageUrl}`;
  const fullTwitterImageUrl = `https://blog.ratnesh-maurya.com${twitterImageUrl}`;

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
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: "Silly Questions & Mistakes - Ratn Labs",
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: "Silly Questions & Mistakes | Ratn Labs",
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
      <SillyQuestionsListingClient questions={questions} />
    </>
  );
}
