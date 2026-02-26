'use client';

import { ViewCounter } from '@/components/ViewCounter';
import { SillyQuestion } from '@/types/blog';
import { format } from 'date-fns';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SillyQuestionsListingClientProps {
    questions: SillyQuestion[];
}

interface SillyQuestionStats {
    views: Record<string, number>;
    upvotes: Record<string, number>;
    reports?: Record<string, number>;
}

export function SillyQuestionsListingClient({ questions }: SillyQuestionsListingClientProps) {
    const searchParams = useSearchParams();
    const urlCategory = searchParams.get('category');
    const initialCategory = urlCategory ? decodeURIComponent(urlCategory).replace(/-/g, ' ').trim() : null;

    const [stats, setStats] = useState<SillyQuestionStats>({ views: {}, upvotes: {} });
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);

    useEffect(() => {
        const cat = searchParams.get('category');
        setActiveCategory(cat ? decodeURIComponent(cat).replace(/-/g, ' ').trim() : null);
    }, [searchParams]);

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

    const allCategories = Array.from(new Set(questions.map(q => q.category).filter(Boolean)));

    const filteredQuestions = activeCategory
        ? questions.filter(q => q.category?.toLowerCase() === activeCategory.toLowerCase())
        : questions;

    return (
        <div className="min-h-screen hero-gradient-bg">
            {/* Page Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: 'var(--accent-500)' }}>
                    Debug Diary
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                    style={{ color: 'var(--text-primary)' }}>
                    Silly Questions &{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Mistakes
                    </span>
                </h1>
                <p className="text-base md:text-lg max-w-2xl leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}>
                    We all make silly mistakes while coding. Here are some of mine, along with the lessons
                    learned — hopefully they&apos;ll save you some debugging time.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6"
                    style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {questions.length}
                        </span>{' '}questions & answers
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {allCategories.length}
                        </span>{' '}categories
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Category filter tabs */}
                <nav className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors font-medium"
                        style={!activeCategory
                            ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
                            : { color: 'var(--text-muted)' }
                        }
                    >
                        All
                    </button>
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(activeCategory?.toLowerCase() === cat.toLowerCase() ? null : cat)}
                            className="whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors font-medium"
                            style={activeCategory?.toLowerCase() === cat.toLowerCase()
                                ? { backgroundColor: 'var(--text-primary)', color: 'var(--background)' }
                                : { color: 'var(--text-muted)' }
                            }
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

                {/* Questions — flat list with dividers */}
                <div className="flex flex-col">
                    {filteredQuestions.map((question, index) => (
                        <div key={question.slug}>
                            <Link href={`/silly-questions/${question.slug}`} className="group block py-6">
                                <article>
                                    {/* Category + date line */}
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                                            {question.category}
                                        </span>
                                        <time dateTime={question.date} className="text-[13px]"
                                            style={{ color: 'var(--text-muted)' }}>
                                            {format(new Date(question.date), 'MMM d, yyyy')}
                                        </time>
                                    </div>

                                    {/* Question title */}
                                    <h2 className="text-[20px] md:text-[22px] font-bold leading-snug mb-1.5 group-hover:underline decoration-1 underline-offset-2"
                                        style={{ color: 'var(--text-primary)' }}>
                                        {question.question}
                                    </h2>

                                    {/* Meta row */}
                                    <div className="flex items-center gap-1 text-[13px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
                                        {!isLoadingStats && stats.views[question.slug] != null && (
                                            <>
                                                <ViewCounter
                                                    type="silly-questions"
                                                    slug={question.slug}
                                                    showLabel={false}
                                                    className="text-[13px]"
                                                    initialCount={stats.views[question.slug] ?? 0}
                                                />
                                                <span> views</span>
                                            </>
                                        )}
                                        {!isLoadingStats && stats.upvotes[question.slug] != null && (
                                            <>
                                                <span className="mx-1">·</span>
                                                <span>{stats.upvotes[question.slug]} upvotes</span>
                                            </>
                                        )}

                                        {/* Tags - first 2 */}
                                        {question.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="ml-1.5 px-2 py-0.5 rounded-full text-xs"
                                                style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                                                {tag}
                                            </span>
                                        ))}

                                        <span className="ml-auto text-xs font-semibold flex items-center gap-1"
                                            style={{ color: 'var(--accent-500)' }}>
                                            See answer
                                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </article>
                            </Link>
                            {index < filteredQuestions.length - 1 && (
                                <hr className="border-0" style={{ borderTop: '1px solid var(--border)' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty states */}
                {filteredQuestions.length === 0 && activeCategory && (
                    <div className="text-center py-20">
                        <p className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                            No questions in &ldquo;{activeCategory}&rdquo;
                        </p>
                        <button onClick={() => setActiveCategory(null)}
                            className="mt-3 text-sm font-medium"
                            style={{ color: 'var(--accent-500)' }}>
                            Show all questions →
                        </button>
                    </div>
                )}

                {questions.length === 0 && (
                    <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
                        <p className="text-4xl mb-4">🤔</p>
                        <p className="text-base font-medium">
                            No silly questions yet. Check back soon! 😅
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
