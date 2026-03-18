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
  { label: 'Silly Questions', href: '/silly-questions' },
  { label: 'About', href: '/about' },
];

const exploreLinks = [
  { label: 'TIL', href: '/til' },
  { label: 'Topics', href: '/topics' },
  { label: 'Series', href: '/series' },
  { label: 'Technical Terms', href: '/technical-terms' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Resources', href: '/resources' },
  { label: 'Newsletter', href: '/newsletter' },
];

export function MobileMenu({ isOpen, onClose, onSearchOpen }: MobileMenuProps) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linkStyle = (href: string) =>
    isActiveLink(href)
      ? { backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)' }
      : { color: 'var(--text-secondary)' };

  return (
    <div
      className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close menu backdrop"
        style={{ backgroundColor: 'var(--overlay-backdrop)', backdropFilter: 'blur(6px)' }}
      />

      <div
        className={`fixed top-16 left-0 right-0 overflow-y-auto transition-transform duration-200 ${
          isOpen ? 'translate-y-0' : '-translate-y-2 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto px-3">
          <div
            className="rounded-2xl border shadow-xl px-4 pt-3 pb-5 space-y-1"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={linkStyle(item.href)}
                onClick={() => {
                  trackNavigation(item.href, 'mobile-menu');
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 pb-1 px-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Explore
              </span>
            </div>

            {exploreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={linkStyle(item.href)}
                onClick={() => {
                  trackNavigation(item.href, 'mobile-menu');
                  onClose();
                }}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3">
              <button
                onClick={() => {
                  onSearchOpen();
                  onClose();
                }}
                className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
