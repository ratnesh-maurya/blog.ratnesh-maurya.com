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
      <div className="flex items-center space-x-2">
        <div className="w-32 h-8 rounded-md animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
        <div className="w-8 h-8 rounded-md animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Search button */}
      <button
        onClick={onSearchOpen}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md transition-all duration-200"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface-elevated)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-400)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        }}
        aria-label="Open search"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
        <span className="ml-1 text-xs opacity-60">⌘K</span>
      </button>

      {/* Accent color picker */}
      <ColorAccentPicker />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200"
        style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-muted)';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent-500)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
        }}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        {isDark ? (
          /* Sun icon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          /* Moon icon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
