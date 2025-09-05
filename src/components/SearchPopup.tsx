'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogPost, SillyQuestion } from '@/types/blog';
import Link from 'next/link';
import { format } from 'date-fns';

interface SearchResult {
  type: 'blog' | 'question';
  item: BlogPost | SillyQuestion;
  score: number;
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  blogPosts: BlogPost[];
  sillyQuestions: SillyQuestion[];
}

// Simple fuzzy search implementation
function fuzzySearch(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  if (textLower.includes(queryLower)) {
    return 1; // Exact match gets highest score
  }

  let score = 0;
  let queryIndex = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score++;
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length ? score / textLower.length : 0;
}

function searchContent(query: string, blogPosts: BlogPost[], sillyQuestions: SillyQuestion[]): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  // Search blog posts
  blogPosts.forEach(post => {
    const titleScore = fuzzySearch(query, post.title) * 3; // Title matches are more important
    const descriptionScore = fuzzySearch(query, post.description) * 2;
    const tagsScore = post.tags.reduce((acc, tag) => acc + fuzzySearch(query, tag), 0);
    const categoryScore = fuzzySearch(query, post.category);

    const totalScore = titleScore + descriptionScore + tagsScore + categoryScore;

    if (totalScore > 0) {
      results.push({
        type: 'blog',
        item: post,
        score: totalScore
      });
    }
  });

  // Search silly questions
  sillyQuestions.forEach(question => {
    const questionScore = fuzzySearch(query, question.question) * 3;
    const answerScore = fuzzySearch(query, question.answer || '') * 2;
    const tagsScore = question.tags.reduce((acc, tag) => acc + fuzzySearch(query, tag), 0);

    const totalScore = questionScore + answerScore + tagsScore;

    if (totalScore > 0) {
      results.push({
        type: 'question',
        item: question,
        score: totalScore
      });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 8); // Top 8 results
}

export function SearchPopup({ isOpen, onClose, blogPosts, sillyQuestions }: SearchPopupProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchResults = searchContent(query, blogPosts, sillyQuestions);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, blogPosts, sillyQuestions]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter' && results[selectedIndex]) {
        const result = results[selectedIndex];
        const url = result.type === 'blog'
          ? `/blog/${(result.item as BlogPost).slug}`
          : `/silly-questions/${(result.item as SillyQuestion).slug}`;
        window.location.href = url;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-20 transition-all duration-200 ${isOpen
      ? 'bg-transparent visible'
      : 'bg-transparent invisible pointer-events-none'
      }`}>
      <div ref={popupRef} className={`bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 border border-gray-200 transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search posts and questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.item.slug}`}
                  href={result.type === 'blog' ? `/blog/${(result.item as BlogPost).slug}` : `/silly-questions/${(result.item as SillyQuestion).slug}`}
                  className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  onClick={onClose}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${result.type === 'blog' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${result.type === 'blog'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {result.type === 'blog' ? 'Blog Post' : 'Question'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(result.item.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {result.type === 'blog'
                          ? (result.item as BlogPost).title
                          : (result.item as SillyQuestion).question
                        }
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {result.type === 'blog'
                          ? (result.item as BlogPost).description
                          : (result.item as SillyQuestion).answer?.substring(0, 100) + '...'
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No results found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <p className="text-sm">Start typing to search posts and questions...</p>
              <div className="mt-4 text-xs text-gray-400">
                <p>Use ↑↓ to navigate • Enter to select • Esc to close</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
