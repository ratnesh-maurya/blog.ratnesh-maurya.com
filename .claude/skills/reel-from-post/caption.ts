/**
 * Instagram caption linter for the reel kit.
 *
 * Ported to TypeScript from `skills/ig-caption/caption.py` in
 * https://github.com/Jakeschincariol/instagram-agent-skill
 * Copyright (c) Jake Schincariol, MIT License.
 *
 * Differences from the original, both because of how /links works:
 *  - a link to our own blog is allowed in the caption: the admin's Quick add
 *    reads it to fill in the related links (other links still warn);
 *  - "link in bio" is our standard pointer to /links, so it is not counted as
 *    a second call to action.
 */

export const CAPTION_LIMIT = 2200;
/** Roughly where the feed cuts to "… more". The real cut moves with the device. */
export const FEED_CUT = 125;
/** Instagram's cap per post or reel since 18 Dec 2025 (down from 30). */
export const HASHTAG_LIMIT = 5;

const HASHTAG_RE = /(?:^|\s)(#[A-Za-z0-9_]+)/g;
const LINK_RE = /https?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:com|co|io|net|org|ai|app|dev)\/\S*/gi;
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}☀-➿←-⇿️]/gu;
const CONCRETE_RE = /\$\s?\d|\b\d[\d,.]*\b|(?<!^)\b[A-Z][a-z]{2,}\b/gm;
const OWN_HOST = 'blog.ratnesh-maurya.com';

const ASKS: Array<[RegExp, string]> = [
  [/\bcomment (?:the word |")?[A-Z0-9]{2,}\b/i, 'comment a keyword'],
  [/\b(?:dm|message) me\b/i, 'DM me'],
  [/\bsave (?:this|it)\b/i, 'save this'],
  [/\bshare (?:this|it)\b/i, 'share this'],
  [/\bfollow (?:me|for)\b/i, 'follow'],
  [/\b(?:swipe|tap) (?:through|left|right|for|to)\b/i, 'swipe or tap'],
  [/\btell me\b|\bwhat would you\b|\bwhich one\b/i, 'answer a question'],
];

const FILLER_TAGS = new Set([
  '#viral', '#fyp', '#explore', '#explorepage', '#foryou', '#foryoupage', '#trending',
  '#instagood', '#love', '#follow', '#like4like', '#reels', '#reelsinstagram', '#viralreels', '#instadaily',
]);

export type CheckStatus = 'PASS' | 'WARN' | 'FAIL';
export interface Check {
  name: string;
  status: CheckStatus;
  detail: string;
}
export interface CaptionReport {
  chars: number;
  visible: string;
  truncated: boolean;
  hashtags: string[];
  asks: string[];
  checks: Check[];
  verdict: 'READY' | 'REVIEW' | 'FIX';
}

const matches = (re: RegExp, s: string) => Array.from(s.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)));

