# SCON Design Critic + SEO Fix Plan — blog.ratnesh-maurya.com

**Reviewer:** Senior Design + SEO Critic
**Date:** 2026-05-03
**Subject:** Ratn Labs — `https://blog.ratnesh-maurya.com`
**Method:** SCON — **S**trength · **C**oncern · **O**bservation · **N**ext-step
**Goal:** rank #1 for `Ratnesh Maurya`, `Ratn Labs`, primary tech-blog queries; achieve pixel-perfect metadata; meet Core Web Vitals 2026 thresholds.

---

## 0. TL;DR

Site already strong: Next.js 15.5, App Router, real OG pipeline, JSON-LD `@graph`, RSS, llms.txt, sitemap, 14+ static surfaces, glass design system. Most fixes are **finishing moves**, not rebuilds.

Top 5 levers, ranked by ROI:
1. **Entity SEO for "Ratnesh Maurya"** — unify Person `@id`, harden `sameAs` graph, inline FAQ + AboutPage on `/about`, link-build from portfolio + GitHub README + LinkedIn.
2. **Article schema completeness** — `dateModified` ≠ `datePublished` (currently same), `wordCount`, `articleBody`, real `Person` author with `sameAs`, `mainEntityOfPage`.
3. **Core Web Vitals 2026** — INP < 200 ms (audit `backdrop-filter` cost), LCP < 2.5 s (preload hero font + OG hero image), CLS < 0.1 (reserve image height in cards).
4. **Metadata pixel-perfect** — title 50–60 char, description 140–155 char, canonical hygiene, no double-trailing-slash drift, per-route OG.
5. **Design system tightening** — typographic rhythm, focus rings, density on listing pages, dark-mode glass contrast, accessibility AA.

---

## 1. Design Critic — by surface

### 1.1 Global (header, footer, nav)

| | |
|---|---|
| **S** | Glass material with `backdrop-filter: blur(16px) saturate(160%)` is on-brand 2026; warm neutral ramp is restrained; accent palette is swappable (`data-accent`) — rare and lovely. |
| **C** | Header at 272 lines suggests over-componentization. Glass on glass on scroll can drop INP on low-end Android. Footer derives bg from `--accent-900` — on `purple` accent (`#2E1065`) this gets near-black; on `green` it's nearly invisible — tonal regression. |
| **O** | Theme script is inlined synchronously — good (no FOUC). But it sets `data-theme=light` default; users with `prefers-color-scheme: dark` see flash of light theme then no auto-switch. |
| **N** | (a) Default theme = `prefers-color-scheme` not hard `light`. (b) Add `font-display: swap` already present — also `<link rel="preload" as="font">` for primary serif on article pages. (c) Audit footer contrast across all five accent palettes; lock footer bg to a fixed token, not derived. |

### 1.2 Home (`/`)

| | |
|---|---|
| **S** | Magazine layout (`hasMagazineLayout`) when ≥3 featured — strong editorial signal. FAQ section feeds FAQPage schema. Explore items emoji + descriptors give scan-ability. |
| **C** | 573-line `page.tsx` is doing too much. Hero "Practical engineering for real-world systems" is generic — missing the **personal brand**: "by Ratnesh Maurya, backend engineer at Initializ." That single name in H1/sub-hero is the cheapest entity-SEO win available. |
| **O** | Stat strip ("13 Posts · 69 Terms · 36 News") is honest but reads thin against competitors (Stripe, Vercel blog, Lilian Weng). |
| **N** | (a) Add visible **author byline** in hero (linked to `/about`). (b) Add `Person` photo above-the-fold to satisfy Google's "About this author" snippet. (c) Render featured post `<h2>` with `dateline` and `reading-time` for richer SERP. |

### 1.3 Listing pages (`/blog`, `/news`, `/til`, `/silly-questions`)

