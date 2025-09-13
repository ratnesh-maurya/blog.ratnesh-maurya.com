'use client';

import { useEffect, useState } from "react";


interface ClientNavigationProps {
  onSearchOpen: () => void;
}

export function ClientNavigation({ onSearchOpen }: ClientNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onSearchOpen}
        className="hidden md:flex items-center px-3 py-1.5 text-sm border rounded-md transition-colors"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-muted)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--primary-300)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search...
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>⌘K</span>
      </button>
    </div>
  );
}
