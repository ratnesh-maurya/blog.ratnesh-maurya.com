import { serializeJsonLd } from '@/lib/seo/jsonld';

/** Renders one JSON-LD block with script-injection-safe serialization. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
