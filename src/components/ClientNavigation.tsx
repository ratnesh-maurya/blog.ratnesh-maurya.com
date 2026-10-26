'use client';

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
      <div className="lg-controls" aria-hidden="true">
        <span className="lg-search lg-skeleton" />
        <span className="lg-icon-btn lg-skeleton" />
      </div>
    );
  }

  return (
    <div className="lg-controls">

      {/* Search button, desktop only */}
      <button
        onClick={onSearchOpen}
        className="lg-search"
        aria-label="Open search (⌘K)"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
        <kbd>⌘K</kbd>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="lg-icon-btn"
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        {isDark ? (
          /* Sun */
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true">
            <circle cx="12" cy="12" r="5" strokeLinecap="round" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          /* Moon */
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
