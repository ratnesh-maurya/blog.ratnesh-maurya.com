'use client';

import { ClientNavigation } from '@/components/ClientNavigation';
import { trackNavigation } from '@/lib/analytics';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HeaderProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onSearchOpen: () => void;
}

const primaryNav = [
  { label: 'Blog', href: '/blog' },
  { label: 'Questions', href: '/silly-questions' },
  { label: 'Technical Terms', href: '/technical-terms' },
  { label: 'About', href: '/about' },
];

const moreNav = [
  { label: 'TIL', href: '/til' },
  { label: 'Topics', href: '/topics' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'Series', href: '/series' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Resources', href: '/resources' },
  { label: 'Newsletter', href: '/newsletter' },
];

export function Header({ isScrolled, isMobileMenuOpen, onMobileMenuToggle, onSearchOpen }: HeaderProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const moreRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isMoreActive = moreNav.some(item => pathname.startsWith(item.href));

  const closeMenu = useCallback(() => {
    setMoreOpen(false);
    setFocusIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
        setFocusIndex(-1);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [moreOpen]);

  useEffect(() => {
    setMoreOpen(false);
    setFocusIndex(-1);
  }, [pathname]);

  useEffect(() => {
    if (moreOpen && focusIndex >= 0 && menuItemsRef.current[focusIndex]) {
      menuItemsRef.current[focusIndex]?.focus();
    }
  }, [focusIndex, moreOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMoreOpen(true);
      setFocusIndex(0);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setMoreOpen(true);
      setFocusIndex(moreNav.length - 1);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex(index < moreNav.length - 1 ? index + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex(index > 0 ? index - 1 : moreNav.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        setMoreOpen(false);
        setFocusIndex(-1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusIndex(moreNav.length - 1);
        break;
    }
  };

  return (
    <nav
      id="navigation"
      className={`header-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'scrolled backdrop-blur-md shadow-sm' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight transition-opacity duration-200 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: 'var(--text-primary)', outlineColor: 'var(--accent-500)' }}
            >
              Ratn<span style={{ color: 'var(--accent-500)' }}>Labs</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="hidden md:flex items-center space-x-1">
              {primaryNav.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => trackNavigation(item.href, 'navbar')}
                  className="px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={isActiveLink(item.href)
                    ? { color: 'var(--accent-500)', borderBottom: '2px solid var(--accent-500)', outlineColor: 'var(--accent-500)' }
                    : { color: 'var(--text-secondary)', borderBottom: '2px solid transparent', outlineColor: 'var(--accent-500)' }
                  }
                >
                  {item.label}
                </Link>
              ))}

              <div className="relative" ref={moreRef}>
                <button
                  ref={triggerRef}
                  onClick={() => { setMoreOpen(prev => !prev); if (!moreOpen) setFocusIndex(0); }}
                  onKeyDown={handleTriggerKeyDown}
                  className="px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={isMoreActive
                    ? { color: 'var(--accent-500)', borderBottom: '2px solid var(--accent-500)', outlineColor: 'var(--accent-500)' }
                    : { color: 'var(--text-secondary)', borderBottom: '2px solid transparent', outlineColor: 'var(--accent-500)' }
                  }
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  aria-controls="more-menu"
                >
                  More
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {moreOpen && (
                  <div
                    id="more-menu"
                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                    style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                    role="menu"
                    aria-label="More pages"
                  >
                    {moreNav.map((item, index) => (
                      <Link
                        key={item.href}
                        ref={el => { menuItemsRef.current[index] = el; }}
                        href={item.href}
                        onClick={() => { trackNavigation(item.href, 'navbar-more'); closeMenu(); }}
                        onKeyDown={(e) => handleMenuKeyDown(e, index)}
                        className="block px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                        style={isActiveLink(item.href)
                          ? { color: 'var(--accent-500)', borderLeft: '2px solid var(--accent-500)', outlineColor: 'var(--accent-500)' }
                          : { color: 'var(--text-secondary)', borderLeft: '2px solid transparent', outlineColor: 'var(--accent-500)' }
                        }
                        role="menuitem"
                        tabIndex={focusIndex === index ? 0 : -1}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ClientNavigation onSearchOpen={onSearchOpen} />

            <div className="md:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={isMobileMenuOpen
                  ? { backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)', outlineColor: 'var(--accent-500)' }
                  : { color: 'var(--text-muted)', outlineColor: 'var(--accent-500)' }
                }
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
