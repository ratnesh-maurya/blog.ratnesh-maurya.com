'use client';

import { trackEvent } from '@/lib/analytics';
import { useState } from 'react';

const BASE_URL = 'https://blog.ratnesh-maurya.com';

interface CopyMarkdownButtonProps {
  rawContent: string;
  title: string;
  slug: string;
  image?: string;
}

/**
 * Rewrites relative image/link paths in markdown to absolute URLs
 * pointing to the deployed blog so the copied content works anywhere.
 */
function makeImagesAbsolute(md: string): string {
  // Markdown images: ![alt](/images/...) or ![alt](./images/...)
  let result = md.replace(
    /!\[([^\]]*)\]\((\/?images\/[^)]+)\)/g,
    (_match, alt, src) => {
      const absolute = src.startsWith('/') ? `${BASE_URL}${src}` : `${BASE_URL}/${src}`;
      return `![${alt}](${absolute})`;
    },
  );

  // Also handle HTML <img> tags with relative src
  result = result.replace(
    /(<img\s[^>]*src=["'])(\/?images\/[^"']+)(["'])/g,
    (_match, before, src, after) => {
      const absolute = src.startsWith('/') ? `${BASE_URL}${src}` : `${BASE_URL}/${src}`;
      return `${before}${absolute}${after}`;
    },
  );

  return result;
}

export function CopyMarkdownButton({ rawContent, title, slug, image }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Build a clean markdown document
    const parts: string[] = [];

    // Title
    parts.push(`# ${title}\n`);

    // Hero image
    if (image) {
      const absoluteImage = image.startsWith('/')
        ? `${BASE_URL}${image}`
        : image;
      parts.push(`![${title}](${absoluteImage})\n`);
    }

    // Body with absolute image URLs
    parts.push(makeImagesAbsolute(rawContent));

    // Attribution footer
    parts.push(`\n---\n*Originally published on [${BASE_URL}/blog/${slug}](${BASE_URL}/blog/${slug})*\n`);

    const markdown = parts.join('\n');

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      trackEvent('copy_markdown', 'Engagement', `/blog/${slug}`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="nb-btn inline-flex items-center gap-2 text-xs"
      style={
        copied
          ? { backgroundColor: 'var(--nb-badge-bg)', color: 'var(--nb-badge-text)' }
          : { backgroundColor: 'var(--nb-card-5)', color: '#1C1C1A' }
      }
      onMouseEnter={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nb-card-4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--nb-card-5)';
        }
      }}
      aria-label="Copy post as Markdown"
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h6M9 13h6M9 9h2" />
        </svg>
      )}
      {copied ? 'Copied!' : 'Copy Markdown'}
    </button>
  );
}
