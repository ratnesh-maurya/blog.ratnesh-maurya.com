---
name: reel-from-post
description: Generate a 3:4 Instagram carousel (2–10 PNG slides at 1080×1440 + caption + alt text + /links entry) for @ratn_labs from content in this repo — a blog post, the daily news digest, a technical term, a TIL, a silly question or a cheatsheet. Each carousel is BESPOKE — Claude reads the source and designs a unique hook, visual metaphor and slide bodies for that topic; only the brand chrome (logo, progress bar, handle, page indicator, swipe arrow, CTA slide, code card) is shared. Light mode to match the website. Use when the user says "make a reel", "make a slider/carousel", "/reel <slug>", "instagram post for <post/term/news>", "post today's news on Instagram", or asks for ratn_labs Instagram content. Output to reels/<slug>/ (gitignored, never commit). The user posts to Instagram manually.
---

# Reel from Post — bespoke @ratn_labs carousels

Turns one piece of repo content into a ready-to-post Instagram carousel:

```
reels/<slug>/
  design.tsx                 ← bespoke slide bodies for THIS topic (you write this)
  01-hook.png … NN-cta.png   ← upload in filename order
  caption.txt                ← Instagram caption
  alt.txt                    ← per-slide alt text (IG: Advanced settings → Write alt text)
  links.json                 ← entry for the /links bio page (Admin → Reels)
  contact-sheet.png          ← all slides tiled, for review
```

The user posts manually. Your job ends when the files are ready and checked.

**Core principle — bespoke bodies, shared chrome.** The kit at
[kit.tsx](kit.tsx) owns what must be identical on every carousel: canvas
(1080×1440, 3:4), fonts (Geist, Source Serif 4 and Geist Mono from
`scripts/og-fonts/`), the `TYPE`/`SPACE`/`RADIUS` scales, the RatnLabs logo
(same construction as the site header), the progress bar, the `@ratn_labs`
handle, `N / total`, the swipe arrow, the "Save for later" chip, the CTA slide,
the `Code` card, and all exports. **Everything inside the frame is designed fresh for
the topic.** If someone could produce the same slides without reading the
source, the design failed.

## Step 1 — Resolve the source

Accept a slug, a URL, or a fuzzy name ("the caching post", "today's news",
"bloom filter"). Glob to find it; if several match, ask.

| Kind | File | Public URL path |
|---|---|---|
| Blog | `content/blog/<slug>.md` or `.mdx` | `/blog/<slug>/` |
| News digest | `content/news/<slug>.md` (latest = newest `date:`) | `/news/<slug>/` |
| Technical term | `content/technical-terms/<slug>.md` | `/technical-terms/<slug>/` |
| TIL | `content/til/<slug>.md` | `/til/<slug>/` |
| Silly question | `content/silly-questions/<slug>.md` | `/silly-questions/<slug>/` |
| Cheatsheet | `content/cheatsheets/<slug>.json` | `/cheatsheets/<slug>/` |

"Today's news" / "latest news" → the news file with the newest `date:`.

Read the **whole body**, not just frontmatter. Capture title, description,
tags, `questions`, H2s, code blocks, numbers, comparisons and any vivid line.

## Step 2 — Pick the playbook for the content kind

Slide count is a range, not a target. Don't pad; don't cut a real idea.

**Blog (6–9 slides)** — teach one idea well.
Hook → the problem/pain → 2–4 insight slides (one idea each, each with a
diagram, code snippet or comparison) → payoff (number, before/after, table) →
rule of thumb / how to apply → CTA.

**News digest (5–8 slides)** — a roundup, not the whole digest.
Pick the **3–5 most important stories** (the digest's "Top story" first, then
the TL;DR order). Hook slide names the day's theme ("Microsoft goes all-in on
agents"), not "Daily news". One slide per story: headline, 1–2 lines of what
happened, a bold "why it matters" line, source name. Optional "Quick hits"
slide for 3–4 one-liners. CTA. Date on the hook slide.

