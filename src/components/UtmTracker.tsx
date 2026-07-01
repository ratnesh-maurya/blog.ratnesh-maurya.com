'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const UTM_SENT_KEY = 'utm_hit_sent';
const VISIT_SENT_KEY = 'visit_sent';

/**
 * Traffic-source tracking, sent to /api/utm:
 * - UTM/?ref= landings: recorded once per pathname per session (campaign attribution)
 * - All other sessions: recorded once per session with the document referrer,
 *   so organic / direct / backlink traffic shows up in analytics too.
 */
export function UtmTracker() {
  const pathname = usePathname();
  const sent = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || sent.current) return;

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source')?.trim() || null;
    const utmMedium = params.get('utm_medium')?.trim() || null;
    const utmCampaign = params.get('utm_campaign')?.trim() || null;
    const utmContent = params.get('utm_content')?.trim() || null;
    const utmTerm = params.get('utm_term')?.trim() || null;

    // ?ref=peerlist, ?ref=hackernews, etc.
    const ref = params.get('ref')?.trim() || null;

    // Treat ?ref=X as utm_source when no utm_source is present
    const resolvedSource = utmSource || ref || null;
    const hasCampaign = Boolean(resolvedSource || utmMedium || utmCampaign);

    // External referrer (ignore internal navigation)
    let referrer: string | null = null;
    try {
      if (document.referrer) {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin !== window.location.origin) referrer = document.referrer.slice(0, 500);
      }
    } catch {
      // malformed referrer — skip
    }

    try {
      // Campaign hits: once per pathname. Plain visits: once per session.
      const key = hasCampaign ? `${UTM_SENT_KEY}_${pathname}` : VISIT_SENT_KEY;
      if (sessionStorage.getItem(key) === '1') return;

      fetch('/api/utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utm_source: resolvedSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          ref: ref,
          referrer,
          path: pathname || undefined,
        }),
      }).then((res) => {
        if (res.ok) sessionStorage.setItem(key, '1');
      });
      sent.current = true;
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
