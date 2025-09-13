'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { BlogPost, SillyQuestion } from '@/types/blog';
import Link from 'next/link';
import { format } from 'date-fns';

interface SearchResult {
  type: 'blog' | 'question';
  item: BlogPost | SillyQuestion;
  score: number;
  matchedFields: string[];
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  blogPosts: BlogPost[];
  sillyQuestions: SillyQuestion[];
}

type FilterType = 'all' | 'blog' | 'question';
type SortType = 'relevance' | 'date' | 'title';

// Enhanced search implementation with better matching
function searchScore(query: string, text: string): { score: number; matched: boolean } {
  const queryLower = query.toLowerCase().trim();
  const textLower = text.toLowerCase();

  if (!queryLower) return { score: 0, matched: false };

  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    const exactIndex = textLower.indexOf(queryLower);
    const isWordBoundary = exactIndex === 0 || /\s/.test(textLower[exactIndex - 1]);
    return {
      score: isWordBoundary ? 10 : 8,
      matched: true
    };
  }

  // Word boundary matches
  const words = queryLower.split(/\s+/);
  let wordMatches = 0;
  for (const word of words) {
    if (textLower.includes(word)) {
      wordMatches++;
    }
  }

  if (wordMatches > 0) {
    return {
      score: (wordMatches / words.length) * 5,
      matched: true
    };
  }

  // Fuzzy matching for partial matches
  let score = 0;
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score++;
      queryIndex++;
    }
  }

  const fuzzyScore = queryIndex === queryLower.length ? (score / textLower.length) * 2 : 0;
  return {
    score: fuzzyScore,
    matched: fuzzyScore > 0.3
  };
}

