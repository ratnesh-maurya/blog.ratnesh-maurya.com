'use client';

import { AccentColorProvider } from '@/components/AccentColorProvider';
import { FocusTrap, SkipLink, useKeyboardShortcut } from '@/components/AccessibilityUtils';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import type { NewsSearchItem } from '@/components/SearchPopup';
import { UtmTracker } from '@/components/UtmTracker';
import { BlogPost, SillyQuestion } from '@/types/blog';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const MobileMenu = dynamic(() => import('@/components/MobileMenu').then(m => m.MobileMenu), {
  ssr: false,
});

const SearchPopup = dynamic(() => import('@/components/SearchPopup').then(m => m.SearchPopup), {
  ssr: false,
});

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
  const [newsPosts, setNewsPosts] = useState<NewsSearchItem[]>([]);
  const pathname = usePathname();

  const loadSearchData = useCallback(async () => {
    if (searchDataLoaded) return;
    try {
      const response = await fetch('/search-data.json', { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.blogPosts ?? []);
        setSillyQuestions(data.sillyQuestions ?? []);
        setTechnicalTerms(data.technicalTerms ?? []);
        setTilEntries(data.tilEntries ?? []);
        setNewsPosts(data.newsPosts ?? []);
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
      <div className="app-shell min-h-screen flex flex-col transition-colors" style={{ color: 'var(--text-primary)' }}>
        <UtmTracker />

        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>

        <Header
          isScrolled={isScrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
          onSearchOpen={openSearch}
        />

        {isMobileMenuOpen && (
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onSearchOpen={openSearch}
          />
        )}

        <main id="main-content" className="app-main flex-1 pt-16" role="main">
          {children}
        </main>

        <Footer />

        <FocusTrap isActive={isSearchOpen} onEscape={() => setIsSearchOpen(false)}>
          {isSearchOpen && (
            <SearchPopup
              isOpen={true}
              onClose={() => setIsSearchOpen(false)}
              blogPosts={blogPosts}
              sillyQuestions={sillyQuestions}
              technicalTerms={technicalTerms}
              tilEntries={tilEntries}
              newsPosts={newsPosts}
            />
          )}
        </FocusTrap>
      </div>
    </AccentColorProvider>
  );
}
