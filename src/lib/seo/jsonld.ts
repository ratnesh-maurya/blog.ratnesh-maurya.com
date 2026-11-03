/**
 * JSON-LD helpers shared by every structured-data component.
 *
 * `serializeJsonLd` makes the output safe to inline in a <script> tag (a `</script>`
 * inside a title or description would otherwise end the block early) and drops empty
 * values so we never emit `"image": []` or `"description": ""`.
 */

type Json = string | number | boolean | null | undefined | Json[] | { [key: string]: Json };

/** Recursively drops undefined, null, empty strings, empty arrays and empty objects. */
export function pruneJsonLd(value: Json): Json {
  if (Array.isArray(value)) {
    const items = value.map(pruneJsonLd).filter((v) => v !== undefined);
    return items.length > 0 ? items : undefined;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => [k, pruneJsonLd(v)] as const)
      .filter(([, v]) => v !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  if (value === null || value === '') return undefined;
  return value;
}

const UNSAFE_CHARS: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

/** Serializes to JSON that cannot break out of a <script type="application/ld+json"> block. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(pruneJsonLd(data as Json) ?? {}).replace(
    /[<>&\u2028\u2029]/g,
    (ch) => UNSAFE_CHARS[ch],
  );
}

/** ISO 8601 string for a frontmatter date, or undefined when it is missing or unparseable. */
export function toIsoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
