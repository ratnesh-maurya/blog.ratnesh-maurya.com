'use client';

import { SITE_HOST } from '@/lib/site';
import Script from 'next/script';
import { useEffect, useId, useRef, useState } from 'react';

/**
 * Google "Preferred Sources" button.
 * Docs: https://developers.google.com/search/docs/appearance/preferred-sources
 *
 * Standard implementation: load publisher.js once, then any element carrying the
 * `google-add-preferred-source-btn` attribute is rendered as the button. `data-theme`
 * is the only attribute we set (documented values: light | dark). Language follows
 * the browser, which is the documented default.
 *
 * - The <Script> has a fixed `id`, so next/script loads publisher.js once no matter
 *   how many instances (footer, home, article) are on the page.
 * - publisher.js scans the DOM when it loads. An instance mounted later through a
 *   client-side navigation is not picked up, so if nothing was rendered shortly after
 *   the script is ready we show the documented deeplink instead.
 */

const PUBLISHER_JS = 'https://news.google.com/swg/js/v1/publisher.js';

/** Documented no-JavaScript deeplink: `?q=` is the site's domain. */
export const PREFERRED_SOURCE_URL = `https://www.google.com/preferences/source?q=${SITE_HOST}`;

const RENDER_CHECK_MS = 1500;

interface PreferredSourceButtonProps {
  /** `card` = boxed call-to-action with full copy; `footer` = compact, no box. */
  variant?: 'card' | 'footer';
  className?: string;
}

export function PreferredSourceButton({ variant = 'card', className = '' }: PreferredSourceButtonProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const helpId = useId();
  const [failed, setFailed] = useState(false);
  const checkTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // The site theme lives on <html data-theme>; Google's button takes the same two values.
  useEffect(() => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    slotRef.current?.setAttribute('data-theme', theme);
    return () => clearTimeout(checkTimer.current);
  }, []);

  const verifyRendered = () => {
    clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(() => {
      const slot = slotRef.current;
      if (slot && slot.childNodes.length === 0 && !slot.shadowRoot) setFailed(true);
    }, RENDER_CHECK_MS);
  };

  const isCard = variant === 'card';

  return (
    <div
      className={`${isCard ? 'rounded-2xl p-6 sm:p-8' : ''} ${className}`.trim()}
      style={
        isCard
          ? { background: 'var(--glass-bg)', border: '1px solid var(--line)', boxShadow: 'var(--glass-shadow-sm)' }
          : undefined
      }
    >
      {isCard ? (
        <>
          <p className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
            Enjoy reading RatnLabs?
          </p>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--body)' }}>
            Add us as a Preferred Source on Google to make our engineering articles easier to discover in your
            personalized AI search experience.
          </p>
        </>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Enjoy reading RatnLabs? Add us as a Preferred Source on Google.
        </p>
      )}

      <div
        className="mt-4 min-h-10"
        role="group"
        aria-label="Add RatnLabs as a Google Preferred Source"
        aria-describedby={helpId}
      >
        {failed ? (
          <a
            href={PREFERRED_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Add RatnLabs as a Preferred Source on Google ↗
          </a>
        ) : (
          <div ref={slotRef} google-add-preferred-source-btn="" data-theme="dark" />
        )}
        <noscript>
          <a href={PREFERRED_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Add RatnLabs as a Preferred Source on Google ↗
          </a>
        </noscript>
      </div>

      <p id={helpId} className={isCard ? 'mt-3 text-xs leading-relaxed' : 'sr-only'} style={{ color: 'var(--muted)' }}>
        Preferred Sources is a Google Search setting that lets you choose sites you want to see more often in Top
        Stories. It is optional and only changes your own results.
      </p>

      <Script
        id="google-preferred-source"
        src={PUBLISHER_JS}
        strategy="lazyOnload"
        onReady={verifyRendered}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
