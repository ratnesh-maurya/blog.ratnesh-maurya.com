'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ViewCounter } from '@/components/ViewCounter';
import { SillyQuestion } from '@/types/blog';

interface SillyQuestionsListingClientProps {
    questions: SillyQuestion[];
    initialCategory?: string | null;
}

interface SillyQuestionStats {
    views: Record<string, number>;
    upvotes: Record<string, number>;
    reports?: Record<string, number>;
}

const categoryColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    JavaScript: { bg: '#FEF9C3', text: '#854D0E', darkBg: '#2A1E00', darkText: '#F0C040' },
    TypeScript: { bg: '#DBEAFE', text: '#1E40AF', darkBg: '#0A1830', darkText: '#60A5FA' },
    CSS:        { bg: '#FCE7F3', text: '#9D174D', darkBg: '#2A0A1A', darkText: '#F472B6' },
    React:      { bg: '#CFFAFE', text: '#155E75', darkBg: '#001E26', darkText: '#22D3EE' },
    Node:       { bg: '#DCFCE7', text: '#166534', darkBg: '#041A0C', darkText: '#4ADE80' },
    Default:    { bg: '#FFF0EC', text: '#9A3412', darkBg: '#2E1008', darkText: '#F08870' },
};

function getCategoryStyle(category: string, isDark: boolean) {
    const key = Object.keys(categoryColors).find(k => category?.includes(k)) ?? 'Default';
    const c = categoryColors[key];
    return isDark
        ? { backgroundColor: c.darkBg, color: c.darkText }
        : { backgroundColor: c.bg, color: c.text };
}

export function SillyQuestionsListingClient({ questions, initialCategory = null }: SillyQuestionsListingClientProps) {
    const [stats, setStats] = useState<SillyQuestionStats>({ views: {}, upvotes: {} });
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);

    useEffect(() => {
        setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getStatsByType } = await import('@/lib/supabase/stats');
                const data = await getStatsByType('silly-questions');
                setStats(data);
            } catch (error) {
                console.error('Error fetching silly questions stats:', error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen coral-gradient-bg">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="flex items-start gap-4 mb-2">
                    {/* Coral accent stripe */}
                    <div className="hidden sm:block w-1 h-16 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: 'var(--coral-400)' }} />
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: 'var(--coral-50)', color: 'var(--coral-500)' }}>
                                Debug Diary
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
                            style={{ color: 'var(--text-primary)' }}>
                            Silly Questions &{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, var(--coral-400) 0%, var(--gold-400) 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Mistakes
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg max-w-2xl leading-relaxed"
                            style={{ color: 'var(--text-muted)' }}>
                            We all make silly mistakes while coding. Here are some of mine, along with the lessons
                            learned — hopefully they&apos;ll save you some debugging time.
                        </p>
                    </div>
                </div>

                {/* Stats bar + category filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6"
                    style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                            {activeCategory
                                ? questions.filter(q => q.category?.toLowerCase() === activeCategory.toLowerCase()).length
                                : questions.length
                            }
                        </span>{' '}
                        {activeCategory ? `in "${activeCategory}"` : 'questions & answers'}
                    </div>
                    {/* Category filter pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-150"
                            style={!activeCategory
                                ? { backgroundColor: 'var(--coral-500)', color: '#fff' }
                                : { backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                            }
                        >
                            All
                        </button>
                        {Array.from(new Set(questions.map(q => q.category).filter(Boolean))).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(activeCategory?.toLowerCase() === cat.toLowerCase() ? null : cat)}
                                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-150"
                                style={activeCategory?.toLowerCase() === cat.toLowerCase()
                                    ? { backgroundColor: 'var(--coral-500)', color: '#fff' }
                                    : { backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {questions
                      .filter(q => !activeCategory || q.category?.toLowerCase() === activeCategory.toLowerCase())
                      .map((question) => (
                        <Link key={question.slug} href={`/silly-questions/${question.slug}`} className="block group">
                            <article
                                className="rounded-xl border h-full flex flex-col overflow-hidden transition-all duration-200 group-hover:shadow-lg"
                                style={{
                                    backgroundColor: 'var(--surface)',
                                    borderColor: 'var(--border)',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--coral-300)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = isDark
                                        ? '0 0 0 1px var(--coral-300), 0 8px 24px -4px rgba(0,0,0,0.5)'
                                        : '0 8px 24px -4px rgba(212,66,40,0.12)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                                }}
                            >
                                {/* Colored top accent bar */}
                                <div className="h-1 w-full"
                                    style={{
                                        background: 'linear-gradient(90deg, var(--coral-400) 0%, var(--gold-400) 100%)'
                                    }} />

                                <div className="p-5 flex flex-col flex-grow">
                                    {/* Meta row */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <time
                                            dateTime={question.date}
                                            className="flex items-center gap-1 text-xs"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {format(new Date(question.date), 'MMM dd, yyyy')}
                                        </time>
                                        <span
                                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                            style={getCategoryStyle(question.category, isDark)}
                                        >
                                            {question.category}
                                        </span>
                                    </div>

                                    {/* Question title */}
                                    <h2
                                        className="text-base font-semibold leading-snug mb-3 flex-grow transition-colors duration-200"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {question.question}
                                    </h2>

                                    {/* Tags */}
                                    {question.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {question.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{
                                                        backgroundColor: 'var(--coral-50)',
                                                        color: 'var(--coral-500)',
                                                    }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-auto pt-3 flex items-center justify-between"
                                        style={{ borderTop: '1px solid var(--border)' }}>
                                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {isLoadingStats ? '–' : (
                                                    <ViewCounter
                                                        type="silly-questions"
                                                        slug={question.slug}
                                                        showLabel={false}
                                                        className="text-xs"
                                                        initialCount={stats.views[question.slug] ?? 0}
                                                    />
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                                {isLoadingStats ? '–' : (stats.upvotes[question.slug] ?? 0)}
                                            </span>
                                        </div>

                                        <span
                                            className="text-xs font-semibold flex items-center gap-1 transition-colors duration-200"
                                            style={{ color: 'var(--coral-400)' }}
                                        >
                                            See answer
                                            <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* Empty state when filter has no results */}
                {activeCategory && questions.filter(q => q.category?.toLowerCase() === activeCategory.toLowerCase()).length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                            No questions in &ldquo;{activeCategory}&rdquo;
                        </p>
                        <button onClick={() => setActiveCategory(null)}
                            className="mt-3 text-sm font-medium"
                            style={{ color: 'var(--coral-500)' }}>
                            Clear filter →
                        </button>
                    </div>
                )}

                {questions.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--coral-50)' }}>
                            <span className="text-2xl">🤔</span>
                        </div>
                        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                            No silly questions yet. Check back soon! 😅
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
