'use client';

import { trackEvent } from '@/lib/analytics';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const article = document.querySelector('.prose');
    if (!article) return;

    const elements = article.querySelectorAll('h2[id], h3[id]');
    const items: TocHeading[] = [];
    elements.forEach((el) => {
      const id = el.getAttribute('id');
      if (id) {
        items.push({
          id,
          text: el.textContent?.trim() || '',
          level: el.tagName === 'H2' ? 2 : 3,
        });
      }
    });
    setHeadings(items);
  }, []);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first heading that is currently visible
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length > 0) {
      setActiveId(visible[0].target.id);
    }
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings, handleIntersect]);

  const scrollTo = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
      trackEvent('toc_click', 'Navigation', text);
    }
  };

  if (headings.length < 2) return null;

  return (
    <nav
      className="hidden xl:block max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
      aria-label="Table of contents"
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        On this page
      </p>
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollTo(heading.id, heading.text)}
              className="text-left w-full text-[13px] leading-relaxed py-1 transition-colors duration-150 border-l-2 hover:text-[var(--accent-600)]"
              style={{
                paddingLeft: heading.level === 3 ? '1.25rem' : '0.75rem',
                color: activeId === heading.id ? 'var(--accent-600)' : 'var(--text-muted)',
                borderColor: activeId === heading.id ? 'var(--accent-500)' : 'transparent',
                fontWeight: activeId === heading.id ? 600 : 400,
              }}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          trackEvent('toc_click', 'Navigation', 'Back to top');
        }}
        className="mt-4 pt-3 text-[11px] font-medium flex items-center gap-1 transition-colors hover:text-[var(--accent-600)]"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        Back to top
      </button>
    </nav>
  );
}
