'use client';

import { useState, useEffect } from 'react';
import { TocItem } from '@/lib/toc';

interface EnhancedTableOfContentsProps {
  toc: TocItem[];
}

export function EnhancedTableOfContents({ toc }: EnhancedTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    // Observe all headings
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300); // Show TOC after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (toc.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`fixed right-6 top-32 w-64 z-40 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
      <div className="rounded-xl shadow-lg border max-h-[calc(100vh-10rem)] overflow-y-auto" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" style={{ color: 'var(--primary-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Table of Contents</h3>
          </div>
          <nav>
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.id} className={`${item.level > 2 ? 'ml-4' : item.level > 1 ? 'ml-2' : ''}`}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 ${activeId === item.id
                        ? 'font-semibold border-l-2'
                        : item.level === 1
                          ? 'font-semibold'
                          : ''
                      }`}
                    style={{
                      backgroundColor: activeId === item.id ? 'var(--primary-50)' : 'transparent',
                      color: activeId === item.id
                        ? 'var(--primary-700)'
                        : item.level === 1
                          ? 'var(--text-primary)'
                          : 'var(--text-secondary)',
                      borderLeftColor: activeId === item.id ? 'var(--primary-600)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeId !== item.id) {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                        e.currentTarget.style.color = 'var(--primary-600)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeId !== item.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = item.level === 1 ? 'var(--text-primary)' : 'var(--text-secondary)';
                      }
                    }}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
