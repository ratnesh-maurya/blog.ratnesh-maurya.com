import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { BookmarksList } from '@/components/BookmarksList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bookmarks — Ratn Labs',
  description: 'Posts you saved for later. Stored privately in your browser.',
  robots: { index: false, follow: true },
};

const breadcrumbItems = [
  { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
  { name: 'Bookmarks', url: 'https://blog.ratnesh-maurya.com/bookmarks' },
];

export default function BookmarksPage() {
  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen hero-gradient-bg" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          <p className="nb-section-label mb-2" style={{ color: 'var(--accent-500)' }}>
            Reading list
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Bookmarks
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
            Posts you saved for later. Stored privately in this browser — nothing leaves your device.
          </p>
          <BookmarksList />
        </div>
      </div>
    </>
  );
}
