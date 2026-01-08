'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ViewCounter } from '@/components/ViewCounter';
import { SillyQuestion } from '@/types/blog';

interface SillyQuestionsListingClientProps {
    questions: SillyQuestion[];
}

interface SillyQuestionStats {
    views: Record<string, number>;
    upvotes: Record<string, number>;
}

export function SillyQuestionsListingClient({ questions }: SillyQuestionsListingClientProps) {
    const [stats, setStats] = useState<SillyQuestionStats>({ views: {}, upvotes: {} });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Fetch stats from master API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats/silly-questions');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching silly questions stats:', error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Silly Questions & Mistakes</h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        We all make silly mistakes while coding. Here are some of mine, along with the lessons learned.
                        Hopefully, they&apos;ll save you some debugging time! 🤦‍♂️
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    {questions.map((question) => (
                        <Link key={question.slug} href={`/silly-questions/${question.slug}`} className="block">
                            <article className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <time dateTime={question.date} className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {format(new Date(question.date), 'MMM dd, yyyy')}
                                    </time>
                                    <span className="mx-2">•</span>
                                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                                        {question.category}
                                    </span>
                                </div>

                                <h2 className="text-xl font-semibold text-gray-900 mb-4 hover:text-blue-600 transition-colors flex-grow">
                                    {question.question}
                                </h2>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {question.tags.map((tag) => (
                                        <span key={tag} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-yellow-200 mt-auto">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {isLoadingStats ? (
                                            <span className="text-sm text-gray-500">–––</span>
                                        ) : (
                                            <ViewCounter
                                                slug={`silly-questions/${question.slug}`}
                                                showLabel={false}
                                                className="text-sm"
                                                initialCount={stats.views[question.slug] ?? 0}
                                            />
                                        )}
                                    </span>
                                    {isLoadingStats ? (
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                            –––
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                            {stats.upvotes[question.slug]?.toLocaleString() || 0} upvotes
                                        </span>
                                    )}
                                </div>

                                <div className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-4">
                                    Read the answer →
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {questions.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No silly questions yet. Check back soon for some embarrassing mistakes! 😅</p>
                    </div>
                )}
            </div>
        </div>
    );
}

