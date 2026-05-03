---
name: reel-from-post
description: Generate a 3:4 Instagram carousel slider (5–10 PNG slides + caption) for a post in this blog repo. Each carousel is BESPOKE — Claude reads the post and designs unique visuals, hook, copy, and accent palette tailored to that specific topic. Light-mode by default to match the website. Never templated, never repeated. Use when user says "make a reel", "make a slider", "carousel for <post>", "/reel <slug>", "instagram from this post", or asks for ratn_labs IG content. Output to `reels/<slug>/` (gitignored, never commit). Site is blog.ratnesh-maurya.com, IG handle @ratn_labs, brand mark "RATN LABS".
---

# Reel from Post — Bespoke 3:4 IG Carousel Generator

Generate a 1080×1350 Instagram carousel asset bundle from a blog/news/TIL/cheatsheet post in `content/`. Output is **5–10 PNG slides** + caption.

**Format is carousel, not video.** No 9:16 single-reel mode. Always slides at 3:4.

**Core principle: every carousel is uniquely designed for its topic.** No reusable template. The hook copy, visual metaphor, layout structure, accent twist, and caption voice all come from reading and thinking about THIS specific post. If a future Claude could generate the same carousel without reading the post, the design failed.

## Inputs

- `/reel <slug>` (kept for muscle memory; produces a carousel, not a reel)
- `/reel <full-url>`
- "make a slider for the SNS post"
- "carousel from the caching post"

If user gives a fuzzy name, glob `content/**/*.md*` to disambiguate. Confirm if multiple matches.

## Step 1 — Resolve & read

Sections live at:
- `content/blog/<slug>.md|.mdx`
- `content/news/<slug>.md|.mdx`
- `content/til/<slug>.md|.mdx`
- `content/cheatsheets/<slug>.md|.mdx`

Read the file. Parse frontmatter (`gray-matter`) AND the markdown body. The body is essential — frontmatter alone is too thin to design from.

Capture: `title`, `description`, `tags`, `questions[]`, `image`, `category`, plus body H2s and any code blocks, diagrams, or vivid sentences worth amplifying.

## Step 2 — Analyze (mandatory; do not skip)

Before writing any code, write yourself a short analysis (in your own thinking, not a file):

- **Hook (1 line, ≤8 words):** Slide-1 title. Must be **clear and understandable** at a glance — not clever-but-confusing. Often imperative or surprising. Examples:
  - "Reorder Go fields. Save 152MB."
  - "Five caching strategies. One question: which?"
  - "Why Write-Back loses your data."
- **Insights (3–7, each ≤14 words):** One per slide. Pull from frontmatter `questions` if punchy, otherwise from H2s or sharp body sentences. Each insight stands alone visually.
- **Visual metaphor (this is the bespoke part):** What single image/diagram captures THIS topic? Examples:
  - Caching → cache layers, hit/miss split, hot/cold
  - Distributed system → nodes + edges, ring topology
  - SNS / pub-sub → fan-out arrows from a hub
  - Rate limiting → token bucket, dripping faucet
  - Go release → version timeline, milestone ticks
  - QR code → matrix grid with finder squares
  - Schema migration → before/after split
  - Memory layout → byte grid (one row = one word) with hatched padding cells
  Inline SVG/divs only. Specificity > polish.
- **Accent twist:** Pick one primary accent + one contrast accent (problem/warning) from the brand palette below. Don't keep last carousel's twist by default.

If you cannot answer "why does this design only fit this post?" — redesign.

## Step 3 — Brand palette (anchored to website tokens)

Site is **light-mode** ("Liquid Glass" but on a warm cream/white base). Match the website. Pull tokens from `src/app/globals.css`.

**Backgrounds (always light):**
- Page bg: `#FAFAF8` (neutral-50) or `#FFFFFF` (surface) — never dark
- Soft tint variant: `color-mix(accent-50 32%, #FFFFFF)` ≈ `#F5F8FC` for a tinted hero slide
- Surface card: `#FFFFFF` with `1px solid #E4E4DF` and shadow `0 4px 8px -2px rgb(28 28 26 / 0.08)`

