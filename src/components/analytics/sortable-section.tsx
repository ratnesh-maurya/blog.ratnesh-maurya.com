'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface SortableSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  subtitle?: string;
}

export function SortableSection({ id, title, children, rightSlot, subtitle }: SortableSectionProps) {
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
      className="nb-card overflow-hidden"
      style={{
        ...style,
        backgroundColor: 'var(--glass-bg)',
        borderColor: isDragging ? 'var(--accent-500)' : 'var(--glass-border)',
        opacity: isDragging ? 0.95 : 1,
        boxShadow: isDragging ? 'var(--glass-shadow-lg)' : 'var(--glass-shadow-sm)',
        backdropFilter: 'blur(10px) saturate(160%)',
        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
      }}
    >
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 border-b-2 flex-wrap"
        style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="touch-none cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-colors"
            style={{ border: '1px solid var(--glass-border)', backgroundColor: 'transparent' }}
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
          <div className="flex flex-col">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs mt-0.5 max-w-xl" style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightSlot && <div className="flex items-center">{rightSlot}</div>}
      </div>
      <div className="p-4 md:p-6" style={{ backgroundColor: 'transparent' }}>
        {children}
      </div>
    </div>
  );
}