| | |
|---|---|
| **S** | Distinct color tokens (`--coral-*` for Silly Questions, `--gold-*`) signal section without re-skinning. |
| **C** | Card density low on desktop ≥ 1280 px — wasted screen real estate; users have to scroll to feel content depth. No filter chips; tag pages exist (`/blog/tag/...`) but not surfaced as chips on the listing. |
| **O** | Image fields use `getStoredOgImageUrl()` per slug — great for share previews, but a 1200×630 thumbnail at 320×180 is 14× oversized. |
| **N** | (a) Switch listing thumbs to a 600×315 variant via `next/image` `sizes`. (b) Tag chip row above grid. (c) Min 3 columns ≥ lg breakpoint, 2 col md. |

### 1.4 Article (`/blog/[slug]`)

| | |
|---|---|
| **S** | Clean reading column, TOC, reading progress, copy-as-MD button, related posts, related terms, social share, post navigation, view counter, oEmbed alt link. This is **publisher-grade**. |
| **C** | (1) `publishedTime` and `modifiedTime` are identical — Google distrusts this. (2) Author URL is `https://ratnesh-maurya.com` (good) but `Person` `@id` is not URI-stable across pages, breaking entity de-dup. (3) Code highlight uses `github-dark-dimmed` even in light theme — strong contrast clash. |
| **O** | Word count, `articleBody`, `headline` ≤ 110 chars not asserted in schema. Pinterest rich pin meta tag is set but no `pinterest-domain-verify` — half-configured. |
| **N** | (a) Track real `lastModified` from frontmatter `updated:` field; fallback to `date` only if missing. (b) Light-theme code block: switch to `github-light` via `prefers-color-scheme`. (c) Add `wordCount`, `articleBody` (truncated 2k chars), enforce `headline.length <= 110`. (d) Stable Person `@id`: `https://ratnesh-maurya.com/#person`. |

### 1.5 Typography & rhythm

- Three font families loaded (Geist, Geist Mono, Source Serif 4 with 4 weights/styles). That's 6 font payloads. `font-display: swap` is fine but **subset to `latin`** (already done) + drop italic 700 unless used.
- Body line-height not asserted in tokens. Locking `--leading-prose: 1.75` and `--measure: 70ch` will lift readability scores.

### 1.6 Accessibility

- Confirm `:focus-visible` rings on all interactive glass elements (glass kills default focus rings — common 2026 regression).
- Skip-to-content link missing in default head/body output (verify in `AppWrapper`).
- Color contrast: `--text-muted: #8E8E88` on `--background` near-white = ~3.7:1 → **fails WCAG AA** for body text. Bump to `#6A6A64` (`--neutral-600`) for body-rank muted.

---

## 2. SEO Audit — what's good, what's missing

### 2.1 Already strong
- Canonical per page, `metadataBase`, OG + Twitter complete.
- `robots.ts` allow-lists AI crawlers (GEO-correct for 2026).
- JSON-LD `@graph` with Organization + Person + WebSite + SearchAction + ReadAction.
- Article-level BlogPosting + Breadcrumb.
- Sitemap with images, change-freq, priority, news-index.
- llms.txt, llms-full.txt, ai.txt, oEmbed alternates — top decile.
- RSS at `/feed.xml`, Atom-style.
- `next/font` with swap; static export.

### 2.2 Gaps / fixes (sorted by SERP impact)

