'use client';

import { useAccentColor } from '@/components/AccentColorProvider';
import { useEffect, useRef, useState } from 'react';

export function ColorAccentPicker() {
  const { accentId, setAccentId, palettes } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeSwatch = palettes.find(p => p.id === accentId)?.swatch ?? '#EA580C';

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
      {/* Trigger: small button showing the current accent swatch */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 border-2"
        style={{ borderColor: 'var(--nb-border)', backgroundColor: 'transparent' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        aria-label="Change accent color"
        title="Accent color"
      >
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: activeSwatch, border: '1.5px solid var(--nb-border)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 p-3 rounded-xl z-50"
          style={{
            backgroundColor: 'var(--surface)',
            border: '2px solid var(--nb-border)',
            boxShadow: 'var(--nb-shadow)',
            minWidth: '200px',
          }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            Accent color
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {palettes.map((palette) => {
              const isActive = accentId === palette.id;
              return (
                <button
                  key={palette.id}
                  onClick={() => { setAccentId(palette.id); setIsOpen(false); }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? 'var(--surface-muted)' : 'transparent',
                    border: isActive ? '2px solid var(--nb-border)' : '2px solid transparent',
                  }}
                  title={palette.name}
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: palette.swatch,
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                  <span className="text-[9px] font-semibold leading-none" style={{ color: 'var(--text-muted)' }}>
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
