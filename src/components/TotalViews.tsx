'use client';

import { useEffect, useState } from 'react';
import { getTotalViewsForFooter } from '@/lib/supabase/stats';

export function TotalViews() {
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTotalViewsForFooter()
      .then(setTotalViews)
      .catch((e) => console.error('Error fetching total views:', e))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <span style={{ color: 'var(--text-secondary)' }}>–––</span>;
  }

  const formatted = totalViews !== null ? totalViews.toLocaleString() : '–––';
  return <span style={{ color: 'var(--text-secondary)' }}>{formatted}</span>;
}
