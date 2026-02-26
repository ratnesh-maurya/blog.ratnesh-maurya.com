'use client';

import { useAccentColor } from '@/components/AccentColorProvider';
import { useEffect, useRef, useState } from 'react';

export function ColorAccentPicker() {
  const { accentId, setAccentId, palettes } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200"
        style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-muted)';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent-500)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
        }}
        aria-label="Change accent color"
        title="Accent color"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 p-3 rounded-xl border shadow-lg z-50"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', minWidth: '180px' }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            Accent color
          </p>
          <div className="grid grid-cols-3 gap-2">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => { setAccentId(palette.id); setIsOpen(false); }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: accentId === palette.id ? 'var(--accent-50)' : 'transparent',
                  outline: accentId === palette.id ? '2px solid var(--accent-500)' : 'none',
                  outlineOffset: '-1px',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 transition-transform"
                  style={{
                    backgroundColor: palette.swatch,
                    borderColor: accentId === palette.id ? '#fff' : 'transparent',
                    transform: accentId === palette.id ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {palette.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
