import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function BlogImage({
  src,
  alt,
  width = 800,
  height = 400,
  className = '',
  priority = false,
  fill = false
}: BlogImageProps) {
  // Handle both absolute and relative paths
  const imageSrc = src.startsWith('/') ? src : `/images/blog/${src}`;

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            color: 'transparent'
          }}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

interface BlogCardImageProps {
  post: {
    image?: string;
    title: string;
    slug: string;
  };
  className?: string;
}

export function BlogCardImage({ post, className = "h-48" }: BlogCardImageProps) {
  if (!post.image) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center`}>
        <div className="text-white text-center p-6">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
          <div className="w-12 h-1 bg-white/30 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`} style={{ minHeight: '160px', width: '100%' }}>
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

interface SocialImageProps {
  post: {
    image?: string;
    title: string;
    slug: string;
  };
  type?: 'og' | 'twitter';
}

export function getSocialImageUrl({ post, type = 'og' }: SocialImageProps): string {
  // If post has a custom social image, use it
  if (post.image) {
    return post.image.startsWith('/') ? post.image : `/images/blog/${post.image}`;
  }

  // Otherwise, generate a default social image path
  return `/images/social/${type}-${post.slug}.jpg`;
}

export function getDefaultSocialImage(type: 'og' | 'twitter' = 'og', page: 'home' | 'blog' | 'silly-questions' = 'home'): string {
  return `/images/social/default-${page}-${type}.svg`;
}

// Generate a fallback OG image URL when no specific image exists
export function generateFallbackOGImage(title: string, type: 'blog' | 'silly-question' | 'page' = 'page'): string {
  // For now, return a default image. In the future, this could generate dynamic images
  const pageType = type === 'silly-question' ? 'silly-questions' : type === 'blog' ? 'blog' : 'home';
  return `/images/social/default-${pageType}-og.svg`;
}
