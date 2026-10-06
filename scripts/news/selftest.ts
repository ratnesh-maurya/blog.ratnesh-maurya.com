/** Offline checks for the news digest pipeline (no API calls): npm run news:test */
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import matter from 'gray-matter';
import { loadCoveredUrls, existingDigestDates, normalizeUrl, selectCandidates, pickImage, type TavilyResult } from './select';
import { parseDigest } from './digest';
import { renderDigest } from './render';
import { fitText } from './util';

const newsDir = path.join(process.cwd(), 'content', 'news');
const covered = loadCoveredUrls(newsDir);
const dates = existingDigestDates(newsDir);
console.log('covered URLs:', covered.size, '| digest dates:', dates.size);
assert(covered.size > 100 && dates.size > 50);

// A real, already-published URL must be dropped even with tracking params / www / trailing slash.
const known = [...covered][0];
const dupOfKnown: TavilyResult = { title: 'Old story', url: `https://www.${known}/?utm_source=x#frag`, content: 'x'.repeat(400), published_date: new Date().toISOString() };
assert.equal(normalizeUrl(dupOfKnown.url), known);

const body = 'word '.repeat(120);
const now = new Date().toISOString();
const old = new Date(Date.now() - 20 * 86400000).toISOString();
const A: TavilyResult[] = [
  { title: 'OpenAI releases GPT-6 with 2M context window', url: 'https://techcrunch.com/a?utm_campaign=z', content: body, published_date: now, score: 0.9, images: ['https://cdn.x.com/site-logo.png', { url: 'https://cdn.x.com/hero.jpg', description: 'Hero [shot]' }] },
  dupOfKnown,
  { title: 'Stale story from last month', url: 'https://theverge.com/old', content: body, published_date: old, score: 0.95 },
  { title: 'Thin story', url: 'https://wired.com/thin', content: 'short', published_date: now, score: 0.99 },
  { title: 'Rust 2.0 stable released today', url: 'https://blog.rust-lang.org/rust2', content: body, published_date: now, score: 0.7 },
];
const B: TavilyResult[] = [
  { title: 'OpenAI releases GPT-6 with 2M context window', url: 'https://www.techcrunch.com/a/', content: body, published_date: now, score: 0.5 }, // same URL, other topic
  { title: 'OpenAI releases GPT-6 with two million context window!', url: 'https://theverge.com/gpt6-copy', content: body, published_date: now, score: 0.4 }, // near-dup title
  ...['Postgres adds incremental backups', 'Kubernetes drops legacy ingress API', 'Cloudflare outage traced to config push', 'SQLite gains native vector search'].map((t, n) => ({ title: t, url: `https://techcrunch.com/s${n}`, content: body, published_date: now, score: 0.3 })),
];
const picked = selectCandidates([{ topic: 'ai-models', results: A }, { topic: 'infra', results: B }], { covered, days: 2 });
console.log('picked:', picked.map((p) => `${new URL(p.url).hostname} | ${p.topics}`));
assert(!picked.some((p) => /old|thin|gpt6-copy/.test(p.url)), 'stale/thin/near-dup must be dropped');
assert(!picked.some((p) => normalizeUrl(p.url) === known), 'covered URL must be dropped');
assert.equal(picked.filter((p) => p.url.includes('techcrunch.com')).length, 3, 'max 3 per domain');
const gpt = picked.find((p) => p.url.includes('/a'))!;
assert.deepEqual(gpt.topics.sort(), ['ai-models', 'infra'], 'cross-topic hit merged');
assert.equal(pickImage(gpt)?.url, 'https://cdn.x.com/hero.jpg', 'logo skipped');
assert.equal(pickImage(gpt)?.alt, 'Hero shot', 'brackets stripped from alt');

// Messy model output: markdown headings, html, quotes/colons in title+tags, bad indexes, overlong title.
const messy = {
  title: 'OpenAI ships "GPT-6": 2M context, Rust 2.0 lands, and a very long tail of other things',
  description: 'A digest. '.repeat(30),
  keywords: ['GPT-6', 'Rust "2.0"', 'Context: window'],
  intro: 'Two big releases dominate. # not a heading',
  items: picked.map((p, i) => ({
    source: i + 1, headline: i === 0 ? '# **GPT-6** ships <b>with</b> 2M context' : `Story ${i}: headline`, category: i === 1 ? 'Nonsense' : 'AI Models',
    importance: i === 0 ? 5 : i < 3 ? 4 : 1, tldr: `Short fact ${i}.`, summary: '## Sub heading\nPara one.\n\nPara two.',
    keyFacts: ['2M tokens', 'Price: $5/M'], whyItMatters: 'Matters for you.', takeaway: 'Remember this.', caveat: i === 2 ? 'Single-source report.' : '',
  })).concat([{ source: 99, headline: 'ghost', category: 'x', importance: 1, tldr: 't', summary: 's', keyFacts: [], whyItMatters: 'w', takeaway: '', caveat: '' } as never]),
  watch: ['Watch the rollout.'],
};
const digest = parseDigest(messy, picked.length);
assert.equal(digest.items.length, picked.length, 'ghost index dropped');
assert.throws(() => parseDigest({ ...messy, items: messy.items.slice(0, 2) }, picked.length), /covers/);
const r = renderDigest(digest, picked, '2026-10-07', 'Asia/Kolkata');
if (process.env.OUT) console.log(r.file);
const parsed = matter(r.file);
assert.equal(parsed.data.date, '2026-10-07');
assert(String(parsed.data.title).length <= 65 && String(parsed.data.description).length <= 160);
assert.deepEqual(parsed.data.tags, messy.keywords);
assert(!/^#{1,6} (Sub heading|\*\*)/m.test(r.body) && !r.body.includes('<b>'));
assert(!r.file.includes('utm_campaign'), 'tracking params stripped from published links');
assert(/^## TL;DR$/m.test(r.body) && /^## What to watch$/m.test(r.body) && /^## Sources$/m.test(r.body));
if (process.env.OUT) fs.writeFileSync(process.env.OUT, r.file);
assert.equal(fitText('a'.repeat(10), 5).length <= 5, true);
console.log('ALL ASSERTIONS PASSED');
