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
        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
        style={{
          color: 'var(--accent-500)',
          backgroundColor: 'transparent',
          border: '2px solid var(--accent-500)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-500)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-inverse)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent-500)';
        }}
        aria-label="Change accent color"
        title="Accent color"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-3a5 5 0 110-10 5 5 0 010 10zm0-3a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 p-4 rounded-xl border shadow-xl z-50 backdrop-blur-sm"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--surface) 90%, var(--accent-500) 10%)',
            borderColor: 'var(--accent-200)',
            minWidth: '220px',
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent-500)' }}>
            Accent color
          </p>
          <div className="grid grid-cols-4 gap-2">
            {palettes.map((palette) => {
              const isActive = accentId === palette.id;
              return (
                <button
                  key={palette.id}
                  onClick={() => { setAccentId(palette.id); setIsOpen(false); }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-50)' : 'transparent',
                    outline: isActive ? '2px solid var(--accent-500)' : 'none',
                    outlineOffset: '-1px',
                  }}
                  title={palette.name}
                >
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 transition-all duration-200"
                    style={{
                      backgroundColor: palette.swatch,
                      boxShadow: isActive ? `0 0 0 2px var(--surface), 0 0 0 3px ${palette.swatch}, 0 0 10px ${palette.swatch}40` : 'none',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                  <span className="text-[9px] font-medium leading-none" style={{ color: isActive ? 'var(--accent-500)' : 'var(--text-muted)' }}>
                    {palette.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