function searchContent(query: string, blogPosts: BlogPost[], sillyQuestions: SillyQuestion[], filterType: FilterType = 'all'): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  // Search blog posts
  if (filterType === 'all' || filterType === 'blog') {
    blogPosts.forEach(post => {
      const matchedFields: string[] = [];
      let totalScore = 0;

      const titleResult = searchScore(query, post.title);
      if (titleResult.matched) {
        totalScore += titleResult.score * 3;
        matchedFields.push('title');
      }

      const descriptionResult = searchScore(query, post.description);
      if (descriptionResult.matched) {
        totalScore += descriptionResult.score * 2;
        matchedFields.push('description');
      }

      const categoryResult = searchScore(query, post.category);
      if (categoryResult.matched) {
        totalScore += categoryResult.score * 1.5;
        matchedFields.push('category');
      }

      let tagsScore = 0;
      post.tags.forEach(tag => {
        const tagResult = searchScore(query, tag);
        if (tagResult.matched) {
          tagsScore += tagResult.score;
          if (!matchedFields.includes('tags')) {
            matchedFields.push('tags');
          }
        }
      });
      totalScore += tagsScore;

      if (totalScore > 0) {
        results.push({
          type: 'blog',
          item: post,
          score: totalScore,
          matchedFields
        });
      }
    });
  }

  // Search silly questions
  if (filterType === 'all' || filterType === 'question') {
    sillyQuestions.forEach(question => {
      const matchedFields: string[] = [];
      let totalScore = 0;

      const questionResult = searchScore(query, question.question);
      if (questionResult.matched) {
        totalScore += questionResult.score * 3;
        matchedFields.push('question');
      }

      if (question.answer) {
        const answerResult = searchScore(query, question.answer);
        if (answerResult.matched) {
          totalScore += answerResult.score * 2;
          matchedFields.push('answer');
        }
      }

      let tagsScore = 0;
      question.tags.forEach(tag => {
        const tagResult = searchScore(query, tag);
        if (tagResult.matched) {
          tagsScore += tagResult.score;
          if (!matchedFields.includes('tags')) {
            matchedFields.push('tags');
          }
        }
      });
      totalScore += tagsScore;

      if (totalScore > 0) {
        results.push({
          type: 'question',
          item: question,
          score: totalScore,
          matchedFields
        });
      }
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 12); // Top 12 results
}

export function SearchPopup({ isOpen, onClose, blogPosts, sillyQuestions }: SearchPopupProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Get unique categories and tags for suggestions
  const suggestions = useMemo(() => {
    const categories = Array.from(new Set(blogPosts.map(post => post.category)));
    const tags = Array.from(new Set([
      ...blogPosts.flatMap(post => post.tags),
      ...sillyQuestions.flatMap(q => q.tags)
    ]));
    return { categories, tags };
  }, [blogPosts, sillyQuestions]);

  // Search and sort results
  const sortedResults = useMemo(() => {
    const searchResults = searchContent(query, blogPosts, sillyQuestions, filterType);

    if (sortType === 'date') {
      return searchResults.sort((a, b) => new Date(b.item.date).getTime() - new Date(a.item.date).getTime());
    } else if (sortType === 'title') {
      return searchResults.sort((a, b) => {
        const titleA = a.type === 'blog' ? (a.item as BlogPost).title : (a.item as SillyQuestion).question;
        const titleB = b.type === 'blog' ? (b.item as BlogPost).title : (b.item as SillyQuestion).question;
        return titleA.localeCompare(titleB);
      });
    }
    return searchResults; // relevance (default)
  }, [query, blogPosts, sillyQuestions, filterType, sortType]);

  useEffect(() => {
    setResults(sortedResults);
    setSelectedIndex(0);
  }, [sortedResults]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setFilterType('all');
      setSortType('relevance');
      setSelectedIndex(0);
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
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-16 transition-all duration-300 ${isOpen
      ? 'bg-black/20 backdrop-blur-sm visible'
      : 'bg-transparent invisible pointer-events-none'
      }`}>
      <div ref={popupRef} className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 border border-gray-200 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
        }`}>
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Search</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <svg className="absolute left-4 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search posts, questions, tags, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Content</option>
                <option value="blog">Blog Posts ({blogPosts.length})</option>
                <option value="question">Questions ({sillyQuestions.length})</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Latest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
            {results.length > 0 && (
              <div className="flex items-end">
                <div className="text-sm text-gray-500 py-2">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[500px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-4 space-y-3">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.item.slug}`}
                  href={result.type === 'blog' ? `/blog/${(result.item as BlogPost).slug}` : `/silly-questions/${(result.item as SillyQuestion).slug}`}
                  className={`block p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${index === selectedIndex
                    ? 'bg-blue-50 border-blue-200 shadow-md'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  onClick={onClose}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${result.type === 'blog' ? 'bg-blue-100' : 'bg-amber-100'
                      }`}>
                      {result.type === 'blog' ? (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${result.type === 'blog'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                          }`}>
                          {result.type === 'blog' ? 'Blog Post' : 'Question'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(result.item.date), 'MMM dd, yyyy')}
                        </span>
                        {result.matchedFields.length > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            Matched: {result.matchedFields.join(', ')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                        {result.type === 'blog'
                          ? (result.item as BlogPost).title
                          : (result.item as SillyQuestion).question
                        }
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {result.type === 'blog'
                          ? (result.item as BlogPost).description
                          : (result.item as SillyQuestion).answer?.substring(0, 150) + '...'
                        }
                      </p>
                      {result.type === 'blog' && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {(result.item as BlogPost).category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(result.item as BlogPost).readingTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">No results found for &ldquo;{query}&rdquo;</p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Try different keywords or check spelling</p>
                <p>• Use broader search terms</p>
                <p>• Try searching for tags or categories</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Content</h3>
                <p className="text-gray-500 mb-4">Start typing to search through all posts and questions</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Use ↑↓ to navigate results</p>
                  <p>• Press Enter to select</p>
                  <p>• Press Esc to close</p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.categories.slice(0, 6).map(category => (
                      <button
                        key={category}
                        onClick={() => setQuery(category)}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
