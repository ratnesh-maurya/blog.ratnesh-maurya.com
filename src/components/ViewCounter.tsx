'use client';

import { useEffect, useState, useRef } from 'react';

interface ViewCounterProps {
    slug: string;
    className?: string;
    showLabel?: boolean;
    incrementOnView?: boolean; // Only increment when viewing the actual post page
    initialCount?: number; // For master API usage
}

export function ViewCounter({ slug, className = '', showLabel = true, incrementOnView = false, initialCount }: ViewCounterProps) {
    // Initialize with initialCount if provided, otherwise null
    const [views, setViews] = useState<number | null>(initialCount ?? null);
    const [isLoading, setIsLoading] = useState(initialCount === undefined);
    const hasIncremented = useRef(false); // Track if we've already incremented for this page load
    const hasFetched = useRef(false); // Track if we've already fetched

    // Update views when initialCount changes (e.g., from master API loading)
    useEffect(() => {
        if (initialCount !== undefined) {
            setViews(initialCount);
            setIsLoading(false);
            // If we already fetched individually, prefer the master API count
            hasFetched.current = true;
        }
    }, [initialCount]);

    useEffect(() => {
        // On individual pages, fetch current count first, then increment
        if (initialCount === undefined && !hasFetched.current && incrementOnView) {
            const fetchAndIncrement = async () => {
                try {
                    // First, fetch the current view count
                    const fetchResponse = await fetch(`/api/views/${slug}`);
                    if (fetchResponse.ok) {
                        const fetchData = await fetchResponse.json();
                        const currentViews = fetchData.views || 0;
                        setViews(currentViews);
                        hasFetched.current = true;
                        setIsLoading(false);

                        // Then, increment the view count (after a small delay to show the current count)
                        if (!hasIncremented.current) {
                            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to show current count

                            const incrementResponse = await fetch(`/api/views/${slug}`, {
                                method: 'POST',
                            });
                            if (incrementResponse.ok) {
                                const incrementData = await incrementResponse.json();
                                // Use the incremented value from the API response
                                setViews(incrementData.views || currentViews + 1);
                                hasIncremented.current = true;
                            }
                        }
                    } else {
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Error fetching/incrementing views:', error);
                    setIsLoading(false);
                }
            };

            // Small delay to ensure page is fully loaded
            const timer = setTimeout(() => {
                fetchAndIncrement();
            }, 1500);

            return () => clearTimeout(timer);
        } else if (initialCount !== undefined) {
            // If initialCount is provided (including 0), use it and don't fetch
            setViews(initialCount);
            setIsLoading(false);
            hasFetched.current = true;
        } else {
            // If no initial count and not incrementing, set to 0
            setViews(0);
            setIsLoading(false);
        }
    }, [slug, incrementOnView, initialCount]);

    if (isLoading) {
        return (
            <span className={`text-gray-500 ${className}`}>
                {showLabel && '––– '}views
            </span>
        );
    }

    const formattedViews = views !== null ? views.toLocaleString() : '–––';

    return (
        <span className={`text-gray-500 ${className}`}>
            {formattedViews} {showLabel && 'views'}
        </span>
    );
}

