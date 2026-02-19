'use client';

import { useEffect, useState, useRef } from 'react';

interface FloatingUpvoteButtonProps {
    slug: string;
}

export function FloatingUpvoteButton({ slug }: FloatingUpvoteButtonProps) {
    const [upvotes, setUpvotes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [bottomOffset, setBottomOffset] = useState(24);
    const footerObserverRef = useRef<IntersectionObserver | null>(null);
    const footerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const storageKey = `upvoted:${slug}`;
        if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
            setHasUpvoted(true);
        }

        const fetchUpvotes = async () => {
            try {
                const response = await fetch(`/api/upvotes/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setUpvotes(data.upvotes);
                }
            } catch (error) {
                console.error('Error fetching upvotes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUpvotes();

        const setupFooterObserver = () => {
            const footer = document.querySelector('footer');
            if (!footer) {
                setTimeout(setupFooterObserver, 100);
                return;
            }
            footerRef.current = footer;
            footerObserverRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setBottomOffset(entry.boundingClientRect.height + 24);
                        } else {
                            setBottomOffset(24);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            footerObserverRef.current.observe(footer);
        };

        setTimeout(setupFooterObserver, 100);

        return () => {
            if (footerObserverRef.current && footerRef.current) {
                footerObserverRef.current.unobserve(footerRef.current);
                footerObserverRef.current.disconnect();
            }
        };
    }, [slug]);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasUpvoted || isUpvoting) return;

        setIsUpvoting(true);
        try {
            const response = await fetch(`/api/upvotes/${slug}`, { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setUpvotes(data.upvotes);
                setHasUpvoted(true);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(`upvoted:${slug}`, '1');
                }
            }
        } catch (error) {
            console.error('Error upvoting:', error);
        } finally {
            setIsUpvoting(false);
        }
    };

    if (isLoading) return null;

    const formattedUpvotes = upvotes !== null ? upvotes.toLocaleString() : '0';

    return (
        <button
            onClick={handleUpvote}
            disabled={hasUpvoted || isUpvoting}
            style={{
                bottom: `${bottomOffset}px`,
                backgroundColor: hasUpvoted ? 'var(--accent-50)' : 'var(--surface)',
                borderColor: hasUpvoted ? 'var(--accent-400)' : 'var(--border)',
                color: hasUpvoted ? 'var(--accent-500)' : 'var(--text-secondary)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
            className="fixed right-6 z-50 inline-flex flex-row items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            title={hasUpvoted ? 'Already upvoted' : 'Upvote this post'}
        >
            <svg
                className="w-5 h-5 transition-all duration-200"
                fill={hasUpvoted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
            </svg>
            <span className="text-sm font-semibold">{formattedUpvotes}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Upvote</span>
        </button>
    );
}
