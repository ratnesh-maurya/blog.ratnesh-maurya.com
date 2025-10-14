'use client';

import Link from 'next/link';
import { trackBlogCardClick, trackSillyQuestionClick, trackNavigation } from '@/lib/analytics';

interface HomePageClientProps {
  children: React.ReactNode;
}

export function HomePageClient({ children }: HomePageClientProps) {
  return <>{children}</>;
}

interface TrackedLinkProps {
  href: string;
  slug: string;
  title: string;
  type: 'blog' | 'silly-question';
  className?: string;
  children: React.ReactNode;
}

export function TrackedLink({ href, slug, title, type, className, children }: TrackedLinkProps) {
  const handleClick = () => {
    if (type === 'blog') {
      trackBlogCardClick(slug, title, 'homepage');
    } else {
      trackSillyQuestionClick(slug, title, 'homepage');
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

interface TrackedButtonLinkProps {
  href: string;
  destination: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackedButtonLink({ href, destination, className, children }: TrackedButtonLinkProps) {
  return (
    <Link 
      href={href} 
      className={className}
      onClick={() => trackNavigation(destination, 'homepage-button')}
    >
      {children}
    </Link>
  );
}

