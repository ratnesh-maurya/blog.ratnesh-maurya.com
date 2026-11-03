/** Offline checks for JSON-LD serialization, technical frontmatter and taxonomy slugs: npm run seo:test */
import assert from 'assert';
import { pruneJsonLd, serializeJsonLd, toIsoDate } from '../src/lib/seo/jsonld';
import { parseTechnicalMeta } from '../src/lib/technicalMeta';
import { categoryPath, getCategories, tagPath } from '../src/lib/taxonomy';

// serializeJsonLd: cannot break out of a <script> block, and round-trips.
const hostile = { headline: '</script><script>alert(1)</script> & "quotes"', note: 'a\u2028b\u2029c' };
const out = serializeJsonLd(hostile);
assert(!/[<>&\u2028\u2029]/.test(out), 'unsafe characters must be escaped');
assert.deepEqual(JSON.parse(out), hostile);

// pruneJsonLd: drops empty values, keeps 0 and false.
assert.deepEqual(
  pruneJsonLd({ a: '', b: [], c: {}, d: null, e: undefined, f: 0, g: false, h: [{ i: '' }, 'x'] }),
  { f: 0, g: false, h: ['x'] },
);
assert.equal(serializeJsonLd({ a: '' }), '{}');

// toIsoDate: valid -> ISO 8601, missing or garbage -> undefined (never "Invalid Date" / a throw).
assert.equal(toIsoDate('2023-12-10'), '2023-12-10T00:00:00.000Z');
assert.equal(toIsoDate(undefined), undefined);
assert.equal(toIsoDate('not a date'), undefined);

// parseTechnicalMeta: existing articles (no fields) are unaffected; bad input is dropped.
assert.deepEqual(parseTechnicalMeta({ title: 'x' }), {
  language: undefined, framework: undefined, softwareVersion: undefined,
  testedEnvironment: undefined, repo: undefined, references: undefined,
});
const tech = parseTechnicalMeta({
  language: ' Go ',
  framework: 42,
  repo: 'javascript:alert(1)',
  references: [
    { title: 'Go docs', url: 'https://go.dev/doc/' },
    { title: 'bad scheme', url: 'ftp://example.com' },
    { title: '', url: 'https://example.com' },
    'nope',
  ],
});
assert.equal(tech.language, 'Go');
assert.equal(tech.framework, undefined);
assert.equal(tech.repo, undefined);
assert.deepEqual(tech.references, [{ title: 'Go docs', url: 'https://go.dev/doc/' }]);

// Taxonomy: slugs match the sitemap's tag slugs; categories group case-insensitively.
assert.equal(tagPath('Cloud & DevOps'), '/blog/tag/cloud-%26-devops/');
assert.equal(categoryPath('Software Architecture'), '/blog/category/software-architecture/');
const cats = getCategories([
  { category: 'Golang', date: '2024-01-01' },
  { category: 'golang', date: '2024-03-01', updated: '2024-05-01' },
  { category: 'AWS', date: '2023-01-01' },
]);
assert.equal(cats.length, 2);
assert.deepEqual(cats[0], { label: 'Golang', slug: 'golang', count: 2, latestDate: '2024-05-01' });

console.log('seo selftest: ok');