**Foreground / text:**
- Primary text: `#1C1C1A`
- Secondary: `#545450`
- Muted: `#6A6A64` (AA-passing)

**Brand accents (pick to fit topic):**
| Accent | hex | use for |
|---|---|---|
| Blue 500 (primary) | `#0066CC` | default accent, blog/system-design topics |
| Blue 400 | `#33A3FF` | secondary highlights, light fills |
| Blue 700 | `#003D73` | high-contrast text on cream |
| Gold 400 | `#D4A020` | warnings, cautions, "silly questions" energy |
| Coral 400 | `#D442B0` | playful, contrast pop |
| Success | `#059669` | wins, "do this" callouts |
| Warning | `#D97706` | watch-out callouts |
| Error | `#DC2626` | "bad", waste, anti-pattern callouts |

**Section default accents** (anchor, not constraint — twist if topic demands):
| Section | primary | contrast |
|---|---|---|
| blog | `#0066CC` | `#DC2626` (problem) |
| news | `#DC2626` | `#1C1C1A` |
| til  | `#059669` | `#0066CC` |
| cheatsheets | `#0066CC` | `#D4A020` |

**Background patterns (subtle, ≤8% opacity):** dots, square grid, diagonal stripes, circuit lines, waves. Pick one per carousel and stay consistent across slides. Use `repeating-linear-gradient` or `radial-gradient` — no external assets.

## Step 4 — Slide plan (5–10 slides)

| # | Beat | Job |
|---|---|---|
| 1 | **Hook** | Stop the scroll. Big clear title (the bespoke hook). Bespoke metaphor seed. |
| 2 | Setup / problem | Frame the question or pain. |
| 3 | Insight 1 | First key idea + small diagram/code. |
| 4 | Insight 2 | Second idea / contrast. |
| 5 | Insight 3 | (Optional) Third idea. |
| 6 | Numbers / payoff | Scale data, comparison table, or surprising metric. |
| 7 | How / tool | The actionable bit (command, snippet, rule of thumb). |
| N | **CTA (last)** | **Generic** — "Read more at blog.ratnesh-maurya.com" + `@ratn_labs` + RATN LABS wordmark. Include post URL too if the slug fits cleanly. |

Slide count is **5–10**, picked to fit content. Don't pad. Don't trim hard ideas just to hit a count.

**Required on every slide:**
- 1080×1350 (4:5)
- RATN LABS logo + wordmark (top-left). The logo file lives at `public/apple-touch-icon.png` (blue rounded square with white "R" + brutalist black shadow). Embed it as a base64 data URL — Satori only loads remote images if explicitly fetched, so inline is the reliable path:

  ```ts
  const LOGO_PATH = path.resolve(__dirname, '../../public/apple-touch-icon.png');
  const LOGO_B64 = fs.readFileSync(LOGO_PATH).toString('base64');
  const LOGO = `data:image/png;base64,${LOGO_B64}`;
  // <img src={LOGO} width={48} height={48} style={{ borderRadius: 10 }} />
  ```
  Use ~48px in headers, ~160px on the CTA slide.
- Page indicator `N / total` (small, footer-ish)
- **Swipe-next arrow `→` bottom-right on every slide except the last.** The last slide replaces the arrow with the CTA URL.

Carousel must visually vary — don't reuse one layout for every slide with text swapped.

## Step 5 — Write `reels/<slug>/design.tsx`

Self-contained file. Imports `@vercel/og` directly (already in repo deps). Defines bespoke React slide components for THIS post. Has a `main()` that renders each to PNG.

**Hard Satori rules — failure to follow these causes render errors:**

1. Every `<div>` with more than one child node MUST have explicit `display: 'flex'` (or `'block'`/`'contents'`/`'none'`). Default to `display: 'flex'`.
2. Mixing literal text + a JSX expression inside a div counts as multiple children. Combine into one template string:
   - ✗ `<div>OF {total}</div>`
   - ✓ `<div>{`OF ${total}`}</div>`
