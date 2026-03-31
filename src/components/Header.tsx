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
  { label: 'News', href: '/news' },
  { label: 'Questions', href: '/silly-questions' },
  { label: 'Terms', href: '/technical-terms' },
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
      className={`header-nav fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: 'var(--accent-500)' }}
          >
            <span
              className="inline-flex w-8 h-8 items-center justify-center rounded-lg flex-shrink-0 transition-transform duration-150 group-hover:scale-95"
              style={{ backgroundColor: 'var(--text-primary)', border: '2px solid var(--nb-border)' }}
            >
              <span className="text-xs font-black" style={{ color: 'var(--background)' }}>R</span>
            </span>
            <span className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Ratn<span style={{ color: 'var(--accent-500)' }}>Labs</span>
            </span>
          </Link>

          {/* ── Right section ── */}
          <div className="flex items-center gap-2">

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {primaryNav.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => trackNavigation(item.href, 'navbar')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-150 border-2 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isActiveLink(item.href) ? 'nb-nav-active' : 'border-transparent hover:border-current'
                  }`}
                  style={isActiveLink(item.href)
                    ? { outlineColor: 'var(--accent-500)' }
                    : { color: 'var(--text-primary)', outlineColor: 'var(--accent-500)' }
                  }
                >
                  {item.label}
                </Link>
              ))}

              {/* More dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  ref={triggerRef}
                  onClick={() => { setMoreOpen(prev => !prev); if (!moreOpen) setFocusIndex(0); }}
                  onKeyDown={handleTriggerKeyDown}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-150 border-2 inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isMoreActive || moreOpen ? 'nb-nav-active' : 'border-transparent hover:border-current'
                  }`}
                  style={isMoreActive || moreOpen
                    ? { outlineColor: 'var(--accent-500)' }
                    : { color: 'var(--text-primary)', outlineColor: 'var(--accent-500)' }
                  }
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  aria-controls="more-menu"
                >
                  More
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {moreOpen && (
                  <div
                    id="more-menu"
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 z-50 overflow-hidden"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '2px solid var(--nb-border)',
                      boxShadow: 'var(--nb-shadow)',
                    }}
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
                        className={`block px-4 py-2.5 text-sm font-semibold transition-all duration-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
                          isActiveLink(item.href) ? 'nb-nav-active' : ''
                        }`}
                        style={isActiveLink(item.href)
                          ? { outlineColor: 'var(--accent-500)' }
                          : {
                              color: 'var(--text-primary)',
                              outlineColor: 'var(--accent-500)',
                            }
                        }
                        onMouseEnter={e => {
                          if (!isActiveLink(item.href)) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--background)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActiveLink(item.href)) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = '';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                          }
                        }}
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

            {/* Search + theme toggle */}
            <ClientNavigation onSearchOpen={onSearchOpen} />

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="inline-flex items-center justify-center p-1.5 rounded-lg transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 border-2"
                style={{
                  borderColor: 'var(--nb-border)',
                  backgroundColor: isMobileMenuOpen ? 'var(--text-primary)' : 'transparent',
                  color: isMobileMenuOpen ? 'var(--background)' : 'var(--text-primary)',
                  outlineColor: 'var(--accent-500)',
                }}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
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
