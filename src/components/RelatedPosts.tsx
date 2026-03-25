import { BlogPost } from '@/types/blog';
import Link from 'next/link';

interface RelatedPostsProps {
  currentSlug?: string;
  currentCategory?: string;
  currentTags?: string[];
  allPosts: BlogPost[];
}

function scoreRelevance(post: BlogPost, category?: string, tags?: string[]): number {
  let score = 0;
  if (category && post.category?.toLowerCase() === category?.toLowerCase()) score += 3;
  if (tags) {
    const tagLower = tags.map(t => t.toLowerCase());
    for (const tag of post.tags) {
      if (tagLower.includes(tag.toLowerCase())) score += 1;
    }
  }
  return score;
}

export function RelatedPosts({ currentSlug, currentCategory, currentTags, allPosts }: RelatedPostsProps) {
  const related = allPosts
    .filter(p => !currentSlug || p.slug !== currentSlug)
    .map(p => ({ post: p, score: scoreRelevance(p, currentCategory, currentTags) }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, 6)
    .map(({ post }) => post);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8" style={{ borderTop: '2px solid var(--nb-border)' }}
      aria-label="Related posts">
      <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--text-muted)' }}>
        Related & Recent Blogs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="group nb-card flex flex-col gap-1.5 p-4"
            style={{ backgroundColor: `var(--nb-card-${i % 6})` }}>
            <span className="nb-badge nb-badge-muted self-start">
              {post.category}
            </span>
            <span className="text-sm font-bold leading-snug line-clamp-2 nb-title-hover"
              style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </span>
            <span className="text-xs mt-auto pt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
              {post.readingTime}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
