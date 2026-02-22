'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const UTM_SENT_KEY = 'utm_hit_sent';

/**
 * Records a UTM hit once per session when the user lands with UTM params.
 * Sends to /api/utm so you can track source/medium/campaign in your DB.
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

    if (!utmSource && !utmMedium && !utmCampaign) return;

    try {
      const key = `${UTM_SENT_KEY}_${pathname}`;
      if (sessionStorage.getItem(key) === '1') return;

      fetch('/api/utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
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
