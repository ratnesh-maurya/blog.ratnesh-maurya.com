import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  currentSlug: string;
  currentCategory: string;
  currentTags: string[];
  allPosts: BlogPost[];
}

function scoreRelevance(post: BlogPost, category: string, tags: string[]): number {
  let score = 0;
  if (post.category?.toLowerCase() === category?.toLowerCase()) score += 3;
  const tagLower = tags.map(t => t.toLowerCase());
  for (const tag of post.tags) {
    if (tagLower.includes(tag.toLowerCase())) score += 1;
  }
  return score;
}

export function RelatedPosts({ currentSlug, currentCategory, currentTags, allPosts }: RelatedPostsProps) {
  const related = allPosts
    .filter(p => p.slug !== currentSlug)
    .map(p => ({ post: p, score: scoreRelevance(p, currentCategory, currentTags) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, 3)
    .map(({ post }) => post);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}
      aria-label="Related posts">
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--text-muted)' }}>
        Related Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="group flex flex-col gap-1.5 p-4 rounded-xl border transition-all duration-200"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--accent-500)' }}>
              {post.category}
            </span>
            <span className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[var(--accent-500)] transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </span>
            <span className="text-xs mt-auto pt-1" style={{ color: 'var(--text-muted)' }}>
              {post.readingTime}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