**Technical term (4–6 slides)** — an explainer.
Hook as a question or surprising claim ("Your database can say 'definitely
not' in 1 microsecond") → plain-English definition → how it works (diagram) →
when to use / when not to → one gotcha or trade-off → CTA.

**TIL / silly question (3–5 slides)** — one punchy fix.
Hook (the symptom or question) → the answer/command → why it works → CTA.

**Cheatsheet (5–8 slides)** — the most useful commands, grouped by task,
4–6 commands per slide, each with a short "what it does".

## Step 3 — Analyse before designing (mandatory)

Write this down in your own reasoning before any code:

- **Hook (≤ 8 words).** Clear at a glance beats clever. Imperative, surprising
  number, or a sharp question. Often *not* the post title.
  - "Reorder Go struct fields. Save 152 MB."
  - "Five caching strategies. One question: which?"
  - "Why Write-Back loses your data."
- **One idea per slide** (≤ 14 words of headline each).
- **Visual metaphor** that only fits this topic. Examples:
  caching → hit/miss split, hot/cold layers · pub/sub → fan-out from a hub ·
  rate limiting → token bucket · memory layout → byte grid with hatched
  padding · QR code → finder squares · consensus → nodes + quorum ring ·
  news roundup → stacked "story cards" or a timeline of the day.
- **Accent:** one primary + one contrast from `ACCENTS` (blue, green, purple,
  rose, orange, teal, gold). Defaults: blog → blue, news → rose, term →
  purple, TIL → green, cheatsheet → teal. Twist when the topic asks for it,
  and don't reuse the previous carousel's combination by default.
- **Pattern:** one of `dots | grid | stripes | rings | none`, same on every
  slide of the carousel.

Ask yourself: *why does this design only fit this post?* No answer → redesign.

## Step 4 — Copy rules (Instagram is read on a phone, fast)

- Use the `TYPE` scale: `display` (hook), `h1`/`h2` (headlines), `h3` (card
  titles), `body`, `small`, `label`. Nothing smaller than `TYPE.label`.
  Use `RADIUS` and `SPACE` for corners and gaps.
- Max **~40 words per slide**. If it needs more, it's two slides.
- Use `fit(text, { width, maxLines, max })` from the kit for any text whose
  length you don't control (titles, news headlines, term names).
- Bold the one phrase per slide that carries the idea, in the accent colour.
- Facts only from the source. Never invent numbers, versions or quotes. For
  news, keep the source outlet's name on each story slide.
- No emoji walls; at most one emoji per slide, and only if it adds meaning.

## Step 5 — Write `reels/<slug>/design.tsx`

```tsx
import React from 'react';
import { ACCENTS, Code, CtaSlide, FONT, Frame, RADIUS, T, TYPE, fit, postUrl, renderCarousel, type Slide } from '../../.claude/skills/reel-from-post/kit';

const A = ACCENTS.purple;
const URL = postUrl('technical-terms', 'bloom-filter');
const TOTAL = 5;

// Bespoke slide bodies — designed for THIS topic only.
function Hook() {
  return (
    <Frame n={1} total={TOTAL} accent={A} pattern="dots" kicker="Technical term">
      {/* … */}
    </Frame>
  );
}
// … one component per slide …

const slides: Slide[] = [
  { label: 'hook', alt: 'What the slide says and shows, for screen readers.', el: <Hook /> },
  // …
  { label: 'cta', alt: '…', el: <CtaSlide total={TOTAL} accent={A} url={URL} line="One sentence that fits this topic." /> },
];

renderCarousel(slides, {
  caption: `…`,              // Step 7
  links: {
    slug: 'bloom-filter',
    title: 'Bloom filter, explained in 5 slides',
    description: 'One or two sentences for the /links card.',
    links: [{ label: 'Full explanation', url: URL }],
  },
}).catch((e) => { console.error(e); process.exit(1); });
```

`Frame` gives you the header, footer, padding and pattern; put only the body
inside it. The body is vertically centred by default (`valign="center"`); use
`"top"` for tall content or `"spread"` to pin a closing line to the bottom.
Fill the frame — a slide with a dead bottom third reads as unfinished. Keep
`TOTAL` equal to `slides.length`. The last slide is always `CtaSlide`.

- **`save`** on `Frame` adds a "Save for later" chip. Put it on the single
  most reference-worthy slide (usually the second-to-last). Saves weigh
  heavily on Instagram.
- **`Code`** renders a snippet in Geist Mono with light highlighting:
  `<Code code={snippet} accent={A} title="file.py" highlight={[3, 7]} />`.
  At the default 30 px it fits ~46 characters per line; drop `fontSize` to 28
  for ~50. Keep it ≤ 14 lines. If you shorten the source's code to fit, say
  so in the title (e.g. `"bloom.py (simplified)"`) and keep the logic the same.
- **`alt`** is required on every slide; `renderCarousel` refuses to run
  without it. Describe what the slide says and shows in 1–3 sentences.

**Satori rules (break these and rendering fails or looks wrong):**
1. Every `<div>` with more than one child needs `display: 'flex'` (or `'none'`).
   Default every div to `display: 'flex'`.
2. Literal text + a JSX expression in one div = multiple children. Use one
   template string: `{`${n} requests/s`}` not `{n} requests/s`.
3. No `<text>` inside `<svg>` — put labels in absolutely-positioned divs over
   the SVG. `<rect> <path> <circle> <line> <polygon>` are fine.
4. No external images, fonts or URLs. Inline SVG and divs only. The logo is
   already in the kit.
5. Code goes in the kit's `Code` card (`FONT.mono` is Geist Mono). For short
   inline identifiers use `fontFamily: FONT.mono` on the div.
6. **Budget widths.** The body is 936 px wide (1080 − 2×72); every card
   padding and border comes off that. For a fixed row of N items, check
   `N × (itemWidth + gap) ≤ available width` before picking sizes — Satori
   doesn't wrap or shrink them, it overflows.
7. Two differently coloured words side by side need two divs, and Satori
   spaces them ~0.1em further apart than one word — pull the second back with
   a small negative `marginLeft` if they must read as one word.
8. Gradients must fade to a real colour (`T.bg`, `accent.a50`), never
   `transparent` — Satori fades through transparent black, which renders grey.
9. `gap`, `flex`, `position: 'absolute'`, `borderRadius`, `boxShadow`,
   gradients and `backgroundImage` all work. CSS grid does not — use flex rows.

## Step 6 — Render

```bash
npx tsx reels/<slug>/design.tsx
```

On a Satori error, read the message (it names the element), fix that element,
re-run. Don't retry blindly.

## Step 7 — Caption (`caption`, ≤ 2,200 chars, aim < 900)

```
{hook line — punchier than the post title}

{2–3 short lines of value written for IG, conversational, no jargon walls}

{one line: what they'll get by swiping / from the full post}

🔗 Full breakdown: blog.ratnesh-maurya.com/<kind>/<slug>/
(link in bio → @ratn_labs)

#ratnlabs #tag2 #tag3 …
```

- **Always include the full post URL** exactly as `blog.ratnesh-maurya.com/<kind>/<slug>/`.
- 8–15 hashtags: `#ratnlabs` always, slugified post tags, then 3–5 niche
  staples that fit (`#systemdesign #backend #softwareengineering #devtools
  #databases #golang #distributedsystems #ainews #llm`).
- `renderCarousel` refuses to run if the caption is over 2,200 characters or
  any slide lacks alt text.

## Step 8 — Visual QA (mandatory)

Open `reels/<slug>/contact-sheet.png` with the Read tool and look at it. Then
open any slide that looks off at full size. Check:

- No text clipped, overflowing its card, or colliding with the footer.
- Hook readable at thumbnail size (contact sheet scale ≈ IG grid).
- Every slide except the last has the → arrow; every slide has the progress
  bar, `@ratn_labs` and `N / total`.
- Code cards: no line runs past the card edge.
- Visual variety — not the same layout with swapped text.
- Facts match the source.

Fix and re-render until it passes. This step is not optional.

## Step 9 — Report

Tell the user, briefly:
- Folder path and slide count.
- Upload the PNGs in filename order, paste `caption.txt`, add alt text from
  `alt.txt` (Advanced settings).
- After posting: in **Admin → Reels** (`/admin/reels/`) add the `links.json`
  entry with the Instagram post URL. The thumbnail is pulled from the post
  automatically; upload `01-hook.png` only if that fails.

Don't paste the design code or full caption into chat unless asked.

## Hard rules

- **Carousel, 3:4, 1080×1440, 2–10 slides.** No 9:16, no single-image posts.
- **Light backgrounds only**, matching the site. No dark carousels.
- **Bespoke bodies every time.** Never copy a previous carousel's slide components.
- **First slide = clear hook. Last slide = `CtaSlide`.**
- **Never edit `kit.tsx` to fit one carousel.** Change it only for a brand-wide decision.
- **Never `git add reels/`** — it's gitignored. Never push it.
- **Never post on the user's behalf.** Produce files; the user posts.
- **Never skip Step 3 or Step 8.**
