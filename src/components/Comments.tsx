'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Giscus comments (GitHub Discussions). Renders nothing until the four
 * NEXT_PUBLIC_GISCUS_* env vars are set — safe to ship before configuring.
 *
 * Setup: enable Discussions on the repo, install the giscus app
 * (github.com/apps/giscus), then grab values from giscus.app and set:
 *   NEXT_PUBLIC_GISCUS_REPO="owner/repo"
 *   NEXT_PUBLIC_GISCUS_REPO_ID="R_..."
 *   NEXT_PUBLIC_GISCUS_CATEGORY="Announcements"
 *   NEXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_..."
 */
export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  const enabled = Boolean(repo && repoId && category && categoryId);

  // Track the site theme so giscus matches light/dark
  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const read = () => setTheme(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const container = ref.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo!);
    script.setAttribute('data-repo-id', repoId!);
    script.setAttribute('data-category', category!);
    script.setAttribute('data-category-id', categoryId!);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme === 'dark' ? 'dark_dimmed' : 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    container.appendChild(script);
    return () => { container.innerHTML = ''; };
  }, [enabled, repo, repoId, category, categoryId, theme]);

  if (!enabled) return null;

  return (
    <div className="pt-10" style={{ borderTop: '1px solid var(--border)' }}>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
        Discussion
      </h3>
      <div ref={ref} />
    </div>
  );
}
