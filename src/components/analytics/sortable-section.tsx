'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface SortableSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}

export function SortableSection({ id, title, children, rightSlot }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl border overflow-hidden"
      style={{
        ...style,
        backgroundColor: 'var(--surface)',
        borderColor: isDragging ? 'var(--accent-500)' : 'var(--border)',
        opacity: isDragging ? 0.95 : 1,
        boxShadow: isDragging ? '0 10px 40px -10px rgba(0,0,0,0.2)' : undefined,
      }}
    >
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 border-b flex-wrap"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-muted)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Drag to reorder section"
            {...attributes}
            {...listeners}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <circle cx="9" cy="5" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="9" cy="19" r="1.5" />
              <circle cx="15" cy="5" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="15" cy="19" r="1.5" />
            </svg>
          </button>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        </div>
        {rightSlot && <div className="flex items-center">{rightSlot}</div>}
      </div>
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
