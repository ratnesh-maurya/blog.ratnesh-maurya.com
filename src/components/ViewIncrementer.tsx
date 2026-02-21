'use client';

import { useEffect, useRef } from 'react';
import { incrementStat, type StatType } from '@/lib/supabase/stats';

interface ViewIncrementerProps {
  type: StatType;
  slug: string;
}

/**
 * Silent component that increments view count in the background
 * without displaying anything. Used on individual post pages.
 * Each page load counts as one view. Ref guards against double-increment in React Strict Mode.
 */
export function ViewIncrementer({ type, slug }: ViewIncrementerProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;

    const timeoutId = setTimeout(() => {
      const run = async () => {
        try {
          await incrementStat(type, slug, 'view');
          hasIncremented.current = true;
        } catch (e) {
          console.error('Error incrementing views:', e);
        }
      };
      run();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [type, slug]);

  return null;
}
