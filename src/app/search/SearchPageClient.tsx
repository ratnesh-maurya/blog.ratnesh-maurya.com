'use client';

import { SearchPopup, TechnicalTermSearchItem, TILSearchItem } from '@/components/SearchPopup';
import { BlogPost, SillyQuestion } from '@/types/blog';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SearchPageClient() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [sillyQuestions, setSillyQuestions] = useState<SillyQuestion[]>([]);
  const [technicalTerms, setTechnicalTerms] = useState<TechnicalTermSearchItem[]>([]);
  const [tilEntries, setTilEntries] = useState<TILSearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/search-data.json', { cache: 'force-cache' });
        if (res.ok) {
          const data = await res.json();
          setBlogPosts(data.blogPosts ?? []);
          setSillyQuestions(data.sillyQuestions ?? []);
          setTechnicalTerms(data.technicalTerms ?? []);
          setTilEntries(data.tilEntries ?? []);
        }
      } catch (e) {
        console.error('Failed to load search data:', e);
      }
      setLoaded(true);
    }
    load();
  }, []);

  const handleClose = useCallback(() => {
    router.push('/');
  }, [router]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-6 h-6 border-2 rounded-full"
          style={{ borderColor: 'var(--accent-300)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <SearchPopup
      isOpen={true}
      onClose={handleClose}
      blogPosts={blogPosts}
      sillyQuestions={sillyQuestions}
      technicalTerms={technicalTerms}
      tilEntries={tilEntries}
    />
  );
}