| # | Item | Where | Fix |
|---|------|-------|-----|
| 1 | `dateModified` always equals `datePublished` | `src/app/blog/[slug]/page.tsx:74,84` | Add `updated` field to MDX frontmatter; fall back if absent. |
| 2 | Person `@id` not stable across pages | `StructuredData.tsx` (15 `sameAs` blocks) | Single `Person` node with `@id: https://ratnesh-maurya.com/#person`, referenced everywhere. |
| 3 | No `mainEntityOfPage` on articles | `BlogStructuredData` | Add `mainEntityOfPage: { @type: WebPage, @id: <article-canonical> }`. |
| 4 | Title length not enforced | All `generateMetadata` | Truncate/template guard at 60 chars. Currently default + template = `Post Title | Ratn Labs` can exceed. |
| 5 | Description length not enforced | Same | Soft target 140–155 chars; lint script. |
| 6 | Trailing slash drift | `next.config.ts` + middleware | Audit canonical = `/blog/slug/` (with `/`) but internal links use `/blog/slug`. Pick one and 301. |
| 7 | No author page schema for `/about` | `src/app/about/page.tsx` | Emit `AboutPage` + `Person` + `ProfilePage` with `mainEntity` = Ratnesh. |
| 8 | No `BreadcrumbList` on listing pages other than home | `/blog`, `/news`, `/til` | Add 2-step breadcrumbs. |
| 9 | No HowTo schema on cheatsheets | `/cheatsheets/*` | Each cheatsheet → `HowTo` or `TechArticle`. |
| 10 | No DefinedTerm on glossary / technical-terms | `/technical-terms/*` | `DefinedTerm` + `DefinedTermSet` for the glossary index. |
| 11 | No video/audio assets but `max-video-preview: -1` set | global | Harmless, leave. |
| 12 | `pinterest-rich-pin` set but unverified | `BlogPost meta` | Either claim domain in Pinterest or remove tag. |
| 13 | `verification.google` only via env var | `layout.tsx:124` | Confirm prod env has `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`; add Bing, Yandex, IndexNow. |
| 14 | No IndexNow ping | infra | Add IndexNow API key + ping on `revalidate`. |
| 15 | No `lastmod` precision in sitemap for static pages | `sitemap.ts:65–84` | Use git-derived mtime, not `now`. Google ignores `now`-on-every-build. |
| 16 | Missing `news_sitemap` for `/news/*` | `sitemap.ts` | Split out a Google News-format sitemap (`<news:news>`) for entries < 48 h. |
| 17 | No `hreflang` (single locale) | global | Add `<link rel="alternate" hreflang="x-default">` to be explicit. |
| 18 | `keywords` field present | layout.tsx, page.tsx | Google ignores `<meta keywords>`. Harmless, but trim to reduce noise. |
| 19 | No `Article.speakable` on article pages (only WebSite) | `BlogStructuredData` | Add `speakable: { @type: SpeakableSpecification, cssSelector: ['h1', '.article-summary'] }`. |
| 20 | No `Comment` / `InteractionCounter` on articles | same | Already partially present; expose view counts via `InteractionCounter` correctly. |

---

## 3. Pixel-perfect metadata spec (target)

For every route, enforce:

```
title:             50–60 chars (Primary Keyword + Value Prop + Brand)
description:       140–155 chars (Primary KW within first 90 chars)
canonical:         absolute, single trailing slash
og:image:          1200×630 PNG, < 300 KB, alt = page title
twitter:card:      summary_large_image
twitter:image:     same as og:image
robots:            index,follow + max-image-preview=large
schema (article):  BlogPosting + Person + Organization + Breadcrumb + mainEntityOfPage
schema (home):     WebSite + Organization + Person + FAQPage
```

### Title templates (pick one per surface)

| Surface | Template | Example (≤60) |
|---|---|---|
| Home | `{Brand} — {Niche} by {Author}` | `Ratn Labs — Backend & AI Engineering by Ratnesh Maurya` (54) |
| Blog index | `Blog · {Niche} · {Brand}` | `Blog · Backend, Distributed Systems, AI · Ratn Labs` (50) |
| Article | `{Title} — {Brand}` | `{post.title} — Ratn Labs` (cap title at 38) |
| Tag | `{Tag} articles · {Brand}` | `Go articles · Ratn Labs` |
| About | `About Ratnesh Maurya — Backend Engineer · Ratn Labs` (53) |
| Cheatsheet | `{Tool} Cheatsheet — {Brand}` |

---

## 4. Entity SEO — winning "Ratnesh Maurya" + "Ratn Labs"

### 4.1 Who Ratnesh is (verified from public sources, 2026-05-03)

