'use client';

import { useEffect, useRef } from 'react';

interface ViewIncrementerProps {
    slug: string;
}

/**
 * Silent component that increments view count in the background
 * without displaying anything. Used on individual post pages.
 */
export function ViewIncrementer({ slug }: ViewIncrementerProps) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        // Only increment once per page load
        if (!hasIncremented.current) {
            const incrementViews = async () => {
                try {
                    // Small delay to ensure page is fully loaded
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    await fetch(`/api/views/${slug}`, {
                        method: 'POST',
                    });
                    hasIncremented.current = true;
                } catch (error) {
                    console.error('Error incrementing views:', error);
                }
            };

            incrementViews();
        }
    }, [slug]);

    return null; // This component doesn't render anything
}

