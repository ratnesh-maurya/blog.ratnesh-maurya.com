'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode, useState } from 'react';

interface SortableSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  subtitle?: string;
  /** Advanced sections can start closed. Their content is not mounted (so it fetches nothing) until first opened. */
  defaultOpen?: boolean;
}

export function SortableSection({ id, title, children, rightSlot, subtitle, defaultOpen = true }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  const [open, setOpen] = useState(defaultOpen);
  // Mount lazily on first open, then keep mounted so reopening is instant and doesn't refetch.
  const [everOpened, setEverOpened] = useState(defaultOpen);
  const bodyId = `analytics-body-${id}`;

  const toggle = () => {
    setOpen((o) => !o);
    setEverOpened(true);
  };

  return (
    <div
      ref={setNodeRef}
      id={`analytics-${id}`}
      className="nb-card overflow-hidden scroll-mt-28"
      style={{
        transform: CSS.Transform.toString(transform),
        backgroundColor: 'var(--glass-bg)',
        borderColor: isDragging ? 'var(--accent)' : 'var(--line)',
        opacity: isDragging ? 0.95 : 1,
        boxShadow: isDragging ? 'var(--glass-shadow-lg)' : 'var(--glass-shadow-sm)',
        backdropFilter: 'blur(10px) saturate(160%)',
        WebkitBackdropFilter: 'blur(10px) saturate(160%)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap"
        style={{ backgroundColor: 'var(--glass-bg-subtle)', borderBottom: open ? '1px solid var(--line)' : '1px solid transparent' }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            className="touch-none cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-colors hover:bg-[var(--surface-tint)] shrink-0"
            style={{ border: '1px solid var(--line)', backgroundColor: 'transparent' }}
            aria-label={`Drag to reorder: ${title}`}
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)' }}>
              <circle cx="9" cy="5" r="1.5" />
              <circle cx="15" cy="5" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="19" r="1.5" />
              <circle cx="15" cy="19" r="1.5" />
            </svg>
          </button>

          {/* The whole title area toggles the section: a big, obvious target */}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={bodyId}
            className="flex flex-1 min-w-0 items-center justify-between gap-3 text-left rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: 'var(--accent)' }}
          >
            <span className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-bold" style={{ color: 'var(--text)' }}>
                {title}
              </span>
              {subtitle && (
                <span className="text-xs mt-0.5 max-w-xl" style={{ color: 'var(--muted)' }}>
                  {subtitle}
                </span>
              )}
            </span>
            <svg
              className={`w-5 h-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--muted)' }}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {rightSlot && <div className="flex items-center">{rightSlot}</div>}
      </div>

      {/* grid-rows 0fr → 1fr animates height without measuring it */}
      <div
        id={bodyId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden min-h-0">
          <div className="p-4 md:p-6">{everOpened ? children : null}</div>
        </div>
      </div>
    </div>
  );
}