- **Role:** Software Development Engineer, **Initializ** (≈ 2 yrs)
- **Stack:** Go, Elixir, PostgreSQL, Kubernetes, AWS, RAG pipelines
- **Location:** Gurugram, India
- **Personal site:** `ratnesh-maurya.com`
- **Blog:** `blog.ratnesh-maurya.com` (Ratn Labs)
- **GitHub:** `ratnesh-maurya` (41 repos, handle `deadlock.go`)
- **LinkedIn:** `linkedin.com/in/ratnesh-maurya`
- **Twitter/X:** `@_ratneshmaurya`
- **Instagram:** `@ratn_labs`
- **Peerlist:** `peerlist.io/ratnesh_maurya`
- **LeetCode:** `ratnesh_maurya`
- **Codeforces:** `ratnesh_`
- **Email:** `ratneshmaurya2311@gmail.com` (public on portfolio)
- **Background:** BTech CSE, Dr. Ambedkar Institute of Technology for Handicapped; ex-DevOps intern @ Initializ; Mentor — GirlScript Summer of Code
- **Note — disambiguation:** Several other "Ratnesh Maurya" profiles on LinkedIn (Idea Cellular, Caravan Indie, etc.). Strong entity disambiguation is **the** ranking lever — see 4.2.

### 4.2 Disambiguation play

1. **Single canonical Person** with these properties:
   ```json
   {
     "@type": "Person",
     "@id": "https://ratnesh-maurya.com/#person",
     "name": "Ratnesh Maurya",
     "alternateName": ["Ratn", "deadlock.go"],
     "givenName": "Ratnesh",
     "familyName": "Maurya",
     "jobTitle": "Software Development Engineer",
     "worksFor": { "@type": "Organization", "name": "Initializ", "url": "https://initializ.ai" },
     "alumniOf": "Dr. Ambedkar Institute of Technology for Handicapped",
     "address": { "@type": "PostalAddress", "addressLocality": "Gurugram", "addressCountry": "IN" },
     "url": "https://ratnesh-maurya.com",
     "image": "https://ratnesh-maurya.com/avatar.jpg",
     "sameAs": [
       "https://github.com/ratnesh-maurya",
       "https://www.linkedin.com/in/ratnesh-maurya/",
       "https://twitter.com/_ratneshmaurya",
       "https://peerlist.io/ratnesh_maurya",
       "https://www.instagram.com/ratn_labs/",
       "https://leetcode.com/ratnesh_maurya/",
       "https://codeforces.com/profile/ratnesh_",
       "https://blog.ratnesh-maurya.com"
     ],
     "knowsAbout": ["Go", "Elixir", "Distributed Systems", "Kubernetes", "AWS", "PostgreSQL", "Backend Architecture", "RAG", "AI Engineering"],
     "knowsLanguage": ["en", "hi"]
   }
   ```
2. **Same Person `@id` referenced** (not redefined) on every article (`author`), about page (`mainEntity`), home (`mentions`).
3. **Bidirectional links** from every owned profile back to `ratnesh-maurya.com`. Verify each `sameAs` URL responds 200 and links back. (Currently `instagram.com/ratn_labs` and `peerlist.io/ratnesh_maurya` need confirming.)
4. **Wikidata + Wikipedia (long-game):** create a Wikidata item `Q...` for "Ratnesh Maurya (software engineer)" with `sitelinks` to portfolio + blog. Wikidata feeds Google Knowledge Panel.
5. **About page hardening:** `/about` should declare `AboutPage` schema with `mainEntity` = Person. Add an FAQ block ("Who is Ratnesh Maurya?", "Where does Ratnesh work?", "What does Ratn Labs cover?") — these answer People-Also-Ask boxes verbatim.
6. **Brand SERP cleanup:** the `RocketReach` and `ZoomInfo` results currently outrank some owned properties. Submit takedown / opt-out. File `https://www.linkedin.com/in/ratnesh-maurya/` and the portfolio in Google Search Console for indexing first.

---

## 5. Performance — Core Web Vitals 2026 plan

Targets (2026 thresholds):
- **LCP < 2.5 s** at p75 mobile
- **INP < 200 ms** at p75
- **CLS < 0.1** at p75

