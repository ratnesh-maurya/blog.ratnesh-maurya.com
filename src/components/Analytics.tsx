'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import {
  GA_MEASUREMENT_ID,
  trackPageView,
  trackPerformance,
  trackEngagement
} from '@/lib/analytics';
import { isProduction } from '@/lib/env';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isProduction) return;
    if (GA_MEASUREMENT_ID) trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!isProduction) return;
    if (GA_MEASUREMENT_ID) {
      trackPerformance();
      trackEngagement();
    }
  }, []);

  if (!isProduction || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}

// Hook for tracking events in components
export function useAnalytics() {
  return {
    trackEvent: (action: string, category: string, label?: string, value?: number) => {
      if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    },
    trackPageView: (url: string, title?: string) => {
      if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
        trackPageView(url, title);
      }
    },
  };
}
