'use client';

import { trackNavigation } from '@/lib/analytics';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

const mainLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'News', href: '/news' },
  { label: 'Questions', href: '/silly-questions' },
  { label: 'Technical Terms', href: '/technical-terms' },
  { label: 'About', href: '/about' },
];

const exploreLinks = [
  { label: 'TIL', href: '/til' },
  { label: 'Topics', href: '/topics' },
  { label: 'Series', href: '/series' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Resources', href: '/resources' },
  { label: 'Newsletter', href: '/newsletter' },
];

export function MobileMenu({ isOpen, onClose, onSearchOpen }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div
      className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close menu"
        style={{ backgroundColor: 'var(--overlay-backdrop)' }}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-16 left-0 right-0 overflow-y-auto transition-transform duration-200 ${
          isOpen ? 'translate-y-0' : '-translate-y-2 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto px-3">
          <div
            className="rounded-2xl px-3 pt-3 pb-5 space-y-1"
            style={{
              backgroundColor: 'transparent',
              border: '2px solid var(--nb-border)',
              boxShadow: 'var(--nb-shadow)',
            }}
          >
            {/* Main links */}
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
                style={
                  isActive(item.href)
                    ? {
                        backgroundColor: 'var(--text-primary)',
                        color: 'var(--background)',
                      }
                    : { color: 'var(--text-primary)' }
                }
                onMouseEnter={e => {
                  if (!isActive(item.href)) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--background)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(item.href)) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onClick={() => {
                  trackNavigation(item.href, 'mobile-menu');
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Divider + Explore label */}
            <div
              className="mx-3 pt-3 pb-2"
              style={{ borderTop: '2px solid var(--nb-border)', marginTop: '0.5rem' }}
            >
              <span className="nb-section-label" style={{ color: 'var(--text-muted)' }}>
                Explore
              </span>
            </div>

            {/* Explore links */}
            {exploreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                style={
                  isActive(item.href)
                    ? {
                        backgroundColor: 'var(--text-primary)',
                        color: 'var(--background)',
                      }
                    : { color: 'var(--text-secondary)' }
                }
                onMouseEnter={e => {
                  if (!isActive(item.href)) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--background)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(item.href)) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
                onClick={() => {
                  trackNavigation(item.href, 'mobile-menu');
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Search */}
            <div style={{ borderTop: '2px solid var(--nb-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => { onSearchOpen(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--background)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
                <span className="ml-auto text-xs opacity-50">⌘K</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
