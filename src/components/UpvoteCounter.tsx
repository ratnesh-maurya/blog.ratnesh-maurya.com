'use client';

import { useEffect, useState, useRef } from 'react';

interface UpvoteCounterProps {
    slug: string;
    className?: string;
    showLabel?: boolean;
    initialCount?: number; // For master API usage
    variant?: 'button' | 'inline'; // Button style like Stack Overflow or inline
}

export function UpvoteCounter({ slug, className = '', showLabel = true, initialCount, variant = 'inline' }: UpvoteCounterProps) {
    const [upvotes, setUpvotes] = useState<number | null>(initialCount ?? null);
    const [isLoading, setIsLoading] = useState(initialCount === undefined);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const hasUpvoted = useRef(false);
    const hasFetched = useRef(false);

    // Update upvotes when initialCount changes (e.g., from master API loading)
    useEffect(() => {
        if (initialCount !== undefined) {
            setUpvotes(initialCount);
            setIsLoading(false);
            hasFetched.current = true;
        }
    }, [initialCount]);

    useEffect(() => {
        // Only fetch if we don't have initial count and haven't fetched yet
        // On listing pages, initialCount should be provided (0 or actual count)
        // On individual pages, we fetch individually
        if (initialCount === undefined && !hasFetched.current && variant === 'button') {
            // Only fetch individually on individual post pages (when variant is 'button')
            const fetchUpvotes = async () => {
                try {
                    const response = await fetch(`/api/upvotes/${slug}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUpvotes(data.upvotes);
                        hasFetched.current = true;
                    }
                } catch (error) {
                    console.error('Error fetching upvotes:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUpvotes();
        } else if (initialCount !== undefined) {
            // If initialCount is provided (including 0), use it and don't fetch
            setUpvotes(initialCount);
            setIsLoading(false);
            hasFetched.current = true;
        } else {
            // If no initial count and inline variant, set to 0
            setUpvotes(0);
            setIsLoading(false);
        }
    }, [slug, initialCount, variant]);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasUpvoted.current || isUpvoting) return;

        setIsUpvoting(true);
        try {
            const response = await fetch(`/api/upvotes/${slug}`, {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setUpvotes(data.upvotes);
                hasUpvoted.current = true;
            }
        } catch (error) {
            console.error('Error upvoting:', error);
        } finally {
            setIsUpvoting(false);
        }
    };

    if (isLoading) {
        return (
            <span className={`text-gray-500 ${className}`}>
                {showLabel && '––– '}upvotes
            </span>
        );
    }

    const formattedUpvotes = upvotes !== null ? upvotes.toLocaleString() : '–––';

    // Button variant like Stack Overflow - vertical layout
    if (variant === 'button') {
        return (
            <button
                onClick={handleUpvote}
                disabled={hasUpvoted.current || isUpvoting}
                className={`inline-flex flex-row items-center justify-center gap-1 px-3 py-2 border rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${hasUpvoted.current
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                    } ${className}`}
                title={hasUpvoted.current ? 'Already upvoted' : 'Upvote this post'}
            >
                <svg
                    className={`w-5 h-5 ${hasUpvoted.current ? 'fill-blue-600' : 'fill-none'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                </svg>
                <span className="text-sm font-semibold">{formattedUpvotes}</span>
                <span className="text-xs text-gray-500">Upvote</span>
            </button>
        );
    }

    // Inline variant (for listing pages)
    return (
        <button
            onClick={handleUpvote}
            disabled={hasUpvoted.current || isUpvoting}
            className={`inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            title={hasUpvoted.current ? 'Already upvoted' : 'Upvote this post'}
        >
            <svg
                className={`w-4 h-4 ${hasUpvoted.current ? 'fill-blue-600 text-blue-600' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                />
            </svg>
            {formattedUpvotes} {showLabel && 'upvotes'}
        </button>
    );
}