### 5.1 LCP
- Preload hero font weight only: `<link rel="preload" href="/_next/static/media/SourceSerif4-700.woff2" as="font" type="font/woff2" crossorigin>`.
- For article hero image, add `priority` on `next/image` and explicit `sizes`.
- Inline critical CSS (Next does this; verify after `next build`).

### 5.2 INP — most likely failure mode here
- `backdrop-filter: blur(16px) saturate(160%)` repeated on stacked cards is GPU-expensive on Android. On scroll-heavy pages (home, listings), reduce blur to `8–10px` for cards, keep `16–28px` for header only.
- Audit `ScrollIntoView`, scroll listeners (ReadingProgress), debounce to `requestAnimationFrame`.
- Move `Vercel Analytics` and custom `Analytics` script to `strategy="lazyOnload"` if not already.

### 5.3 CLS
- Reserve aspect-ratio boxes for every image: `aspect-[1200/630]` on cards.
- TOC sidebar: avoid late-mount re-flow — render server-side skeleton.

### 5.4 Bundle hygiene
- `recharts` + `googleapis` + `@google/generative-ai` should not ship to the public route bundles. Verify these are admin/server only.
- `@dnd-kit/*` — same; admin only.
- `react/dom` 19 + Next 15.5 turbopack: confirm route-level chunking with `next build --analyze`.

---

## 6. Content & E-E-A-T

Google's 2026 ranking heavily weights **Experience** signals + **author authority**. Plan:

1. Author box at end of every article: photo, 2-line bio, links — already partial; ensure schema `Person.image` is absolute URL.
2. **Editorial policy** + **Corrections** pages exist (`/editorial-policy`, `/corrections`) — strong E-E-A-T signal. Link them from article footers.
3. **Updated date** badge on articles ("Last updated: 2026-04-22") drives CTR + freshness signal.
4. **Original research / benchmarks** — one post per quarter with original numbers. Currently 13 posts; aim 1 cornerstone "ultimate guide" post per topic cluster.
5. **Topic clusters** — pages like `/topics`, `/series`, `/technical-terms` already form a hub-spoke. Add internal-link discipline: every article links to ≥ 2 sibling articles + 1 glossary term.
6. **Comments / engagement** — site has upvotes; expose as `InteractionStatistic` to schema.

---

## 7. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Glass blur kills INP on mid Android | High | Reduce blur; test on Pixel 6a |
| Trailing-slash dual canonicals duplicate-content | Medium | Pick one in `next.config.ts`, 301 the other |
| Person entity ambiguity with namesakes | High | Wikidata + dense `sameAs` graph |
| `dateModified == datePublished` distrusted | Medium | Frontmatter `updated:` field |
| Footer near-invisible on `green` accent | Low | Lock footer bg token |
| AI-bot scraping without referral | Low | llms.txt already permits — keep, monitor |

---

## 8. Implementation backlog (ordered)

### Phase 1 — Metadata + Schema correctness (1–2 days)
- [ ] Add `updated:` frontmatter to MDX schema; thread to `dateModified`.
- [ ] Stable Person `@id` everywhere; collapse 15 inline `sameAs` blocks to one source of truth (`src/lib/seo/person.ts`).
- [ ] `mainEntityOfPage` on every article.
- [ ] `headline` enforced ≤ 110 chars (TS type guard).
- [ ] Title-length lint (max 60) + description-length lint (140–155) — `scripts/seo-lint.ts` runs on `prebuild`.
- [ ] Canonical trailing-slash decision; update `next.config.ts` `trailingSlash: true` (matches current sitemap) and audit internal `<Link>` usage.
- [ ] `AboutPage` + `ProfilePage` schema on `/about`.
- [ ] `DefinedTermSet` on `/technical-terms`; `DefinedTerm` on each.
- [ ] `HowTo` / `TechArticle` on `/cheatsheets/*`.
- [ ] `BreadcrumbList` on every listing.
- [ ] News-sitemap split.
- [ ] Sitemap `lastModified` from git mtime, not `Date.now()`.

