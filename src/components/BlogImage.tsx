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
  objectFit?: 'cover' | 'contain';
}

export function BlogCardImage({ post, className = "h-48", objectFit = 'contain' }: BlogCardImageProps) {
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

  // If objectFit is contain, use a different approach for full height
  if (objectFit === 'contain') {
    const imageSrc = post.image.startsWith('/') ? post.image : `/images/blog/${post.image}`;
    return (
      <div className={`${className} relative overflow-visible flex items-center justify-center`} style={{ width: 'auto', minWidth: 0, maxHeight: '100%' }}>
        <img
          src={imageSrc}
          alt={post.title}
          className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
          style={{ maxHeight: '100%', width: 'auto', height: 'auto' }}
        />
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
  // If post has an image, use it
  if (post.image) {
    return post.image.startsWith('/') ? post.image : `/images/blog/${post.image}`;
  }

  // Otherwise, fall back to the default blog social image
  return getDefaultSocialImage(type, 'blog');
}

export function getDefaultSocialImage(type: 'og' | 'twitter' = 'og', page: 'home' | 'blog' | 'silly-questions' = 'home'): string {
  return `/images/social/default-${page}-${type}.jpg`;
}

// Generate a fallback OG image URL when no specific image exists
export function generateFallbackOGImage(title: string, type: 'blog' | 'silly-question' | 'page' = 'page'): string {
  // For now, return a default image. In the future, this could generate dynamic images
  const pageType = type === 'silly-question' ? 'silly-questions' : type === 'blog' ? 'blog' : 'home';
  return `/images/social/default-${pageType}-og.jpg`;
}
