'use client';

import { ColorAccentPicker } from '@/components/ColorAccentPicker';
import { trackEvent } from '@/lib/analytics';
import { useEffect, useState } from "react";

interface ClientNavigationProps {
  onSearchOpen: () => void;
}

export function ClientNavigation({ onSearchOpen }: ClientNavigationProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
    setIsDark(!isDark);
    trackEvent('theme_toggle', 'UI', next);
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block w-24 h-8 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
        <div className="w-8 h-8 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">

      {/* Search button — desktop only */}
      <button
        onClick={onSearchOpen}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 border-2"
        style={{
          borderColor: 'var(--nb-border)',
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.color = 'var(--background)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }}
        aria-label="Open search (⌘K)"
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
        <kbd
          className="hidden sm:inline-flex items-center text-[10px] font-bold px-1 rounded"
          style={{
            backgroundColor: 'var(--surface-muted)',
            color: 'var(--text-muted)',
            border: '1px solid var(--nb-border)',
            opacity: 0.7,
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Accent color picker */}
      <ColorAccentPicker />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 border-2"
        style={{
          borderColor: 'var(--nb-border)',
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.color = 'var(--background)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        {isDark ? (
          /* Sun */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <circle cx="12" cy="12" r="5" strokeLinecap="round" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          /* Moon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
