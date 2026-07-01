'use client';

import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';
import { useEffect, useState } from 'react';

interface BookmarkButtonProps {
  type: string;
  slug: string;
  title: string;
  href: string;
}

/** Save-for-later toggle shown in post headers. */
export function BookmarkButton({ type, slug, title, href }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(type, slug));
    setMounted(true);
  }, [type, slug]);

  const onClick = () => {
    setSaved(toggleBookmark({ type, slug, title, href }));
  };

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove bookmark' : 'Save for later'}
      title={saved ? 'Remove bookmark' : 'Save for later'}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
      style={{
        backgroundColor: saved ? 'var(--accent-50)' : 'var(--glass-bg)',
        color: saved ? 'var(--accent-600)' : 'var(--text-muted)',
        border: `1px solid ${saved ? 'var(--accent-200)' : 'var(--glass-border)'}`,
        opacity: mounted ? 1 : 0.6,
      }}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
