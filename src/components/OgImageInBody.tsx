/**
 * Renders the page's OG image in the body as a hidden img so crawlers can find it.
 * Not visible to users; used for indexing.
 */
import Image from 'next/image';

interface OgImageInBodyProps {
  src: string;
  alt: string;
}

export function OgImageInBody({ src, alt }: OgImageInBodyProps) {
  return (
    <div
      aria-hidden
      className="overflow-hidden absolute opacity-0 pointer-events-none"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: 1,
        height: 1,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        clipPath: 'inset(50%)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        loading="lazy"
        fetchPriority="low"
        unoptimized
      />
    </div>
  );
}
