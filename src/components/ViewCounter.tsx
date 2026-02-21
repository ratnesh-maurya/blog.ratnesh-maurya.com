'use client';

import { useEffect, useState, useRef } from 'react';
import { getStatsForSlug, incrementStat, type StatType } from '@/lib/supabase/stats';

interface ViewCounterProps {
  type: StatType;
  slug: string;
  className?: string;
  showLabel?: boolean;
  incrementOnView?: boolean;
  initialCount?: number;
}

export function ViewCounter({
  type,
  slug,
  className = '',
  showLabel = true,
  incrementOnView = false,
  initialCount,
}: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(initialCount ?? null);
  const [isLoading, setIsLoading] = useState(initialCount === undefined);
  const hasIncremented = useRef(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (initialCount !== undefined) {
      setViews(initialCount);
      setIsLoading(false);
      hasFetched.current = true;
    }
  }, [initialCount]);

  useEffect(() => {
    if (initialCount === undefined && !hasFetched.current && incrementOnView) {
      const run = async () => {
        try {
          const { views: v } = await getStatsForSlug(type, slug);
          setViews(v);
          hasFetched.current = true;
          setIsLoading(false);
          if (!hasIncremented.current) {
            await new Promise((r) => setTimeout(r, 500));
            const { views: v2 } = await incrementStat(type, slug, 'view');
            setViews(v2);
            hasIncremented.current = true;
          }
        } catch (e) {
          console.error('Error fetching/incrementing views:', e);
          setIsLoading(false);
        }
      };
      const t = setTimeout(run, 1500);
      return () => clearTimeout(t);
    }
    if (initialCount !== undefined) {
      setViews(initialCount);
      setIsLoading(false);
      hasFetched.current = true;
    } else {
      setViews(0);
      setIsLoading(false);
    }
  }, [type, slug, incrementOnView, initialCount]);

  if (isLoading) {
    return (
      <span className={className} style={{ color: 'var(--text-muted)' }}>
        {showLabel && '––– '}views
      </span>
    );
  }

  const formattedViews = views !== null ? views.toLocaleString() : '–––';
  return (
    <span className={className} style={{ color: 'var(--text-muted)' }}>
      {formattedViews} {showLabel && 'views'}
    </span>
  );
}
