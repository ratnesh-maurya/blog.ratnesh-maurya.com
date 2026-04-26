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

export function NewsTracker({ slug, title, tags, date }: NewsTrackerProps) {
  useEffect(() => {
    if (!isProduction || typeof window === 'undefined') return;

    trackNewsView(slug, title);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'news_post_view',
      news_slug: slug,
      news_title: title,
      news_tags: tags.join(','),
      news_date: date,
      content_type: 'news',
    });
  }, [slug, title, tags, date]);

  return null;
}
