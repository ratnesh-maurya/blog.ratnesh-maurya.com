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
    <div className={`md:hidden fixed top-16 left-0 right-0 z-40 overflow-y-auto transition-all duration-300 ${isOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="px-4 pt-2 pb-4 space-y-1 border-t shadow-lg" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        {mainLinks.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
            style={linkStyle(item.href)}
            onClick={() => { trackNavigation(item.href, 'mobile-menu'); onClose(); }}
          >
            {item.label}
          </Link>
        ))}

        <div className="pt-2 pb-1 px-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Explore
          </span>
        </div>

        {exploreLinks.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
            style={linkStyle(item.href)}
            onClick={() => { trackNavigation(item.href, 'mobile-menu'); onClose(); }}
          >
            {item.label}
          </Link>
        ))}

        <div className="pt-2">
          <button
            onClick={() => { onSearchOpen(); onClose(); }}
            className="w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
