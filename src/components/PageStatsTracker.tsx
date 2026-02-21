'use client';

import { ViewIncrementer } from '@/components/ViewIncrementer';
import { FloatingUpvoteButton } from '@/components/FloatingUpvoteButton';
import type { StatType } from '@/lib/supabase/stats';

interface PageStatsTrackerProps {
  type: StatType;
  slug: string;
}

export function PageStatsTracker({ type, slug }: PageStatsTrackerProps) {
  return (
    <>
      <ViewIncrementer type={type} slug={slug} />
      <FloatingUpvoteButton type={type} slug={slug} />
    </>
  );
}