export function lintCaption(caption: string, searchTerms: string[] = []): CaptionReport {
  const text = caption.trim();
  const chars = text.length;
  const firstLine = (text.split('\n')[0] ?? '').trim();
  const tags = matches(HASHTAG_RE, text).map((m) => m[1]);
  // Our own host is blanked first: the pattern would otherwise read "ratnesh-maurya.com/…" out of a blog URL as a separate link.
  const links = matches(LINK_RE, text.split(OWN_HOST).join('')).map((m) => m[0]);
  const emoji = matches(EMOJI_RE, text);
  const visible = chars <= FEED_CUT ? text : text.slice(0, FEED_CUT);
  const truncated = chars > FEED_CUT;
  const asks = ASKS.filter(([re]) => re.test(text)).map(([, name]) => name);
  const filler = tags.filter((t) => FILLER_TAGS.has(t.toLowerCase()));
  const checks: Check[] = [];
  const add = (name: string, status: CheckStatus, detail: string) => checks.push({ name, status, detail });

  add('LENGTH', chars > CAPTION_LIMIT ? 'FAIL' : 'PASS', `${chars} / ${CAPTION_LIMIT} characters`);

  if (!firstLine) add('FIRST LINE', 'FAIL', 'the caption opens on a blank line');
  else if (/^[#@]/.test(firstLine)) add('FIRST LINE', 'FAIL', 'opens on a hashtag or a mention; the first line is the hook');
  else if (firstLine.length > FEED_CUT) add('FIRST LINE', 'WARN', `${firstLine.length} characters, so the feed cuts it at ${FEED_CUT} mid-thought`);
  else add('FIRST LINE', 'PASS', `${firstLine.length} characters, lands whole`);

  const concrete = matches(CONCRETE_RE, visible).length;
  add('HOOK IS CONCRETE', concrete > 0 ? 'PASS' : 'WARN', concrete > 0 ? `${concrete} number(s) or name(s) before the "more" tap` : 'nothing checkable before the "more" tap');

  if (tags.length > HASHTAG_LIMIT) add('HASHTAGS', 'FAIL', `${tags.length} tags, over Instagram's cap of ${HASHTAG_LIMIT}. Keep #ratnlabs plus the ${HASHTAG_LIMIT - 1} most specific topics`);
  else if (filler.length) add('HASHTAGS', 'WARN', `${filler.length} generic tag(s) (${filler.slice(0, 3).join(', ')}) describe nothing`);
  else add('HASHTAGS', 'PASS', `${tags.length} tag(s)`);

  const tagInWindow = tags.some((t) => new RegExp(`(?:^|\\s)${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(visible));
  add('TAG PLACEMENT', tagInWindow ? 'WARN' : 'PASS', tagInWindow ? 'a hashtag sits inside the visible window and wastes feed space' : 'tags are below the fold');

  add('LINKS', links.length ? 'WARN' : 'PASS', links.length ? `${links.length} link(s) other than our blog: captions are not clickable` : 'no dead links (our blog URL is kept for Quick add)');

  if (asks.length === 1) add('ONE ASK', 'PASS', `one call to action: ${asks[0]}`);
  else if (asks.length === 0) add('ONE ASK', 'WARN', 'no call to action; a carousel should ask for a save');
  else add('ONE ASK', 'WARN', `${asks.length} asks (${asks.join(', ')}). Two asks is the same as none`);

  const density = (emoji.length * 100) / Math.max(chars, 1);
  add('EMOJI', density > 4 ? 'WARN' : 'PASS', `${emoji.length} emoji, ${density.toFixed(1)} per 100 characters`);

  const terms = searchTerms.map((t) => t.trim()).filter(Boolean);
  if (terms.length) {
    const low = text.toLowerCase();
    const missing = terms.filter((t) => !low.includes(t.toLowerCase()));
    add('SEARCH TERMS', missing.length === 0 ? 'PASS' : missing.length === terms.length ? 'FAIL' : 'WARN', `${terms.length - missing.length}/${terms.length} present${missing.length ? `. Missing: ${missing.join(', ')}` : ''}`);
  }

  const fails = checks.filter((c) => c.status === 'FAIL').length;
  const warns = checks.filter((c) => c.status === 'WARN').length;
  return { chars, visible, truncated, hashtags: tags, asks, checks, verdict: fails ? 'FIX' : warns ? 'REVIEW' : 'READY' };
}

/** The window the feed shows before "… more", drawn as a box, followed by the checks. */
export function formatReport(r: CaptionReport): string {
  const width = 52;
  const wrapped: string[] = [];
  for (const para of r.visible.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      if ((line + ' ' + word).trim().length > width) {
        wrapped.push(line);
        line = word;
      } else line = (line + ' ' + word).trim();
    }
    wrapped.push(line);
  }
  const box = [
    '  WHAT THE FEED SHOWS',
    `  +${'-'.repeat(width + 2)}+`,
    ...wrapped.map((l) => `  | ${l.padEnd(width)} |`),
    r.truncated ? `  +${'-'.repeat(width - 8)} ... more +` : `  +${'-'.repeat(width + 2)}+`,
  ];
  const checks = r.checks.filter((c) => c.status !== 'PASS').map((c) => `  ${c.status.padEnd(4)}  ${c.name.padEnd(16)} ${c.detail}`);
  return [...box, ...(checks.length ? checks : ['  all checks pass']), `  VERDICT  ${r.verdict}`].join('\n');
}
