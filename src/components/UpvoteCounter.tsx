'use client';

import { useEffect, useState, useRef } from 'react';
import { getStatsForSlug, incrementStat, type StatType } from '@/lib/supabase/stats';

interface UpvoteCounterProps {
  type: StatType;
  slug: string;
  className?: string;
  showLabel?: boolean;
  initialCount?: number;
  variant?: 'button' | 'inline';
}

export function UpvoteCounter({
  type,
  slug,
  className = '',
  showLabel = true,
  initialCount,
  variant = 'inline',
}: UpvoteCounterProps) {
  const [upvotes, setUpvotes] = useState<number | null>(initialCount ?? null);
  const [isLoading, setIsLoading] = useState(initialCount === undefined);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const storageKey = `upvoted:${type}:${slug}`;
    if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
      setHasUpvoted(true);
    }
  }, [type, slug]);

  useEffect(() => {
    if (initialCount !== undefined) {
      setUpvotes(initialCount);
      setIsLoading(false);
      hasFetched.current = true;
    }
  }, [initialCount]);

  useEffect(() => {
    if (initialCount === undefined && !hasFetched.current && variant === 'button') {
      const run = async () => {
        try {
          const { upvotes: u } = await getStatsForSlug(type, slug);
          setUpvotes(u);
          hasFetched.current = true;
        } catch (error) {
          console.error('Error fetching upvotes:', error);
        } finally {
          setIsLoading(false);
        }
      };
      run();
    } else if (initialCount !== undefined) {
      setUpvotes(initialCount);
      setIsLoading(false);
      hasFetched.current = true;
    } else {
      setUpvotes(0);
      setIsLoading(false);
    }
  }, [type, slug, initialCount, variant]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasUpvoted || isUpvoting) return;

    setIsUpvoting(true);
    try {
      const { upvotes: u } = await incrementStat(type, slug, 'upvote');
      setUpvotes(u);
      setHasUpvoted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`upvoted:${type}:${slug}`, '1');
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  if (isLoading) {
    return (
      <span className={className} style={{ color: 'var(--text-muted)' }}>
        {showLabel && '––– '}upvotes
      </span>
    );
  }

  const formattedUpvotes = upvotes !== null ? upvotes.toLocaleString() : '–––';

  if (variant === 'button') {
    return (
      <button
        onClick={handleUpvote}
        disabled={hasUpvoted || isUpvoting}
        className={`inline-flex flex-row items-center justify-center gap-1.5 px-3 py-2 border rounded-md transition-all duration-200 disabled:cursor-not-allowed ${className}`}
        style={
          hasUpvoted
            ? { borderColor: 'var(--accent-400)', backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)' }
            : { borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }
        }
        title={hasUpvoted ? 'Already upvoted' : 'Upvote this post'}
      >
        <svg
          className="w-5 h-5 transition-all duration-200"
          fill={hasUpvoted ? 'currentColor' : 'none'}
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
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Upvote
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={hasUpvoted || isUpvoting}
      className={`inline-flex items-center gap-1.5 transition-colors duration-200 disabled:cursor-not-allowed ${className}`}
      style={{ color: hasUpvoted ? 'var(--accent-500)' : 'var(--text-muted)' }}
      title={hasUpvoted ? 'Already upvoted' : 'Upvote this post'}
    >
      <svg
        className="w-4 h-4 transition-all duration-200"
        fill={hasUpvoted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      {formattedUpvotes} {showLabel && 'upvotes'}
    </button>
  );
}
