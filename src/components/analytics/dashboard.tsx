'use client';

import { SortableSection } from '@/components/analytics/sortable-section';
import { TopInsightsStrip } from '@/components/analytics/top-insights-strip';
import type { StatType } from '@/lib/supabase/stats';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'analytics-section-order';
// 'search-console' section exists but is off by default — add it back here
// if the GSC service account ever gets configured.
const DEFAULT_ORDER: string[] = [
  'overall', 'trending', 'today', 'audience', 'funnel', 'sankey',
  'content-overview', 'post-views', 'read-quality', 'lifecycle',
  'web-vitals', 'utm',
];

function SectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="nb-card-sm p-5 animate-pulse h-24"
          style={{ backgroundColor: 'var(--glass-bg-subtle)' }}
        />
      ))}
    </div>
  );
}

const OverallSection = dynamic(() => import('@/components/analytics/overall-section').then((m) => m.OverallSection), {
  ssr: false,
  loading: () => <SectionSkeleton rows={1} />,
});

const TodaySection = dynamic(() => import('@/components/analytics/today-section').then((m) => m.TodaySection), {
  ssr: false,
  loading: () => <SectionSkeleton rows={1} />,
});

const ContentOverviewSection = dynamic(
  () => import('@/components/analytics/content-overview-section').then((m) => m.ContentOverviewSection),
  { ssr: false, loading: () => <SectionSkeleton rows={2} /> }
);

const PostViewsRangeSection = dynamic(
  () => import('@/components/analytics/post-views-range-section').then((m) => m.PostViewsRangeSection),
  { ssr: false, loading: () => <SectionSkeleton rows={3} /> }
);

const UtmRangeSection = dynamic(() => import('@/components/analytics/utm-range-section').then((m) => m.UtmRangeSection), {
  ssr: false,
  loading: () => <SectionSkeleton rows={2} />,
});

const TrafficFunnelSection = dynamic(
  () => import('@/components/analytics/traffic-funnel-section').then((m) => m.TrafficFunnelSection),
  { ssr: false, loading: () => <SectionSkeleton rows={4} /> }
);

const SankeySection = dynamic(
  () => import('@/components/analytics/sankey-section').then((m) => m.SankeySection),
  { ssr: false, loading: () => <SectionSkeleton rows={3} /> }
);

const TrendingSection = dynamic(
  () => import('@/components/analytics/trending-section').then((m) => m.TrendingSection),
  { ssr: false, loading: () => <SectionSkeleton rows={2} /> }
);

const AudienceSection = dynamic(
  () => import('@/components/analytics/audience-section').then((m) => m.AudienceSection),
  { ssr: false, loading: () => <SectionSkeleton rows={2} /> }
);

const ReadQualitySection = dynamic(
  () => import('@/components/analytics/read-quality-section').then((m) => m.ReadQualitySection),
  { ssr: false, loading: () => <SectionSkeleton rows={2} /> }
);

const LifecycleSection = dynamic(
  () => import('@/components/analytics/lifecycle-section').then((m) => m.LifecycleSection),
  { ssr: false, loading: () => <SectionSkeleton rows={2} /> }
);

const SearchConsoleSection = dynamic(
  () => import('@/components/analytics/search-console-section').then((m) => m.SearchConsoleSection),
  { ssr: false, loading: () => <SectionSkeleton rows={2} /> }
);

const WebVitalsSection = dynamic(
  () => import('@/components/analytics/web-vitals-section').then((m) => m.WebVitalsSection),
  { ssr: false, loading: () => <SectionSkeleton rows={1} /> }
);

const LiveTicker = dynamic(
  () => import('@/components/analytics/live-ticker').then((m) => m.LiveTicker),
  { ssr: false }
);

function loadOrder(): string[] {
  if (typeof window === 'undefined') return [...DEFAULT_ORDER];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_ORDER];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_ORDER];
    const valid = DEFAULT_ORDER.filter((id) => parsed.includes(id));
    const missing = DEFAULT_ORDER.filter((id) => !valid.includes(id));
    return [...valid, ...missing];
  } catch {
    return [...DEFAULT_ORDER];
  }
}

