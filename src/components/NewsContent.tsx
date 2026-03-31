'use client';

import { CSSProperties, useEffect, useRef } from 'react';

const SMALL_IMAGE_THRESHOLD = 400; // px — treat as logo/icon and use natural width

declare global {
  interface Window {
    twttr?: { widgets: { load: (el?: HTMLElement) => void } };
  }
}

export function NewsContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (container.querySelector('.twitter-tweet')) {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(container);
      } else {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => window.twttr?.widgets.load(container);
        document.body.appendChild(script);
      }
    }

    const imgs = container.querySelectorAll<HTMLImageElement>('img');

    imgs.forEach((img) => {
      const handleError = () => {
        // Hide the wrapping <p> too so it leaves no empty gap
        const wrapper = img.closest('p') ?? img.parentElement;
        if (wrapper) wrapper.style.display = 'none';
        else img.style.display = 'none';
      };

      const handleLoad = () => {
        if (img.naturalWidth > 0 && img.naturalWidth < SMALL_IMAGE_THRESHOLD) {
          img.style.maxWidth = `${img.naturalWidth}px`;
          img.style.width = 'auto';
          img.style.height = 'auto';
        }
      };

      img.addEventListener('error', handleError);
      img.addEventListener('load', handleLoad);

      // Handle already-cached images (complete = true synchronously)
      if (img.complete) {
        if (!img.naturalWidth) handleError();
        else handleLoad();
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose prose-lg !max-w-none w-full prose-headings:font-bold prose-h2:mt-12 prose-h2:border-b prose-h2:pb-4 prose-h2:border-[var(--nb-border)] prose-a:font-semibold prose-img:rounded-xl prose-img:border prose-img:border-[var(--nb-border)] prose-img:shadow-sm prose-hr:border-[var(--nb-border)] prose-hr:my-12 prose-hr:border-t-2 prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent-500)] prose-blockquote:bg-[var(--surface-muted)] prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:font-medium prose-blockquote:text-[var(--text-primary)] prose-blockquote:not-italic"
      style={{
        '--tw-prose-body': 'var(--text-secondary)',
        '--tw-prose-headings': 'var(--text-primary)',
        '--tw-prose-links': 'var(--accent-600)',
        '--tw-prose-bold': 'var(--text-primary)',
        '--tw-prose-code': 'var(--text-primary)',
        '--tw-prose-hr': 'var(--nb-border)',
      } as CSSProperties}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