3. **No `<text>` element inside SVG.** Satori errors with `<text> nodes are not currently supported, please convert them to <path>`. If you need text inside a graphic, render it as a positioned `<div>` overlay, not as SVG text.
4. No external image URLs unless verified to resolve. Use inline SVG and div-based shapes.
5. No external font loading. System fallback only (`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`; mono `ui-monospace, "SF Mono", Menlo, Consolas, monospace`).
6. `<svg>` is fine for non-text shapes (rect, path, circle, line). Stick to those.

Skeleton (adapt heavily, do NOT copy as a template — bespoke slide bodies are the whole point):

```tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { ImageResponse } from '@vercel/og';

const W = 1080, H = 1440;  // 3:4 carousel slide
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// brand tokens (mirror globals.css)
const BG       = '#FAFAF8';
const SURFACE  = '#FFFFFF';
const TEXT     = '#1C1C1A';
const TEXT_2   = '#545450';
const MUTED    = '#6A6A64';
const BORDER   = '#E4E4DF';
const ACCENT   = '#0066CC';
const ACCENT_2 = '#003D73';

// ─── Slides designed specifically for THIS post ─────────────────────────
function HookSlide()    { /* big title + metaphor seed */ }
function Slide2()       { /* ... */ }
// ... 3–8 more
function CtaSlide()     { /* generic: blog.ratnesh-maurya.com + @ratn_labs */ }

async function render(name: string, el: React.ReactElement) {
  const res = new ImageResponse(el, { width: W, height: H });
  const buf = await res.arrayBuffer();
  fs.writeFileSync(path.join(__dirname, name), Buffer.from(buf));
  process.stdout.write('.');
}

async function main() {
  await render('slide-1-hook.png', <HookSlide />);
  // ...
  await render('slide-N-cta.png',  <CtaSlide />);
  console.log(`\n✓ slides written to ${__dirname}`);
}

main().catch(e => { console.error(e); process.exit(1); });
```

File naming: `slide-<n>-<short-label>.png` (e.g. `slide-1-hook.png`, `slide-7-cta.png`).

## Step 6 — Run it

```bash
npx tsx reels/<slug>/design.tsx
```

If Satori errors:
- Read the error message — it usually names the offending element.
- Fix the specific div (add `display: 'flex'`, combine multi-child text+expr, replace `<text>` with overlay div).
- Re-run.
- Don't loop blindly. Diagnose.

## Step 7 — Caption (`reels/<slug>/caption.txt`)

Bespoke voice, not fill-in-the-blank. Structure:

```
{punchier hook line — often different from the post title}

{1–2 sentences of value, written for IG audience, not formal}

→ Full breakdown: https://blog.ratnesh-maurya.com/<kind>/<slug>
→ Read more: link in bio

#tag1 #tag2 #ratnlabs #systemdesign #backend #softwareengineering
```

Hashtags: slugify post `tags` (lowercase, no spaces), then add niche staples (`#ratnlabs` always; rotate among `#systemdesign #backend #devtools #databases #golang` etc. based on topic). 8–15 hashtags total.

## Step 8 — Report to user

Print a tight summary:
- Output dir
- Slides produced (count + filenames)
- Caption file
- One-line `open reels/<slug>/` hint

Do not paste the full caption or design code into chat unless asked.

## Hard rules

- **Carousel only.** 3:4, 5–10 slides. No 9:16 single-image reels.
- **Light backgrounds always.** Cream/white + subtle pattern. Match the website. No dark-mode carousels.
- **Bespoke every time.** If you find yourself copying a previous carousel's slide component, stop and redesign.
- **First slide = clear understandable hook title.** Never cryptic.
- **Last slide = generic CTA** to `blog.ratnesh-maurya.com` + `@ratn_labs` + RATN LABS wordmark. Reusable across posts.
- **Swipe arrow `→` on every slide except the last.** Page indicator `N / total` on every slide.
- **Never `git add reels/`.** It is gitignored. Never push.
- **Never fetch external images/fonts/APIs.** Inline SVG/divs only.
- **Never reuse last invocation's accent twist or pattern** as a default.
- **Never skip Step 2.** The analysis IS the bespokeness.
- **One design file per slug.** Path: `reels/<slug>/design.tsx`. Overwrite freely on re-runs.
