'use client';

import { useEffect, useState, useRef } from 'react';

interface FloatingUpvoteButtonProps {
    slug: string;
}

export function FloatingUpvoteButton({ slug }: FloatingUpvoteButtonProps) {
    const [upvotes, setUpvotes] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [bottomOffset, setBottomOffset] = useState(24); // Default offset from bottom
    const hasUpvoted = useRef(false);
    const footerObserverRef = useRef<IntersectionObserver | null>(null);
    const footerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Fetch initial upvote count
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

        // Wait for DOM to be ready before finding footer
        const setupFooterObserver = () => {
            const footer = document.querySelector('footer');
            if (!footer) {
                // Retry after a short delay if footer not found
                setTimeout(setupFooterObserver, 100);
                return;
            }

            footerRef.current = footer;

            // Create Intersection Observer to detect when footer is visible
            footerObserverRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Footer is visible, move button up
                            const footerHeight = entry.boundingClientRect.height;
                            setBottomOffset(footerHeight + 24); // Footer height + padding
                        } else {
                            // Footer is not visible, keep at default position
                            setBottomOffset(24);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px',
                }
            );

            footerObserverRef.current.observe(footer);
        };

        // Setup observer after a short delay to ensure DOM is ready
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
        return null; // Don't show button while loading
    }

    const formattedUpvotes = upvotes !== null ? upvotes.toLocaleString() : '0';

    return (
        <button
            onClick={handleUpvote}
            disabled={hasUpvoted.current || isUpvoting}
            style={{ bottom: `${bottomOffset}px` }}
            className={`fixed right-6 z-50 inline-flex flex-row items-center justify-center gap-2 px-4 py-3 bg-white border-2 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${hasUpvoted.current
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-xl'
                }`}
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

