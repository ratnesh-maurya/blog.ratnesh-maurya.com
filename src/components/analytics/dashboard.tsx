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

const STORAGE_KEY = 'analytics-section-order-v2';

// 'search-console' section exists but is off by default — add it to a group below
// if the GSC service account ever gets configured.
type Group = { id: string; label: string; question: string; blurb: string; sections: string[] };

/** Sections are grouped by the question they answer. Readers can still drag to reorder inside a group. */
const GROUPS: Group[] = [
  {
    id: 'overview',
    label: 'Overview',
    question: 'How is the site doing?',
    blurb: 'Totals, what is popular right now, and today so far.',
    sections: ['overall', 'trending', 'today'],
  },
  {
    id: 'visitors',
    label: 'Visitors',
    question: 'Who is visiting, and from where?',
    blurb: 'Where readers come from, their devices and countries. The last three are advanced.',
    sections: ['audience', 'funnel', 'sankey', 'utm'],
  },
  {
    id: 'reading',
    label: 'Reading',
    question: 'What are people reading?',
    blurb: 'Views per post, how well posts are read, and how old content ages.',
    sections: ['content-overview', 'post-views', 'read-quality', 'lifecycle'],
  },
  {
    id: 'speed',
    label: 'Site speed',
    question: 'Is the site fast for readers?',
    blurb: 'Real loading and responsiveness measured in readers\' browsers.',
    sections: ['web-vitals'],
  },
];

/** Advanced sections start closed and don't load their data until opened. */
const COLLAPSED_BY_DEFAULT = new Set(['funnel', 'sankey', 'utm', 'lifecycle', 'web-vitals']);

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

type Order = Record<string, string[]>;

function defaultOrder(): Order {
  return Object.fromEntries(GROUPS.map((g) => [g.id, [...g.sections]]));
}

/** Merge a stored order with the current groups so new/removed sections never break the layout. */
function loadOrder(): Order {
  const base = defaultOrder();
  if (typeof window === 'undefined') return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    for (const g of GROUPS) {
      const stored = Array.isArray(parsed?.[g.id]) ? (parsed[g.id] as unknown[]) : [];
      const valid = g.sections.filter((id) => stored.includes(id)).sort((a, b) => stored.indexOf(a) - stored.indexOf(b));
      base[g.id] = [...valid, ...g.sections.filter((id) => !valid.includes(id))];
    }
    return base;
  } catch {
    return base;
  }
}

function saveOrder(order: Order) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // ignore
  }
}

/** Plain-language titles: say what the section shows, not how it is computed. */
const SECTION_TITLES: Record<string, string> = {
  overall: 'Site totals',
  trending: 'What is popular',
  today: 'Today',
  audience: 'Where readers come from',
  funnel: 'One day, step by step',
  sankey: 'Source to content map',
  'content-overview': 'Content library',
  'post-views': 'Views over time',
  'read-quality': 'Do people finish reading?',
  lifecycle: 'How posts age',
  'search-console': 'Google Search',
  'web-vitals': 'Page speed',
  utm: 'Campaign links',
};