function saveOrder(order: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // ignore
  }
}

const SECTION_TITLES: Record<string, string> = {
  overall: 'Overall analytics',
  trending: 'Trending posts',
  today: "Today's analytics",
  audience: 'Audience & channels',
  funnel: 'Traffic funnel',
  sankey: 'Source → Content flow',
  'content-overview': 'Content overview',
  'post-views': 'Post views',
  'read-quality': 'Read quality',
  lifecycle: 'Content lifecycle',
  'search-console': 'Google Search',
  'web-vitals': 'Web vitals',
  utm: 'UTM traffic',
};

const SECTION_SUBTITLES: Record<string, string> = {
  overall: 'Big-picture totals for views, upvotes, and reports across the site.',
  trending: 'Momentum ranking — what is gaining or losing steam vs the previous window.',
  today: 'Single-day snapshot of views, upvotes, and UTM visits.',
  audience: 'Where readers come from: channels, referring sites, devices, and countries.',
  funnel: 'Pick a day and see traffic cascade: total → content type → UTM source → referral → top pages.',
  sankey: 'Alluvial ribbon flow — where tracked visitors came from and what they read.',
  'content-overview': 'Content inventory and engagement quality by type.',
  'post-views': 'Time-series views plus top content leaders for the selected range.',
  'read-quality': 'Completion rate per post — how many viewers actually read to the middle and end.',
  lifecycle: 'Views vs post age — spot evergreen compounding and content decay.',
  'search-console': 'Queries, impressions, CTR, and average position from Google Search Console.',
  'web-vitals': 'Real-user Core Web Vitals (p75) and the slowest pages by LCP.',
  utm: 'Traffic and performance grouped by UTM parameters.',
};

const TYPE_FILTERS: { id: 'all' | StatType; label: string }[] = [
  { id: 'all', label: 'All content' },
  { id: 'blog', label: 'Blog' },
  { id: 'news', label: 'News' },
  { id: 'technical-terms', label: 'Tech terms' },
  { id: 'silly-questions', label: 'Silly Q' },
  { id: 'cheatsheets', label: 'Cheatsheets' },
  { id: 'til', label: 'TIL' },
];

export function AnalyticsDashboard() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [selectedType, setSelectedType] = useState<'all' | StatType>('all');

  useEffect(() => {
    setOrder(loadOrder());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      saveOrder(next);
      return next;
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Filter by content type to narrow all sections at once.
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedType(f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-transform"
              style={
                selectedType === f.id
                  ? {
                    backgroundColor: 'var(--glass-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow-sm)',
                  }
                  : {
                    backgroundColor: 'var(--glass-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--glass-border)',
                  }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <LiveTicker />
      </div>

      <TopInsightsStrip selectedType={selectedType} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {order.map((id) => {
              const subtitle = SECTION_SUBTITLES[id] ?? '';
              switch (id) {
                case 'overall':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <OverallSection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'today':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <TodaySection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'content-overview':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <ContentOverviewSection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'post-views':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <PostViewsRangeSection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'funnel':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <TrafficFunnelSection />
                    </SortableSection>
                  );
                case 'sankey':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <SankeySection />
                    </SortableSection>
                  );
                case 'utm':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <UtmRangeSection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'trending':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <TrendingSection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'audience':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <AudienceSection />
                    </SortableSection>
                  );
                case 'read-quality':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <ReadQualitySection selectedType={selectedType} />
                    </SortableSection>
                  );
                case 'lifecycle':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <LifecycleSection />
                    </SortableSection>
                  );
                case 'search-console':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <SearchConsoleSection />
                    </SortableSection>
                  );
                case 'web-vitals':
                  return (
                    <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id} subtitle={subtitle}>
                      <WebVitalsSection />
                    </SortableSection>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
