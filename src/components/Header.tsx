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
  { label: 'Terms', href: '/technical-terms' },
  { label: 'Questions', href: '/silly-questions' },
  { label: 'About', href: '/about' },
];

const moreNav = [
  { label: 'Daily News', href: '/news' },
  { label: 'TIL', href: '/til' },
  { label: 'Topics', href: '/topics' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'Series', href: '/series' },
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
      className={`header-nav fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="lg-nav-inner">

        {/* ── Brand ── */}
        <Link href="/" className="lg-brand" aria-label="RatnLabs home">
          RatnLabs
        </Link>

        {/* ── Links + controls ── */}
        <div className="lg-nav-right">

          {/* Desktop nav */}
          <div className="lg-links">
            {primaryNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => trackNavigation(item.href, 'navbar')}
                className="lg-link"
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                ref={triggerRef}
                onClick={() => { setMoreOpen(prev => { const next = !prev; if (next) setFocusIndex(0); return next; }); }}
                onKeyDown={handleTriggerKeyDown}
                className="lg-link"
                aria-current={isMoreActive ? 'page' : undefined}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                aria-controls="more-menu"
              >
                More
                <svg
                  className={`lg-chevron ${moreOpen ? 'is-open' : ''}`}
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreOpen && (
                <div id="more-menu" className="lg-menu" role="menu" aria-label="More pages">
                  {moreNav.map((item, index) => (
                    <Link
                      key={item.href}
                      ref={el => { menuItemsRef.current[index] = el; }}
                      href={item.href}
                      onClick={() => { trackNavigation(item.href, 'navbar-more'); closeMenu(); }}
                      onKeyDown={(e) => handleMenuKeyDown(e, index)}
                      className="lg-menu-item"
                      aria-current={isActiveLink(item.href) ? 'page' : undefined}
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
          <button
            onClick={onMobileMenuToggle}
            className="lg-icon-btn lg-burger"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
