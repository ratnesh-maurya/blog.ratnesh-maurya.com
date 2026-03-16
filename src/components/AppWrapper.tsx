'use client';

import { AccentColorProvider } from '@/components/AccentColorProvider';
import { FocusTrap, SkipLink, useKeyboardShortcut } from '@/components/AccessibilityUtils';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileMenu } from '@/components/MobileMenu';
import { SearchPopup } from '@/components/SearchPopup';
import { UtmTracker } from '@/components/UtmTracker';
import { BlogPost, SillyQuestion } from '@/types/blog';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchDataLoaded, setSearchDataLoaded] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [sillyQuestions, setSillyQuestions] = useState<SillyQuestion[]>([]);
  const [technicalTerms, setTechnicalTerms] = useState<{ slug: string; title: string; description: string }[]>([]);
  const [tilEntries, setTilEntries] = useState<{ slug: string; title: string; description: string; tags: string[]; category: string; date: string }[]>([]);
  const pathname = usePathname();

  const loadSearchData = useCallback(async () => {
    if (searchDataLoaded) return;
    try {
      const response = await fetch('/search-data.json');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.blogPosts ?? []);
        setSillyQuestions(data.sillyQuestions ?? []);
        setTechnicalTerms(data.technicalTerms ?? []);
        setTilEntries(data.tilEntries ?? []);
        setSearchDataLoaded(true);
      }
    } catch (error) {
      console.error('Failed to fetch search data:', error);
    }
  }, [searchDataLoaded]);

  const openSearch = useCallback(() => {
    loadSearchData();
    setIsSearchOpen(true);
  }, [loadSearchData]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useKeyboardShortcut({
    keys: ['ctrl', 'k'],
    description: 'Open search',
    onTrigger: openSearch,
  });

  useKeyboardShortcut({
    keys: ['escape'],
    description: 'Close search',
    onTrigger: () => setIsSearchOpen(false),
  });

  return (
    <AccentColorProvider>
      <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
        <UtmTracker />

        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>

        <Header
          isScrolled={isScrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
          onSearchOpen={openSearch}
        />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onSearchOpen={openSearch}
        />

        <main id="main-content" className="flex-1 pt-16" style={{ backgroundColor: 'var(--background)' }} role="main">
          {children}
        </main>

        <Footer />

        <FocusTrap isActive={isSearchOpen} onEscape={() => setIsSearchOpen(false)}>
          <SearchPopup
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            blogPosts={blogPosts}
            sillyQuestions={sillyQuestions}
            technicalTerms={technicalTerms}
            tilEntries={tilEntries}
          />
        </FocusTrap>
      </div>
    </AccentColorProvider>
  );
}