### Phase 2 — Entity SEO win (1 day + ongoing)
- [ ] Hero byline + author photo above fold on home.
- [ ] FAQ on `/about` (5 Q&A: Who is Ratnesh Maurya, Where works, Topics, Contact, Newsletter).
- [ ] Verify all `sameAs` URLs return 200 and link back.
- [ ] Submit `/sitemap.xml` to Bing Webmaster + Yandex.
- [ ] IndexNow integration (key file in `/public`, ping on revalidate).
- [ ] Create Wikidata item (manual, off-repo).
- [ ] Update GitHub profile README → link blog + portfolio.
- [ ] Update LinkedIn featured section → pin top 3 articles.
- [ ] Pin tweet thread linking blog + portfolio.

### Phase 3 — Performance (1 day)
- [ ] Preload primary font on `/` and `/blog/[slug]`.
- [ ] Reduce card backdrop-filter to 10px on listing pages.
- [ ] `priority` + correct `sizes` on hero image.
- [ ] Ship `next build --analyze` report; route-split admin deps.
- [ ] `aspect-ratio` boxes for all `next/image`.
- [ ] Replace `github-dark-dimmed` with theme-aware highlight.

### Phase 4 — Design polish (0.5 day)
- [ ] Bump muted body color to `--neutral-600` (WCAG AA fix).
- [ ] Default theme = `prefers-color-scheme`.
- [ ] Lock footer bg token (don't derive from accent).
- [ ] `:focus-visible` rings audit on glass.
- [ ] Skip-to-content link.
- [ ] Tag chips on `/blog`.

### Phase 5 — Content discipline (ongoing)
- [ ] Cornerstone post per quarter (original benchmarks).
- [ ] Internal-link rule: ≥ 2 sibling links + 1 glossary per article.
- [ ] Author-box component embedded on every article.
- [ ] "Last updated" badge with `updated` frontmatter.

---

## 9. Acceptance — how we know it ranked

| Metric | Tool | Target |
|---|---|---|
| `Ratnesh Maurya` query | Google SERP | Position 1, sitelinks, knowledge panel within 90 days |
| `Ratn Labs` query | Google SERP | Position 1 |
| Core Web Vitals p75 | PageSpeed Insights / CrUX | All green |
| Rich result eligibility | Google Rich Results Test | Article + Breadcrumb + FAQ + Person all valid |
| Indexed pages | Google Search Console | ≥ 95% of submitted URLs |
| Brand impressions | GSC Performance | Trend up week-over-week |
| INP p75 mobile | web-vitals lib in prod | < 200 ms |
| LCP p75 mobile | web-vitals lib | < 2.5 s |

---

## 10. References

- SEO Metadata Best Practices 2026 — https://zoer.ai/posts/zoer/seo-metadata-best-practices-implementation-guide-1459
- Technical SEO Checklist 2026 — https://www.debugbear.com/blog/technical-seo-checklist
- Structured Data SEO 2026 — https://www.digitalapplied.com/blog/structured-data-seo-2026-rich-results-guide
- Schema Markup 2026 — https://www.gwcontent.com/blogs/news/structured-data-for-seo
- Core Web Vitals 2026 — https://www.corewebvitals.io/core-web-vitals
- Google CWV docs — https://developers.google.com/search/docs/appearance/core-web-vitals
- web.dev Vitals — https://web.dev/articles/vitals
- 7 SEO + AI Search Trends 2026 — https://www.squarespace.com/blog/seo-trends
- Ratnesh portfolio — https://www.ratnesh-maurya.com/
- Ratnesh GitHub — https://github.com/ratnesh-maurya
- Ratnesh LinkedIn — https://www.linkedin.com/in/ratnesh-maurya/
- Ratn Labs Peerlist — https://peerlist.io/ratnesh_maurya/project/all-blog-posts--ratn-labs

---

*End of report. Phase 1 is the highest-leverage start; ship it before content cadence work.*
