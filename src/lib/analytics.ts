// Google Analytics configuration and utilities

import { shouldTrack } from '@/lib/env';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track page views (only in production)
export const trackPageView = (url: string, title?: string) => {
  if (!shouldTrack() || typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Track custom events (only in production)
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!shouldTrack() || typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track blog post views
export const trackBlogView = (slug: string, title: string, category: string) => {
  trackEvent('view_blog_post', 'Blog', `${category}: ${title}`, 1);

  let readingProgress = 0;
  const trackProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const progress = Math.round((window.scrollY / scrollHeight) * 100);
    if (progress > readingProgress && progress % 25 === 0) {
      readingProgress = progress;
      trackEvent('reading_progress', 'Blog', `${slug}: ${progress}%`, progress);
      if (progress >= 100) window.removeEventListener('scroll', trackProgress);
    }
  };

  window.addEventListener('scroll', trackProgress, { passive: true });
  setTimeout(() => window.removeEventListener('scroll', trackProgress), 300000);
};

// Track news post views
export const trackNewsView = (slug: string, title: string) => {
  trackEvent('view_news_post', 'News', title, 1);

  let readingProgress = 0;
  const trackProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const progress = Math.round((window.scrollY / scrollHeight) * 100);
    if (progress > readingProgress && progress % 25 === 0) {
      readingProgress = progress;
      trackEvent('reading_progress', 'News', `${slug}: ${progress}%`, progress);
      if (progress >= 100) window.removeEventListener('scroll', trackProgress);
    }
  };

  window.addEventListener('scroll', trackProgress, { passive: true });
  setTimeout(() => window.removeEventListener('scroll', trackProgress), 300000);
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', 'Search', query, resultsCount);
};



// Track social shares (only in production)
export const trackSocialShare = (platform: string, url: string, title: string) => {
  if (!shouldTrack()) return;
  trackEvent('share', 'Social', `${platform}: ${title}`, 1);
};

// Track external link clicks (only in production)
export const trackExternalLink = (url: string, text: string) => {
  if (!shouldTrack()) return;
  trackEvent('click_external_link', 'Navigation', `${text}: ${url}`, 1);
};

// Track navigation clicks (only in production)
export const trackNavigation = (destination: string, source: string) => {
  if (!shouldTrack()) return;
  trackEvent('navigation', 'Navigation', `${source} -> ${destination}`, 1);
};

// Track blog card clicks (only in production)
export const trackBlogCardClick = (slug: string, title: string, source: string) => {
  if (!shouldTrack()) return;
  trackEvent('blog_card_click', 'Blog', `${source}: ${title}`, 1);
};

// Track silly question clicks (only in production)
export const trackSillyQuestionClick = (slug: string, title: string, source: string) => {
  if (!shouldTrack()) return;
  trackEvent('silly_question_click', 'Silly Questions', `${source}: ${title}`, 1);
};

// Track carousel interactions
export const trackCarouselInteraction = (action: 'next' | 'previous' | 'indicator', slideIndex: number) => {
  trackEvent('carousel_interaction', 'UI', action, slideIndex);
};

// Performance tracking (only in production)
export const trackPerformance = () => {
  if (!shouldTrack() || typeof window === 'undefined') return;

  // Each vital goes to GA4 (if configured) AND to /api/vitals → Supabase,
  // which powers the public analytics dashboard's Web Vitals section.
  const report = (name: 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB', metric: { value: number; rating?: string }) => {
    if (GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
    try {
      const payload = JSON.stringify({
        metric: name,
        value: metric.value,
        rating: metric.rating ?? null,
        path: window.location.pathname,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/vitals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
      }
    } catch {
      // reporting is best-effort
    }
  };

  try {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS((m) => report('CLS', m));
      onINP((m) => report('INP', m));
      onFCP((m) => report('FCP', m));
      onLCP((m) => report('LCP', m));
      onTTFB((m) => report('TTFB', m));
    }).catch(() => {
      // web-vitals not available, skip tracking
    });
  } catch {
    // web-vitals not available, skip tracking
  }
};

// Track user engagement (only in production)
export const trackEngagement = () => {
  if (!shouldTrack() || typeof window === 'undefined') return;

  let startTime = Date.now();
  let isActive = true;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
    } else {
      isActive = true;
      startTime = Date.now();
    }
  });

  const tick = (elapsed: number) => {
    if (elapsed > 600) return; // stop after 10 min
    if (isActive) trackEvent('time_on_page', 'Engagement', window.location.pathname, elapsed);
    setTimeout(() => tick(elapsed + 30), 30000);
  };
  setTimeout(() => tick(30), 30000);
};
