'use client';

import { UtmAnalyticsCharts } from '@/components/UtmAnalyticsCharts';

interface UtmRangeSectionProps {
  selectedType: 'all' | import('@/lib/supabase/stats').StatType;
}

export function UtmRangeSection({ selectedType: _selectedType }: UtmRangeSectionProps) {
  // Currently UTMs are aggregated globally; the type filter is reserved for future per-type breakdowns.
  // For now we just render the charts and rely on date range controls inside them.
  void _selectedType;
  return <UtmAnalyticsCharts />;
}
