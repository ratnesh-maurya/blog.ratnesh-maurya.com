'use client';

import { trackNewsView } from '@/lib/analytics';
import { isProduction } from '@/lib/env';
import { useEffect } from 'react';

interface NewsTrackerProps {
  slug: string;
  title: string;
  tags: string[];
  date: string;
}

/**
 * Fires news-specific analytics on mount:
 * - GA4 custom event `view_news_post`
 * - GTM dataLayer push with post metadata
 * - Microsoft Clarity custom tags
 */
export function NewsTracker({ slug, title, tags, date }: NewsTrackerProps) {
  useEffect(() => {
    if (!isProduction || typeof window === 'undefined') return;

    // GA4 custom event via trackNewsView (reading progress included)
    trackNewsView(slug, title);

    // GTM dataLayer — push structured news post metadata
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'news_post_view',
      news_slug: slug,
      news_title: title,
      news_tags: tags.join(','),
      news_date: date,
      content_type: 'news',
    });

    // Microsoft Clarity custom tags
    if (window.clarity) {
      window.clarity('set', 'content_type', 'news');
      window.clarity('set', 'news_slug', slug);
      window.clarity('set', 'news_title', title);
      window.clarity('set', 'news_tags', tags.join(','));
    }
  }, [slug, title, tags, date]);

  return null;
}
