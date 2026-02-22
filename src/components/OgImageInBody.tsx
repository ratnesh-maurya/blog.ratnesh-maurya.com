/**
 * Renders the page's OG image in the body as a hidden img so crawlers can find it.
 * Not visible to users; used for indexing.
 */
interface OgImageInBodyProps {
  src: string;
  alt: string;
}

export function OgImageInBody({ src, alt }: OgImageInBodyProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={1200}
      height={630}
      fetchPriority="low"
      aria-hidden
      className="absolute w-px h-px -left-[9999px] overflow-hidden opacity-0 pointer-events-none"
      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
    />
  );
}
