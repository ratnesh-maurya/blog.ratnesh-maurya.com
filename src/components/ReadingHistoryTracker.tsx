'use client';

import { isBotBrowser } from '@/lib/bot';
import { getEntry, recordReadingProgress } from '@/lib/reading-history';
import { isTrackingExcluded, logEngagement } from '@/lib/supabase/stats';
import { isProduction } from '@/lib/env';
import { useEffect } from 'react';

interface ReadingHistoryTrackerProps {
  type: string;
  slug: string;
  title: string;
  href: string;
}

/**
 * Invisible tracker: records this page into local reading history with
 * scroll progress, and restores the saved scroll position when the URL
 * has ?resume=1 (links from the "Continue reading" strip).
 */
export function ReadingHistoryTracker({ type, slug, title, href }: ReadingHistoryTrackerProps) {
  useEffect(() => {
    let maxProgress = 0;
    let maxScrollY = 0;
    let ticking = false;

    // Read-depth engagement: fire read_half / read_complete once per session
    const canLog = isProduction && !isTrackingExcluded() && !isBotBrowser();
    const engagementKey = (event: string) => `engagement_${event}_${type}_${slug}`;
    const maybeLogEngagement = (progress: number) => {
      if (!canLog) return;
      try {
        if (progress >= 50 && !sessionStorage.getItem(engagementKey('read_half'))) {
          sessionStorage.setItem(engagementKey('read_half'), '1');
          void logEngagement(type, slug, 'read_half');
        }
        if (progress >= 90 && !sessionStorage.getItem(engagementKey('read_complete'))) {
          sessionStorage.setItem(engagementKey('read_complete'), '1');
          void logEngagement(type, slug, 'read_complete');
        }
      } catch {
        // sessionStorage unavailable — skip rather than double-log
      }
    };

    const measure = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0
        ? Math.min(100, Math.round((window.scrollY / scrollable) * 100))
        : 100;
      if (progress > maxProgress) {
        maxProgress = progress;
        maxScrollY = window.scrollY;
        maybeLogEngagement(progress);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        measure();
        ticking = false;
      });
    };

    const save = () => {
      recordReadingProgress({ type, slug, title, href, progress: maxProgress, scrollY: maxScrollY });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') save();
    };

    // Record the visit immediately so it appears in "recently viewed"
    measure();
    save();

    // Resume scroll position when arriving from the continue-reading strip
    if (new URLSearchParams(window.location.search).has('resume')) {
      const saved = getEntry(type, slug);
      if (saved && saved.scrollY > 200) {
        window.scrollTo({ top: saved.scrollY, behavior: 'smooth' });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    const interval = window.setInterval(save, 15000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearInterval(interval);
      save();
    };
  }, [type, slug, title, href]);

  return null;
}
