import { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPageClient } from '@/app/search/SearchPageClient';

export const metadata: Metadata = {
  title: 'Search — Ratn Labs',
  description: 'Search all blog posts, silly questions, and topics on Ratn Labs. Find articles on system design, Go, AWS, web development, and more.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/search' },
  openGraph: {
    title: 'Search — Ratn Labs',
    description: 'Search all blog posts and Q&As on Ratn Labs.',
    url: 'https://blog.ratnesh-maurya.com/search',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

function SearchFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--background)' }}>
      <div className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-300)', borderTopColor: 'transparent' }} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}
