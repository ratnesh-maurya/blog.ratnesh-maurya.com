# Site Audit & Improvement Plan — July 2026

Full audit: UI/UX + retention, OG images, analytics. Findings + prioritized TODO.

> **Status: BUILT (July 2, 2026).** All four phases implemented. Remaining manual steps before the new features go fully live:
>
> 1. ~~Run `supabase/migrations/007_analytics_revamp.sql`~~ — **done (applied July 2, 2026)**.
> 2. **Giscus comments:** skipped by choice. Component is env-gated and renders nothing; to enable later set `NEXT_PUBLIC_GISCUS_*` vars (see `src/components/Comments.tsx` header).
> 3. **Search Console:** skipped by choice. Section removed from the dashboard's default order; to enable later, configure the GSC service account and re-add `'search-console'` to `DEFAULT_ORDER` in `src/components/analytics/dashboard.tsx`.
>
> Skipped intentionally: WebP OG output (`@vercel/og` emits PNG only — moot anyway, new images average ~115KB vs old ~2MB), globals.css module split + hero inline-style refactor (cosmetic churn, regression risk, zero user value), listing stat-fetch batching (already one query per type — audit concern didn't hold up).

---

## 1. Verdict Summary

| Area | Grade | One-liner |
|---|---|---|
| Visual design | 8/10 | Liquid Glass system cohesive, distinctive, accessible |
| Retention | 5/10 | Good on-page loops (related, TOC, prev/next); zero return-visit mechanics |
| OG images | 5/10 | ~95% coverage, but design is stale pre-redesign era — doesn't match site |
| Analytics | 6/10 | Strong UTM/funnel plumbing; shallow insight (no trends, no quality, GA4 siloed) |

---

## 2. UI/UX + Retention Findings

### What works
- Liquid Glass design system (`src/app/globals.css`, 1820 lines): glass tokens, 6 accent palettes, dark mode, WCAG AA, reduced-motion support.
- On-page retention: ReadingProgress, TableOfContents, RelatedPosts (category+tag scored), PostNavigation, SocialShare (UTM-tracked), FloatingUpvoteButton.
- Homepage hierarchy strong: hero → featured magazine grid → latest → library → FAQ + newsletter.
- Search covers all content types; series/topics pages exist.

### Gaps (why returning users don't stick)
1. **No return-visit hooks.** Nothing remembers the reader. No bookmarks, no recently-viewed, no "continue reading at 34%". Every visit is a cold start.
2. **News (70 posts) + technical-terms (69) are the volume engines but under-leveraged** — no "term of the day", no news archive digest emails, no cross-linking from blog prose into glossary at scale.
3. **Newsletter = Substack iframe.** No control, no incentive copy, no post-read inline CTA (only homepage + /newsletter page).
4. **No PWA/offline.** `site.webmanifest` hollow, no service worker.
5. **No comments/discussion.** Single upvote only. Giscus would be free + zero-maintenance.
6. **Blog listing has no pagination** — fine at 14 posts, breaks past ~50.
7. **Newsletter conversion surface small** — no exit-intent, no in-article CTA after 50% scroll.

---

## 3. OG Image Findings

Pipeline: `scripts/build-og-all.tsx` (805 lines) → postbuild → ~190 static PNGs in `public/og/`. Solid architecture.

### Problems
1. **Design mismatch (critical).** OG uses Newsreader/EB Garamond + dark geometric patterns + per-section neon accents (red news, pink silly, emerald cheatsheets). Site is now Liquid Glass: blue #0066CC, warm neutrals, Geist + Source Serif 4, frosted glass. OG cards look like a different website.
2. **No dynamic data.** `readingTime` exists in frontmatter but never rendered. No date, no tag pills with real tags, no post count on section cards.
3. **Coverage holes:** `/contact` falls back to home.png, `/analytics` has no OG at all, `now`/`uses` images built but unreachable (routes redirect).
4. **File size:** PNGs ~2MB each. WebP would cut ~40%.
5. **FORCE_REGENERATE=false** — old posts never pick up design changes unless PNG deleted manually.
6. **No shared metadata builder** — every route re-implements openGraph/twitter boilerplate.
7. Only blog has tag OG images; news/til/terms have no tag routes at all.

### Direction for redesign
One coherent template family, Liquid Glass language:
- Light glass card floating on soft gradient (matching hero gradient orbs), blue accent, Geist headline + Source Serif detail.
- Per-section accent hue from the site's real accent scale (blue/teal/purple/etc), not neon.
- Dynamic elements: reading time pill, date, 1–2 real tags, section label, avatar + domain footer.
- Section listing cards show live counts ("70 daily digests", "69 terms").
- Embed actual font files in @vercel/og config (currently relies on fallbacks).

---

## 4. Analytics Findings

Stack: Supabase (`stats`, `stats_events`, `utm_hits` + 4 RPCs), GA4 gtag, dashboard at `/analytics` with 7 draggable sections.

### Strong
UTM attribution, Sankey source→content flow, funnel cascade, daily time series, content-type filter, 7d delta insight strip.

### Weak / missing
1. **No per-post trends.** Only all-time top 8. Can't see what's gaining momentum this week.
2. **GA4 data siloed.** Reading progress (25/50/75/100%), time-on-page, web vitals all sent to GA4, never displayed. Dashboard blind to engagement quality.
3. **No referrer header capture.** Only UTM + ?ref — organic Google vs direct vs backlinks invisible.
4. **No device/geo/browser.** Nothing collected.
5. **No Search Console integration** despite `googleapis` already a dependency (used for Indexing API only). Queries, impressions, CTR, position all missing.
6. **No engagement stored server-side:** scroll depth, read completion, session time → can't rank posts by quality vs vanity views.
7. **No real-time view** (Supabase Realtime available, unused).

---

## 5. TODO — Prioritized Plan

### Phase 1 — OG redesign (high visibility, self-contained)
- [ ] 1.1 New `buildOgElement()`: Liquid Glass template — site palette, Geist + Source Serif embedded fonts, glass card + gradient orbs
- [ ] 1.2 Per-section accent hues from site accent scales (drop neon theme table)
- [ ] 1.3 Dynamic data in per-post cards: reading time, date, top 2 tags
- [ ] 1.4 Section cards with live content counts
- [ ] 1.5 Add `/contact` to SECTION_PAGES; add analytics OG; drop dead now/uses generation
- [ ] 1.6 One-time FORCE_REGENERATE run; add hash-based invalidation (regen when template version bumps)
- [ ] 1.7 Shared `createPostMetadata()` helper — kill per-route boilerplate
- [ ] 1.8 Optional: WebP output to cut ~40% size

### Phase 2 — Retention mechanics (return visits)
- [ ] 2.1 Recently viewed + continue reading: localStorage last 10 posts + scroll %, "Resume reading" strip on homepage
- [ ] 2.2 Bookmarks: save button on cards + posts, `/bookmarks` page (localStorage first, Supabase later)
- [ ] 2.3 In-article newsletter CTA after ~50% scroll (glass card, own copy, not iframe)
- [ ] 2.4 Giscus comments on blog posts (GitHub discussions, zero backend)
- [ ] 2.5 "Term of the day" module on homepage — leverages 69-term glossary
- [ ] 2.6 Blog listing pagination or load-more (future-proofing)
- [ ] 2.7 PWA: service worker + cache recent posts, fill out manifest

### Phase 3 — Analytics revamp (data-driven)
- [ ] 3.1 Trending section: per-post 7d/30d views with delta + momentum rank (data already in `stats_events`, just new RPC)
- [ ] 3.2 Capture `document.referrer` in utm_hits (new column) → organic/direct/backlink breakdown
- [ ] 3.3 Store engagement in Supabase: scroll depth + read-completion events alongside GA4 → "read quality" per post (completion rate vs views)
- [ ] 3.4 Search Console API integration (reuse googleapis service account): queries, impressions, CTR, position dashboard section
- [ ] 3.5 Device/country capture (user-agent parse + Vercel geo headers in `/api/utm`)
- [ ] 3.6 Web vitals section: send vitals to Supabase too, show p75 LCP/CLS/INP per route
- [ ] 3.7 Real-time "views today" ticker via Supabase Realtime
- [ ] 3.8 Content lifecycle chart: views vs post age — shows evergreen vs decay

### Phase 4 — Polish
- [ ] 4.1 Root layout OG alt text
- [ ] 4.2 Split globals.css into modules
- [ ] 4.3 Replace inline styles on hero/featured cards with CSS vars
- [ ] 4.4 Batch Supabase stat fetches on listing pages

**Suggested order:** 1 → 3.1–3.3 → 2.1–2.3 → rest. OG redesign is fastest visible win; trending + referrer are cheap because data already flows; retention features compound after that.
