'use client';

import { trackEvent } from '@/lib/analytics';
import { useState } from 'react';

interface CheatsheetCodeBlockProps {
  code: string;
  title: string;
}

export function CheatsheetCodeBlock({ code, title }: CheatsheetCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      trackEvent('code_copy', 'Engagement', `cheatsheet: ${title}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="relative group">
      <pre
        className="rounded-xl p-5 text-sm leading-relaxed overflow-x-auto"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono, monospace)',
        }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md border opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: copied ? 'var(--accent-500)' : 'var(--text-muted)',
        }}
        aria-label="Copy code"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
