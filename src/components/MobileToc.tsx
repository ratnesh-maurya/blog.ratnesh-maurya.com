'use client';

import { useEffect, useState } from 'react';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Collapsible table of contents for mobile readers — the sticky sidebar
 * TOC is desktop-only, so long posts were unnavigable on phones.
 */
export function MobileToc() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const article = document.querySelector('.prose');
    if (!article) return;
    const items: TocHeading[] = [];
    article.querySelectorAll('h2[id], h3[id]').forEach((el) => {
      const id = el.getAttribute('id');
      if (id) items.push({ id, text: el.textContent?.trim() || '', level: el.tagName === 'H2' ? 2 : 3 });
    });
    setHeadings(items);
  }, []);

  if (headings.length < 3) return null;

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <div
      className="lg:hidden mb-8 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow-sm)',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-500)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
          </svg>
          On this page
        </span>
        <svg
          className="w-4 h-4 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'none', color: 'var(--text-muted)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <nav className="px-5 pb-4" aria-label="Table of contents">
          <ul className="space-y-1.5">
            {headings.map((h) => (
              <li key={h.id} style={{ paddingLeft: h.level === 3 ? '1rem' : 0 }}>
                <button
                  type="button"
                  onClick={() => jump(h.id)}
                  className="text-left text-sm leading-snug hover:underline"
                  style={{ color: h.level === 2 ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
