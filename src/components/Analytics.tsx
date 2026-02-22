'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import {
  GA_MEASUREMENT_ID,
  CLARITY_PROJECT_ID,
  initGA,
  initClarity,
  trackPageView,
  trackPerformance,
  trackEngagement
} from '@/lib/analytics';
import { isProduction } from '@/lib/env';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isProduction) return;
    // Track page views on route changes
    if (GA_MEASUREMENT_ID) {
      trackPageView(pathname);
    }

    // Track in Clarity
    if (CLARITY_PROJECT_ID && typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', 'page_path', pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isProduction) return;
    // Initialize analytics on mount
    if (GA_MEASUREMENT_ID) {
      initGA();
      trackPerformance();
      trackEngagement();
    }

    // Initialize Clarity
    if (CLARITY_PROJECT_ID) {
      initClarity();
    }
  }, []);

  // Don't render scripts or run tracking in development
  if (!isProduction || (!GA_MEASUREMENT_ID && !CLARITY_PROJECT_ID)) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
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
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity */}
      {CLARITY_PROJECT_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}
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
