'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClientNavigation } from '@/components/ClientNavigation';
import { SearchPopup } from '@/components/SearchPopup';
import { PWAInstaller } from '@/components/PWAInstaller';
import { BlogPost, SillyQuestion } from '@/types/blog';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [sillyQuestions, setSillyQuestions] = useState<SillyQuestion[]>([]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Blog&apos;s By Ratnesh
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="text-gray-900 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/blog"
                    className="text-gray-900 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/silly-questions"
                    className="text-gray-900 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Silly Questions
                  </Link>
                  <a
                    href="https://ratnesh-maurya.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Portfolio
                  </a>
                </div>
              </div>

              <ClientNavigation onSearchOpen={() => setIsSearchOpen(true)} />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="text-gray-900 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-gray-900 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/silly-questions"
                className="text-gray-900 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Silly Questions
              </Link>
              <a
                href="https://ratnesh-maurya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </a>
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-900 hover:text-orange-600 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Ratnesh Maurya. Built with Next.js and Tailwind CSS.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a
                href="https://ratnesh-maurya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/ratnesh-maurya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/ratnesh-maurya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>

      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        blogPosts={blogPosts}
        sillyQuestions={sillyQuestions}
      />

      <PWAInstaller />
    </div>
  );
}