const SECTION_SUBTITLES: Record<string, string> = {
  overall: 'All-time views, upvotes and reports.',
  trending: 'Posts gaining or losing readers compared with the period before.',
  today: 'Views, upvotes and where today\'s visits started.',
  audience: 'Which channels, sites, devices and countries send readers.',
  funnel: 'Pick a day: total views, then by content type, campaign, and landing page.',
  sankey: 'Ribbon width is the number of visits from a source to a type of content.',
  'content-overview': 'How much content there is and how much each type gets read.',
  'post-views': 'Pick a date range to see views per day and the top posts.',
  'read-quality': 'The share of readers who reach the middle and the end of each post.',
  lifecycle: 'Views against post age: which posts stay useful and which fade.',
  'search-console': 'Searches that show your site on Google, with clicks and position.',
  'web-vitals': 'How fast pages load and respond for real readers (75th percentile).',
  utm: 'Visits that arrived through links you tagged for a campaign.',
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

function renderSection(id: string, selectedType: 'all' | StatType) {
  switch (id) {
    case 'overall':
      return <OverallSection selectedType={selectedType} />;
    case 'today':
      return <TodaySection selectedType={selectedType} />;
    case 'content-overview':
      return <ContentOverviewSection selectedType={selectedType} />;
    case 'post-views':
      return <PostViewsRangeSection selectedType={selectedType} />;
    case 'funnel':
      return <TrafficFunnelSection />;
    case 'sankey':
      return <SankeySection />;
    case 'utm':
      return <UtmRangeSection selectedType={selectedType} />;
    case 'trending':
      return <TrendingSection selectedType={selectedType} />;
    case 'audience':
      return <AudienceSection />;
    case 'read-quality':
      return <ReadQualitySection selectedType={selectedType} />;
    case 'lifecycle':
      return <LifecycleSection />;
    case 'search-console':
      return <SearchConsoleSection />;
    case 'web-vitals':
      return <WebVitalsSection />;
    default:
      return null;
  }
}

const GLOSSARY: Array<[string, string]> = [
  ['View', 'One page load by a real reader. Bots and the site owner are not counted.'],
  ['Upvote', 'A reader pressing the thumbs-up button on a page.'],
  ['Visit / session', 'One reader arriving on the site. Several page views in a row count as one visit.'],
  ['Direct', 'The reader typed the address, used a bookmark, or came from an app that hides where they came from.'],
  ['Referral', 'Arrived by clicking a link on another website.'],
  ['Organic search', 'Arrived from a search engine such as Google.'],
  ['Campaign link (UTM)', 'A link with ?utm_source=… added so we know exactly which post or campaign sent the reader.'],
  ['Landing page', 'The first page a reader saw when their visit started.'],
  ['Read quality', 'How far readers scroll: the share who reach the middle and the end of a post.'],
  ['Page speed (LCP, CLS, INP)', 'LCP: how fast the main content appears. CLS: how much the layout jumps. INP: how quickly the page reacts to a tap. Shown at the 75th percentile, so 3 in 4 readers have it at least this good.'],
];

export function AnalyticsDashboard() {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [selectedType, setSelectedType] = useState<'all' | StatType>('all');
  const [activeGroup, setActiveGroup] = useState<string>(GROUPS[0].id);

  useEffect(() => {
    setOrder(loadOrder());
  }, []);

  // Highlight the group currently on screen in the jump bar.
  useEffect(() => {
    const els = GROUPS.map((g) => document.getElementById(`group-${g.id}`)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveGroup(visible.target.id.replace('group-', ''));
      },
      { rootMargin: '-25% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleDragEnd = useCallback((groupId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const ids = prev[groupId] ?? [];
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = { ...prev, [groupId]: arrayMove(ids, oldIndex, newIndex) };
      saveOrder(next);
      return next;
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="space-y-6">
      {/* Plain-English summary first: the answer, before any chart */}
      <TopInsightsStrip selectedType={selectedType} />

      {/* Sticky jump bar + content filter */}
      <div
        className="sticky top-16 z-30 -mx-1 px-1 py-2 rounded-2xl"
        style={{
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow-sm)',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        }}
      >
        <nav aria-label="Jump to a part of this page" className="flex gap-1.5 overflow-x-auto px-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GROUPS.map((g) => {
            const on = activeGroup === g.id;
            return (
              <a
                key={g.id}
                href={`#group-${g.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`group-${g.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveGroup(g.id);
                }}
                aria-current={on ? 'true' : undefined}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-200"
                style={on ? { backgroundColor: 'var(--pill)', color: 'var(--on-pill)' } : { backgroundColor: 'var(--surface-tint)', color: 'var(--text-secondary)' }}
              >
                {g.label}
              </a>
            );
          })}
        </nav>
        <div className="flex flex-nowrap items-center gap-2 px-3 pt-1.5 text-xs overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold shrink-0">Show:</span>
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedType(f.id)}
              aria-pressed={selectedType === f.id}
              className="shrink-0 px-2.5 py-1 rounded-full font-semibold transition-colors duration-200"
              style={selectedType === f.id ? { backgroundColor: 'var(--surface-tint-strong)', color: 'var(--text-primary)', border: '1px solid var(--surface-tint-border)' } : { color: 'var(--text-secondary)', border: '1px solid transparent' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <LiveTicker />

      {GROUPS.map((g) => (
        <section key={g.id} id={`group-${g.id}`} aria-labelledby={`group-title-${g.id}`} className="scroll-mt-40 space-y-3">
          <header className="px-1">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-500)' }}>{g.label}</p>
            <h2 id={`group-title-${g.id}`} className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{g.question}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{g.blurb}</p>
          </header>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(g.id, e)}>
            <SortableContext items={order[g.id] ?? g.sections} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {(order[g.id] ?? g.sections).map((id) => (
                  <SortableSection
                    key={id}
                    id={id}
                    title={SECTION_TITLES[id] ?? id}
                    subtitle={SECTION_SUBTITLES[id] ?? ''}
                    defaultOpen={!COLLAPSED_BY_DEFAULT.has(id)}
                  >
                    {renderSection(id, selectedType)}
                  </SortableSection>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      ))}

      <details className="nb-card rounded-2xl group/glossary" style={{ backgroundColor: 'var(--glass-bg)' }}>
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-5 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          <span>What do these terms mean?</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-open/glossary:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <dl className="px-5 pb-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {GLOSSARY.map(([term, meaning]) => (
            <div key={term}>
              <dt className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{term}</dt>
              <dd className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>{meaning}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
