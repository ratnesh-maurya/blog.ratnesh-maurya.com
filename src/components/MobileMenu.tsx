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
  { label: 'Technical Terms', href: '/technical-terms' },
  { label: 'Questions', href: '/silly-questions' },
  { label: 'About', href: '/about' },
];

const exploreLinks = [
  { label: 'Daily News', href: '/news' },
  { label: 'TIL', href: '/til' },
  { label: 'Topics', href: '/topics' },
  { label: 'Series', href: '/series' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'Resources', href: '/resources' },
  { label: 'Newsletter', href: '/newsletter' },
];

export function MobileMenu({ isOpen, onClose, onSearchOpen }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div
      className={`md:hidden fixed inset-0 z-40 transition-opacity duration-150 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
      <div className="fixed top-16 left-0 right-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        <div className="wrap">
          <div className="glass lg-drawer">
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="lg-drawer-link"
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => {
                  trackNavigation(item.href, 'mobile-menu');
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ))}

            <div className="lg-drawer-head">
              <span className="eyebrow is-rose">Explore</span>
            </div>

            {exploreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="lg-drawer-link is-sub"
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => {
                  trackNavigation(item.href, 'mobile-menu');
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ))}

            <div className="lg-drawer-head">
              <button
                onClick={() => { onSearchOpen(); onClose(); }}
                className="lg-drawer-link is-sub lg-drawer-search"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
                <span className="kicker" style={{ marginLeft: 'auto' }}>⌘K</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
