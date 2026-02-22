// Google Analytics and Microsoft Clarity configuration and utilities

import { isProduction } from '@/lib/env';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    clarity?: (action: string, ...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '';

// Initialize Google Analytics (only in production)
export const initGA = () => {
  if (!isProduction || typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Create dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Configure GA
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
  });
};

// Initialize Microsoft Clarity (only in production)
export const initClarity = () => {
  if (!isProduction || typeof window === 'undefined' || !CLARITY_PROJECT_ID) return;

  // Clarity script is loaded via Script component in layout
  // This function can be used for custom Clarity events
  if (window.clarity) {
    window.clarity('set', 'page_title', document.title);
    window.clarity('set', 'page_path', window.location.pathname);
  }
};

// Track page views (only in production)
export const trackPageView = (url: string, title?: string) => {
  if (!isProduction || typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events (only in production)
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!isProduction || typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track blog post views
export const trackBlogView = (slug: string, title: string, category: string) => {
  trackEvent('view_blog_post', 'Blog', `${category}: ${title}`, 1);
  
  // Track reading progress
  let readingProgress = 0;
  const trackProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.round((scrollTop / scrollHeight) * 100);
    
    if (progress > readingProgress && progress % 25 === 0) {
      readingProgress = progress;
      trackEvent('reading_progress', 'Blog', `${slug}: ${progress}%`, progress);
    }
  };

  window.addEventListener('scroll', trackProgress);
  
  // Clean up listener after 5 minutes
  setTimeout(() => {
    window.removeEventListener('scroll', trackProgress);
  }, 300000);
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', 'Search', query, resultsCount);
};



// Track social shares (only in production)
export const trackSocialShare = (platform: string, url: string, title: string) => {
  if (!isProduction) return;
  trackEvent('share', 'Social', `${platform}: ${title}`, 1);

  // Track in Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', 'social_share', { platform, url, title });
  }
};

// Track external link clicks (only in production)
export const trackExternalLink = (url: string, text: string) => {
  if (!isProduction) return;
  trackEvent('click_external_link', 'Navigation', `${text}: ${url}`, 1);

  // Track in Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', 'external_link_click', { url, text });
  }
};

// Track navigation clicks (only in production)
export const trackNavigation = (destination: string, source: string) => {
  if (!isProduction) return;
  trackEvent('navigation', 'Navigation', `${source} -> ${destination}`, 1);

  // Track in Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', 'navigation_click', { destination, source });
  }
};

// Track blog card clicks (only in production)
export const trackBlogCardClick = (slug: string, title: string, source: string) => {
  if (!isProduction) return;
  trackEvent('blog_card_click', 'Blog', `${source}: ${title}`, 1);

  // Track in Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', 'blog_card_click', { slug, title, source });
  }
};

// Track silly question clicks (only in production)
export const trackSillyQuestionClick = (slug: string, title: string, source: string) => {
  if (!isProduction) return;
  trackEvent('silly_question_click', 'Silly Questions', `${source}: ${title}`, 1);

  // Track in Clarity
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', 'silly_question_click', { slug, title, source });
  }
};

// Track carousel interactions
export const trackCarouselInteraction = (action: 'next' | 'previous' | 'indicator', slideIndex: number) => {
  trackEvent('carousel_interaction', 'UI', action, slideIndex);
};

// Performance tracking (only in production)
export const trackPerformance = () => {
  if (!isProduction || typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Track Core Web Vitals
  try {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS((metric) => {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'CLS',
          value: Math.round(metric.value * 1000),
          non_interaction: true,
        });
      });

      onINP((metric) => {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'INP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      });

      onFCP((metric) => {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'FCP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      });

      onLCP((metric) => {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'LCP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      });

      onTTFB((metric) => {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'TTFB',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      });
    }).catch(() => {
      // web-vitals not available, skip tracking
    });
  } catch {
    // web-vitals not available, skip tracking
  }
};

// Track user engagement (only in production)
export const trackEngagement = () => {
  if (!isProduction || typeof window === 'undefined') return;

  let startTime = Date.now();
  let isActive = true;

  const trackTimeOnPage = () => {
    if (isActive) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0 && timeSpent % 30 === 0) { // Track every 30 seconds
        trackEvent('time_on_page', 'Engagement', window.location.pathname, timeSpent);
      }
    }
  };

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
    } else {
      isActive = true;
      startTime = Date.now(); // Reset timer when user returns
    }
  });

  // Track time on page
  const interval = setInterval(trackTimeOnPage, 1000);

  // Clean up after 10 minutes
  setTimeout(() => {
    clearInterval(interval);
  }, 600000);
};
