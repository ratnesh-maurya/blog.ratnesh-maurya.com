'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClientNavigation } from '@/components/ClientNavigation';
import { SearchPopup } from '@/components/SearchPopup';
import { SkipLink, FocusTrap, useKeyboardShortcut } from '@/components/AccessibilityUtils';
import { TotalViews } from '@/components/TotalViews';
import { BlogPost, SillyQuestion } from '@/types/blog';
import { trackNavigation } from '@/lib/analytics';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [sillyQuestions, setSillyQuestions] = useState<SillyQuestion[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch search data when component mounts
    const fetchSearchData = async () => {
      try {
        const response = await fetch('/search-data.json');
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.blogPosts);
          setSillyQuestions(data.sillyQuestions);
        }
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      }
    };

    fetchSearchData();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll effect for sticky navigation
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Keyboard shortcuts
  useKeyboardShortcut({
    keys: ['ctrl', 'k'],
    description: 'Open search',
    onTrigger: () => setIsSearchOpen(true)
  });

  useKeyboardShortcut({
    keys: ['escape'],
    description: 'Close search',
    onTrigger: () => setIsSearchOpen(false)
  });

  return (
    <div className="min-h-screen flex flex-col transition-colors bg-white" style={{ color: 'var(--text-primary)' }}>
      {/* Skip Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>

      <nav
        id="navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'backdrop-blur-md shadow-lg'
          : 'shadow-sm'
          }`}
        style={{
          backgroundColor: isScrolled ? 'var(--background)' + '95' : 'var(--background)',
          borderBottomColor: 'var(--border)',
          borderBottomWidth: '1px'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold gradient-text-primary hover:scale-105 transition-transform duration-200"
              >
                Blog&apos;s By Ratnesh
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  href="/blog"
                  onClick={() => trackNavigation('/blog', 'navbar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActiveLink('/blog') || isActiveLink('/')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  Blog
                </Link>
                <Link
                  href="/silly-questions"
                  onClick={() => trackNavigation('/silly-questions', 'navbar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActiveLink('/silly-questions')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  Silly Questions
                </Link>
                <a
                  href="https://ratnesh-maurya.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackNavigation('https://ratnesh-maurya.com', 'navbar')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  Portfolio
                </a>
              </div>

              <ClientNavigation onSearchOpen={() => setIsSearchOpen(true)} />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${isMobileMenuOpen
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">
                    {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                  </span>
                  <div className="relative w-6 h-6">
                    <span className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-1'
                      }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16" />
                      </svg>
                    </span>
                    <span className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
                      </svg>
                    </span>
                    <span className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'rotate-0 translate-y-1'
                      }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18h16" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <Link
              href="/blog"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActiveLink('/blog') || isActiveLink('/')
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              onClick={() => {
                trackNavigation('/blog', 'mobile-menu');
                setIsMobileMenuOpen(false);
              }}
            >
              Blog
            </Link>
            <Link
              href="/silly-questions"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActiveLink('/silly-questions')
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              onClick={() => {
                trackNavigation('/silly-questions', 'mobile-menu');
                setIsMobileMenuOpen(false);
              }}
            >
              Silly Questions
            </Link>
            <a
              href="https://ratnesh-maurya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
              onClick={() => {
                trackNavigation('https://ratnesh-maurya.com', 'mobile-menu');
                setIsMobileMenuOpen(false);
              }}
            >
              Portfolio
            </a>
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1 pt-16 bg-white" role="main">
        {children}
      </main>

      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold gradient-text-primary mb-4">
                    Blog&apos;s By Ratnesh
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                    Exploring web development, programming insights, and the silly mistakes
                    we all make along the way. Learn from real-world experiences and practical solutions.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/ratnesh-maurya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/ratnesh-maurya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/ratnesh_maurya_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                    aria-label="Twitter/X"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://ratnesh-maurya.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                    aria-label="Portfolio"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                      All Posts
                    </Link>
                  </li>
                  <li>
                    <Link href="/silly-questions" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Silly Questions
                    </Link>
                  </li>
                  <li>
                    <a href="/rss.xml" className="text-gray-600 hover:text-blue-600 transition-colors">
                      RSS Feed
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Resources</h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="https://ratnesh-maurya.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/ratnesh-maurya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/ratnesh-maurya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/ratnesh_maurya_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Twitter/X
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © 2025 Ratnesh Maurya. All rights reserved.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Total Views:</span> <TotalViews />
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-gray-500 text-sm">Built with</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Next.js</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-medium text-gray-700">Tailwind CSS</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-medium text-gray-700">TypeScript</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <FocusTrap isActive={isSearchOpen} onEscape={() => setIsSearchOpen(false)}>
        <SearchPopup
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          blogPosts={blogPosts}
          sillyQuestions={sillyQuestions}
        />
      </FocusTrap>

    </div>
  );
}
