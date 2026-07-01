'use client';

import { getBookmarks, removeBookmark, type Bookmark } from '@/lib/bookmarks';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TYPE_LABEL: Record<string, string> = {
  blog: 'Blog',
  news: 'News',
  til: 'TIL',
  cheatsheets: 'Cheatsheet',
  'technical-terms': 'Term',
  'silly-questions': 'Question',
};

export function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setLoaded(true);
  }, []);

  const remove = (type: string, slug: string) => {
    removeBookmark(type, slug);
    setBookmarks(getBookmarks());
  };

  if (!loaded) return null;

  if (bookmarks.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow-sm)',
        }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Nothing saved yet
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Tap “Save” on any post and it will show up here.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
          style={{ backgroundColor: 'var(--accent-500)', color: '#fff' }}
        >
          Browse the blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((b) => (
        <div
          key={`${b.type}:${b.slug}`}
          className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
          style={{
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow-sm)',
          }}
        >
          <div className="min-w-0">
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5"
              style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-700)' }}
            >
              {TYPE_LABEL[b.type] ?? b.type}
            </span>
            <Link href={b.href} className="block text-sm font-semibold leading-snug hover:underline truncate" style={{ color: 'var(--text-primary)' }}>
              {b.title}
            </Link>
          </div>
          <button
            onClick={() => remove(b.type, b.slug)}
            aria-label={`Remove ${b.title} from bookmarks`}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer hover:brightness-95"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
