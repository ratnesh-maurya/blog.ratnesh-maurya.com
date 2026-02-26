'use client';

import { ContentOverviewSection } from '@/components/analytics/content-overview-section';
import { OverallSection } from '@/components/analytics/overall-section';
import { PostViewsRangeSection } from '@/components/analytics/post-views-range-section';
import { SortableSection } from '@/components/analytics/sortable-section';
import { TodaySection } from '@/components/analytics/today-section';
import { UtmRangeSection } from '@/components/analytics/utm-range-section';
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
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'analytics-section-order';
const DEFAULT_ORDER: string[] = ['overall', 'today', 'content-overview', 'post-views', 'utm'];

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
  today: "Today's analytics",
  'content-overview': 'Content overview',
  'post-views': 'Post views',
  utm: 'UTM traffic',
};

export function AnalyticsDashboard() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);

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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {order.map((id) => {
            switch (id) {
              case 'overall':
                return (
                  <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id}>
                    <OverallSection />
                  </SortableSection>
                );
              case 'today':
                return (
                  <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id}>
                    <TodaySection />
                  </SortableSection>
                );
              case 'content-overview':
                return (
                  <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id}>
                    <ContentOverviewSection />
                  </SortableSection>
                );
              case 'post-views':
                return (
                  <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id}>
                    <PostViewsRangeSection />
                  </SortableSection>
                );
              case 'utm':
                return (
                  <SortableSection key={id} id={id} title={SECTION_TITLES[id] ?? id}>
                    <UtmRangeSection />
                  </SortableSection>
                );
              default:
                return null;
            }
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
