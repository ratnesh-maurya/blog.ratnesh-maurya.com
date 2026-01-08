'use client';

import { useEffect, useState } from 'react';

export function TotalViews() {
    const [totalViews, setTotalViews] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTotalViews = async () => {
            try {
                const response = await fetch('/api/views/total');
                if (response.ok) {
                    const data = await response.json();
                    setTotalViews(data.totalViews);
                }
            } catch (error) {
                console.error('Error fetching total views:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTotalViews();
    }, []);

    if (isLoading) {
        return <span className="text-gray-700">–––</span>;
    }

    const formattedViews = totalViews !== null ? totalViews.toLocaleString() : '–––';

    return (
        <span className="text-gray-700">{formattedViews}</span>
    );
}

