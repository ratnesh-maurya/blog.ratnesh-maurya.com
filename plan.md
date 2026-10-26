# plan.md — Migrate the blog to the "Ledger" design system

Source of truth for the target look: [DESIGN.md](DESIGN.md). This file only says **what changes, in what order, and how we know it is done**. When this file and DESIGN.md disagree on a visual value, DESIGN.md wins.

## Decisions (confirmed)

| Topic | Decision |
|---|---|
| Accent picker | **Remove.** Delete `ColorAccentPicker`, `AccentColorProvider`, the `data-accent` attribute, the 6 extra accent palettes in `globals.css`, and the `accent-color` localStorage key. One fixed brand: marigold → kumkum. |
| Cultural motifs | **Full Ledger.** Devanagari watermark (hero rail, footer wordmark), buti divider above page titles, dusk sky on the 404, handloom ornament in OG images. |
| Default theme | **Dark always.** `<html data-theme="dark">` rendered on the server. Pre-paint script only switches to light if the visitor chose it. The OS `prefers-color-scheme` is no longer read. |
| Rollout | **Foundation first, then page groups.** One PR per phase, merged in order. |

## Progress

| Phase | Status | Commit |
|---|---|---|
| 0 Baseline | done (screenshots of 6 routes in `docs/ledger-baseline/`, counts in `docs/ledger-baseline.md`) | 520dc98 |
| 1 Tokens, fonts, theme | done | 99913af |
| 2 Primitives | done | 6fce5ff |
| 3 Global chrome | done | 21060c9 |
| 4–11 | not started | |

Deviations from the spec made so far (revisit if you disagree):

- **No status pill and no "hire" pill in the header.** DESIGN.md has them, but they need copy about availability that I should not invent.
- **Breakpoints stay at Tailwind defaults** (sm 640, md 768, lg 1024). The spec's 520/720/900/1100 would shift every existing `md:`/`lg:` class. Ledger-specific CSS uses the spec widths directly in media queries.
- **Mobile keeps the hamburger drawer** instead of a scrolling second nav row. The drawer tested better at 390px.
- **Footer wordmark is "रत्न"** (decorative, `aria-hidden`). Change it in `Footer.tsx` if you want other text.
- **`--radius-sm/md/lg` follow the spec (12/18/26px)**, so Tailwind `rounded-sm/md/lg` are now rounder everywhere. `rounded-xl/2xl` are unchanged.
- **Accent-coloured buttons with white text became ink pills** (`--pill` / `--on-pill`). The old pairing fails contrast against the dark-mode accent.
- **highlight.js now uses a token-only theme**, and `highlight.js/styles/github.css` is no longer imported.
- Still to check: light theme visually (only dark was reviewed so far), and a Lighthouse comparison against the baseline.

## Where we are now (facts from the repo)

- Next 15.5.9, React 19.1, Tailwind v4 (`@tailwindcss/postcss`), `recharts` 3.7. No `lucide-react` (icons are inline SVG today).
- `src/app/globals.css`: 1,799 lines. Blue accent ramp, neutral greys, `--text-primary`-style token names, a "Liquid Glass" layer plus leftover "Neo-Brutalist" naming, film-grain overlay, 6 extra accent palettes.
- Fonts: Geist + Source Serif 4, self-hosted in `public/fonts` and declared in `src/app/fonts.css` (no `next/font`). Layout preloads `geist-latin` and `source-serif-4-latin`.
- Theme: `layout.tsx` inline script reads localStorage, falls back to the OS setting, sets `data-theme` and `data-accent`.
- Legacy class vocabulary used across components (counts from `src`): `glass-border` 123, `glass-bg` 117, `glass-shadow-sm` 54, `nb-card-sm` 50, `nb-card` 44, `nb-border` 43, `nb-badge*` ~90, `nb-btn*` ~40, `glass-bg-subtle` 30, `nb-section-label` 14, `page-header` 10, `prose*` ~35.
- Tailwind utilities in components: `text-xs`/`text-sm`/`rounded-full`/`rounded-xl`/`rounded-2xl` dominate; hard-coded `text-red-500`, `text-white`, `bg-green-400` exist; 16 files contain raw hex values (see Phase 8 list).
- OG images are built by scripts, not by Next routes: `scripts/og-card.tsx`, `build-og-all.tsx`, `build-og-technical-terms.tsx`, fonts in `scripts/og-fonts`. Current card is light with a blue grid and a 6px accent bar.
- `DESIGN.md` mentions `src/lib/kasavu.ts`. It does **not exist** in this repo, so Phase 1 and Phase 9 create it.

## Approach and rules

1. **Tokens first, then components, then pages.** Pages must not hard-code Ledger values. They use the role tokens (`--bg`, `--surface`, `--text`, `--muted`, `--line`, `--rule`, `--accent`, `--rose`, `--pill`, …).
2. **Compat aliases during the migration.** In Phase 1 keep the old names (`--background`, `--foreground`, `--text-primary`, `--border`, `--surface-elevated`, `--accent-*`) as aliases that point to the new Ledger tokens. This keeps un-migrated pages usable at every merge point. Phase 10 deletes every alias.
3. **Same class names, new rules, then rename.** Re-skin `.nb-*` and `.glass-*` in place in Phase 2 so unmigrated pages do not break. Replace them with Ledger class names page-group by page-group. Phase 10 deletes the legacy classes once the grep count is zero.
4. **Every new colour has a light and a dark value.** No hex in components (DESIGN.md §12 rule 3). The only allowed exceptions are the ones listed in Phase 8.
5. **Controls are pills and ≥ 44px tall.** Headings are Display 400 with one `<em>` gradient word. Section openers are `border-top` rule + mono `§ 0N` kicker + Display H2.
6. **Each phase leaves `main` shippable.** Each PR must pass `npm run lint` and `npm run build`, and be checked in both themes at 360, 768 and 1280px before merge.

## Phase map

| # | Phase | Output | Depends on |
|---|---|---|---|
| 0 | Baseline and safety net | screenshots, grep counts, branch | none |
| 1 | Tokens, fonts, theme | new `:root` / dark tokens, 4 fonts, dark-default theme | 0 |
| 2 | Primitives | buttons, chips, tags, cards, inputs, code, prose, row table | 1 |
| 3 | Global chrome | Header, MobileMenu, Footer, SearchPopup, skip link, focus ring, page head | 2 |
| 4 | Home | `/` | 3 |
| 5 | Blog | `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/series`, `/topics` | 3 |
| 6 | Content sections | news, til, silly-questions, technical-terms, glossary, cheatsheets, bookmarks, resources | 3 |
| 7 | Static and utility pages | about, now, uses, contact, newsletter, links, l, search, policies, 404, loading states | 3 |
| 8 | Analytics and admin | `/analytics`, `/utm`, `/admin/reels`, recharts theme, MDX charts | 2 |
| 9 | Imagery and metadata | OG cards, theme-color, manifest, favicons, feeds' HTML | 1 |
| 10 | Cleanup | delete legacy CSS, aliases, picker; docs | 4–9 |
| 11 | QA and release | accessibility, performance, visual regression, rollout | 10 |

Phases 4–9 are independent of each other once Phase 3 is merged. Do them in the listed order unless there is a reason to swap.

---

## Phase 0 — Baseline and safety net

**Goal:** be able to prove nothing broke and to measure when we are done.

- Create branch `design/ledger` (or one branch per phase, see Rollout).
- Take full-page screenshots of every route in the table in Phase 11, light and dark, at 360 / 768 / 1280px. Store under `docs/ledger-baseline/` (gitignored if large).
- Record baseline numbers: Lighthouse (mobile) for `/`, `/blog`, one post, `/til`; CSS bundle size; font bytes.
- Record the "legacy surface" counts, to drive Phase 10 and track progress:
  - `grep -rE "nb-|glass-" src | wc -l`
  - `grep -rE "#[0-9A-Fa-f]{6}" src --include='*.tsx' -l | wc -l`
  - `grep -rE "data-accent|accent-color|ColorAccent|AccentColor" src | wc -l`
  - `grep -rE "text-red-|text-white|bg-green-|bg-red-|text-gray-|bg-gray-|slate|zinc" src | wc -l`
- Decide which tests exist. The repo has no test script (only `build` and `lint`), so visual checks and a11y checks are manual or scripted in Phase 11.

**Done when:** baseline screenshots and counts are committed or stored, and the list of routes is final.

---

## Phase 1 — Tokens, fonts, theme

**Goal:** the whole site renders with Ledger colours, fonts and dark default, even before any component changes.

**Files:** `src/app/globals.css`, `src/app/fonts.css`, `src/app/layout.tsx`, `public/fonts/`, `src/lib/kasavu.ts` (new).

1. **Tokens.** Replace the `:root` and `[data-theme="dark"]` blocks with DESIGN.md §11a verbatim (light + dark values for every token). Add the Tailwind v4 `@theme inline` block from §11b so utilities like `bg-surface`, `text-muted`, `border-line`, `rounded-lg`, `font-display` exist.
2. **Compat aliases** (temporary, marked `/* LEGACY-ALIAS: remove in Phase 10 */`), for example:
   `--background: var(--bg); --foreground: var(--text); --text-primary: var(--text); --text-secondary: var(--body); --text-muted: var(--muted); --border: var(--line); --surface-elevated: var(--surface); --accent-500: var(--marigold)`. Build the list by grepping every `var(--…)` used in `src` and `globals.css` that the new token set does not define.
3. **Fonts.**
   - Add Instrument Serif (400 + italic), JetBrains Mono (400, 500), Tiro Devanagari Hindi (400); keep Geist (400/500/600).
   - The repo self-hosts fonts to avoid build-time network use. Keep that: download the woff2 files into `public/fonts/` and add `@font-face` rules in `fonts.css`. Do **not** switch to `next/font/google`.
   - Define `--font-instrument`, `--font-geist`, `--font-jetbrains`, `--font-tiro` as the family names, then `--font-display/-sans/-mono/-deva` per §11a.
   - Preload only above-the-fold faces: `instrument-serif-latin`, `geist-latin`. Remove the Source Serif 4 preload and files after Phase 10. Mono and Devanagari load lazily through `unicode-range`.
   - Apply `[lang="hi"] { font-family: var(--font-deva) }`.
4. **Base styles.** Body 17px/1.6 (16px ≤ 720px), `antialiased`, dot grid background, `body::before` top glow (900px), `scroll-padding-top: 96px`, selection `#FF7A18` on `#17150F`, global focus ring (`2px solid var(--accent)`, offset 3px, radius 6px), `prefers-reduced-motion` rule (§6). Remove the film-grain overlay (DESIGN.md: "Noise: none").
5. **Theme.**
   - `layout.tsx`: render `<html lang="en" data-theme="dark" suppressHydrationWarning>`.
   - Replace `themeScript` with `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`.
   - Update `viewport.themeColor` to the dark `--bg` (`#0E0D0B`); remove the light/dark media pair (the default is dark).
   - Check whatever toggles the theme (in `Header` / `ClientNavigation`) still writes `localStorage.theme`.
6. **Accent removal, part 1.** Stop writing `data-accent` in the theme script. Leave the picker components in place until Phase 3 removes them from the UI.
7. **Gradient and utilities.** Add `--saffron`, `.em-grad` (the italic gradient word), `.eyebrow`, `.kicker`, `.wrap`, `.sec`, `.sec-head`, `.buti` as shared utilities, built from DESIGN.md §3 and §8.
8. **`src/lib/kasavu.ts`.** Create it with the ornament palette (`#6E5110`, `#2F5D50`, `#A6812F`, …) and helper functions used by the buti divider SVG, the footer ornament and the OG frame. Marked as "not part of the UI colour system" (DESIGN.md appendix).

**Done when:** every route loads in dark Ledger colours with the new fonts; light theme works via the toggle; no console errors; `lint` and `build` pass; the Phase 0 screenshots show colour and font changes only (layouts may look rough, that is expected).

---

## Phase 2 — Primitives

**Goal:** every reusable building block matches DESIGN.md §8, so page phases only compose them.

Rebuild these in `globals.css` (or small component files) using only tokens. Keep the old class names pointing at the new rules until Phase 10.

| Primitive | Spec | Replaces |
|---|---|---|
| Button primary / ghost / outline / on-panel | §8 Button | `.nb-btn`, `.nb-btn-tint`, `.btn` variants, CTA button |
| Chip / filter tab (`aria-pressed`) | §8 Tabs | `CustomDropdown` triggers, topic nav pills, listing filters |
| Tag / small tag / strikethrough chip | §8 Badge | `.nb-badge*` (≈90 uses) |
| Card standard / glass / image / lead story / list item | §8 Card | `.nb-card`, `.nb-card-sm`, `.nb-surface-card`, `.glass-*` (≈300 uses) |
| Row table (kind · main · side) | §8 Table | listing rows in blog, til, news, glossary |
| Input / select / toast | §8 (inferred) | search, newsletter, comments, `CustomDropdown` |
| Code block + copy button | §8 Code block | `CodeCopyButton`, `CheatsheetCodeBlock`, highlight CSS |
| Prose (long-form) | §3 + §8 | the `.prose*` block (≈180 lines + dark overrides) |
| Section head (`§ 0N` kicker + H2) | §4, §12 rule 7 | `.nb-section-label`, `.page-header` |
| Page head with buti divider | §4, §5 | `.page-header` |
| Popover + lightbox | §8 Modal | `FloatingUpvoteButton` popover, image lightbox |
| Stats / big numerals (`column-reverse` dt/dd) | §3 | stat blocks in about, analytics |
| Heatmap cells (`--heat-0…4`) | §2.2 | reading heatmap, analytics |
| Dot-status pill (pulsing `--ok`) | §8 Navbar | header status |

**Prose details:** keep the `680px` cap. Headings Display 400, body Geist 17/1.6, links `--accent` (hover `--muted`), blockquote with a `--line` rule, inline code on `--surface-2`, tables on `--line`, `hr` as the buti divider or a hairline. Replace the `github-dark-dimmed` highlight palette with tokens (keywords `--accent`, strings/meta `--rose`, comments `--muted`; verify contrast ≥ 4.5:1 on `--surface-2`).

**Controls:** audit every new control for ≥ 44px height. Theme toggle becomes 44px.

**Done when:** a throwaway `/_ledger` route (not committed, or behind `NODE_ENV`) renders every primitive in both themes; contrast checked against DESIGN.md §10; no primitive uses a raw hex.

---

## Phase 3 — Global chrome

**Goal:** header, footer and shell are final, so every page shows the new identity at once.

- **Header / MobileMenu** (`Header.tsx`, `MobileMenu.tsx`, `ClientNavigation.tsx`): sticky, 64px, translucent `color-mix(in srgb, var(--bg) 88%, transparent)` + `blur(12px)`, 1px bottom `--line`. Brand: lowercase Display 26px with 10px gradient dot. Nav 14px, active = `--text` + 1px `--rule` underline, hover `--muted`. Status pill (hidden ≤ 1100px). 44px theme toggle. ≤ 760px: nav drops to its own horizontally-scrolling row (or keep the current mobile menu if it tests better; decide in the PR and note it).
- **Remove accent picker UI**: delete `ColorAccentPicker.tsx` and `AccentColorProvider.tsx`; remove them from `AppWrapper.tsx` and `ClientNavigation.tsx`; delete the `accent-color` read in `mdx/Charts.tsx` (use tokens). Delete the `[data-accent=…]` blocks in `globals.css` (lines ≈170–245 and ≈367–445).
- **Footer** (`Footer.tsx`): `--rule` top border, `auto-fit` columns (min 180px), 11px mono uppercase column heads, 14px links, base row with the huge Devanagari wordmark in `--water-2` (`clamp(64px,10vw,140px)`, `user-select: none`), right-aligned note and pill button.
- **SearchPopup / lightbox backdrop**: `rgba(10,10,16,.9)`, popover shadow, input per §8.
- **Skip link / focus**: keep `.skip-to-content`, restyle with tokens; z-index 100.
- **App shell** (`AppWrapper.tsx`): wrapper `width: min(1200px, 100% - 2*var(--gutter))`; hero `Devanagari rail` slot (used by Phase 4).
- **Misc chrome**: `ReadingProgress` (2px gradient hairline), `ServiceWorkerRegister` untouched, `FloatingUpvoteButton` becomes the "glass pill + popover" from §8 (overlapping 28px logo discs not required here, only restyle).

**Done when:** header and footer are Ledger on every route at 360 / 768 / 1280, both themes; no picker anywhere; keyboard tab order and focus rings verified.

---

## Phase 4 — Home (`src/app/page.tsx`, 611 lines)

- Hero: Display `clamp(72px,13vw,196px)` / .88 / -.04em with one `<em>` gradient word, mono eyebrow, lede ≤ 60ch, primary + ghost pills, Devanagari rail (`.lg-rail`, hidden ≤ 1100px), dot grid and glow already global.
- Sections become numbered: `§ 01 Latest`, `§ 02 Work`/`Series`, `§ 03 …`, each opening with a `--rule` top border and mono kicker. Pick the real section names from the current page; do not invent new content.
- Latest posts: lead-story block (22px radius, ink "facts" panel with 60px numerals) + row list.
- Homepage cards (`TodaysDigest`, `TermOfTheDay`, `RecentNews`, `NewsletterCta`): standard cards with mono kicker, Display h3.
- Contact/CTA block: ink panel (28px radius) with the blurred orb and the gradient email underline (`background-size` 0 → 100%, `.3s`).
- Stats panel (20px radius) with big Display numerals and mono labels below (`column-reverse`).
- Replace all 74 inline `var(--…)` / `rounded-*` style usages with Ledger classes.

**Done when:** `/` matches DESIGN.md §13 hero + card pattern at every width; LCP no worse than baseline; no horizontal scroll at 360px.

---

## Phase 5 — Blog

Routes: `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/series`, `/topics`. Components: `BlogListingClient`, `BlogImage`, `OgImageInBody`, `TableOfContents`, `MobileToc`, `PostNavigation`, `RelatedPosts`, `ContinueReading`, `Comments`, `SocialShare`, `CopyMarkdownButton`, `UpvoteCounter`, `ViewCounter`, `BookmarkButton`, `ReadingHistoryTracker` (no UI), `mdx/*`, `blog/loading.tsx`, `topics/loading.tsx`.

- Listing: page head (buti divider, Display H1 with one gradient word, lede), filter chips (`aria-pressed`), row table with mono date (180px), Display title 28px, mono tags. Featured post uses the lead-story block.
- Post: page head, mono kicker row (date · read time · views), prose per Phase 2, sticky TOC in mono, code blocks per §8, callouts built from `--surface-2` + `--line` (no coloured banners), related posts as cards, prev/next as ghost pills, share and bookmark as 44px icon pills (outline 1.8 stroke).
- Tag, series and topics pages: same row table; topic nav pills become chips.
- MDX components: `Architecture` diagram colours → tokens; `Charts` → Phase 8 recharts theme.
- Loading skeletons: `--surface-2` blocks with no shimmer (motion rule), or an opacity pulse only.

**Done when:** a long post (with code, table, image, blockquote, diagram) reads correctly in both themes at 360px and 1280px; TOC, bookmark, upvote and share still work.

---

## Phase 6 — Content sections

Routes: `/news`, `/news/[slug]`, `/til`, `/til/[slug]`, `/silly-questions`, `/silly-questions/[slug]`, `/technical-terms`, `/technical-terms/[slug]`, `/glossary`, `/cheatsheets`, `/cheatsheets/[slug]`, `/bookmarks`, `/resources`. Components: `NewsContent`, `NewsTracker`, `TILListingClient`, `SillyQuestionsListingClient`, `TechnicalTermsSearch`, `RelatedTerms`, `CheatsheetsListingClient`, `CheatsheetCodeBlock`, `BookmarksList`, `CustomDropdown`, and the three `loading.tsx` files.

- One shared listing template: page head → search input (pill) → chips → row table. Each section gets its own mono kicker and numbering.
- Detail pages reuse the post layout from Phase 5.
- News: each item is a row with mono source and date; the digest page uses `§ 0N` for each topic group.
- Technical terms / glossary: A–Z rail in mono, term rows, definition in prose.
- Cheatsheets: code blocks and tables restyled; copy button dashed border (§5).
- Bookmarks: empty state is a muted paragraph per §8.
- `CustomDropdown`: restyle as the select pattern (pill, 16px chevron icon).

**Done when:** all 13 routes use the shared templates; no `nb-*`/`glass-*` class remains in these files (`grep` returns 0 for the files listed here).

---

## Phase 7 — Static and utility pages

Routes: `/about`, `/now`, `/uses`, `/contact`, `/newsletter`, `/links`, `/l`, `/search`, `/privacy-policy`, `/editorial-policy`, `/corrections`, `not-found`, root `loading.tsx`. Components: `LinksView`, `NewsletterCta`, `StructuredData` (no UI).

- About: page head, numbered sections (§ 01 Story, § 02 Roles, § 03 Stack…), roles as row table with 36px Display role h3, logos on white discs with 1px `--line` ring, photo wall masonry (3/2/1 columns, 16px gap, 18px radius) with the lightbox.
- Now / uses / policies: prose pages inside the page head template. `now.md` and `privacy-policy.md` content untouched.
- Contact: ink panel with the orb + gradient email underline; form (if any) uses the Phase 2 input.
- Newsletter: single card with pill input + primary button; success / error use `--ok` / `--rose` text.
- Links (`/links`, `/l`): Instagram-style link page keeps its function; restyle cards as pill rows (these pages are opened from a phone, so test 360px first). Replace the hex values in `LinksView.tsx` with tokens.
- Search page: input + results as a row table.
- 404: giant gradient `404` in the script font, dusk sky (`.sky`, 820px, four blurred ellipses), terminal-trace card with three coloured dots, pill links back home (§8).
- Remaining `loading.tsx`: Ledger skeleton.

**Done when:** every static route and the 404 render Ledger; `/links` verified on a real phone width.

---

## Phase 8 — Analytics and admin

Routes: `/analytics`, `/utm`, `/admin/reels`. Components: all 18 files in `src/components/analytics/`, `UtmAnalyticsCharts.tsx`, `UtmTracker` (no UI), `TotalViews`, `PageStatsTracker` (no UI), `mdx/Charts.tsx`.

- Dashboard: cards per Phase 2, mono labels, Display numerals. Sections numbered `§ 0N`.
- **Recharts theme:** one shared `chartTheme` (new `src/lib/chart-theme.ts`) exporting series colours from tokens only. Palette: `--marigold`, `--kumkum`, `--peacock`, `--ok`, `--muted` (check that adjacent series are distinguishable and ≥ 3:1 vs `--surface`; use the `dataviz` skill's validator). Axis and grid in `--line`/`--muted`, tooltips as popover (`--surface`, 18px radius, popover shadow).
- Sankey chart, heatmap (`--heat-0…4`), live ticker (pulsing `--ok` dot), Web Vitals tiles: replace hex with tokens. Files with raw hex today: `web-vitals-section.tsx`, `trending-section.tsx`, `mdx/Charts.tsx`.
- Good/bad states: `--ok` and `--rose`. For warning/info use marigold-600 / ink-500 (DESIGN.md §2.2 note); document in the PR.
- `/admin/reels`: same primitives; internal page, low polish bar.

**Done when:** every chart reads in both themes; no hex in `components/analytics`; no `text-red-500` / `bg-green-400` leftovers (replace with `--rose` / `--ok`).

---

## Phase 9 — Imagery and metadata

- **OG cards** (`scripts/og-card.tsx`, `build-og-all.tsx`, `build-og-technical-terms.tsx`): redesign the 1200×630 card to Ledger. Dark bg `#0E0D0B`, dot grid, marigold/kumkum glow top-right, mono kicker, Display title (Instrument Serif) with one gradient word where satori allows (else solid `--accent`), handloom ornament from `kasavu.ts`, Devanagari ghost glyph. Satori limits to respect: no CSS masks, no `color-mix`, only TTF/OTF/WOFF fonts (not woff2). Add `instrument-serif`, `jetbrains-mono`, `tiro-devanagari` files to `scripts/og-fonts/` and keep the existing kerning workaround for Geist. Regenerate all images in `public/og/`.
- `viewport.themeColor`, `site.webmanifest` (`theme_color`, `background_color` → `#0E0D0B`), favicon / apple-touch / android icons on the new brand (gradient dot on dark). `src/lib/og.ts` and `StructuredData` only if they reference colours.
- Print stylesheet (`@media print` in `globals.css`): force the light token set.
- Reel/Instagram carousel skill (`.claude/skills/reel-from-post`, light mode): **out of scope** for this plan. Revisit afterwards if wanted.

**Done when:** OG images for home, blog post, til, news, technical term and cheatsheet are regenerated and checked in a social-card validator; manifest and meta colours updated.

---

## Phase 10 — Cleanup

- Delete `.nb-*`, `.glass-*`, `.page-header`, `.prose` legacy duplicates, old gradients, film-grain, and Neo-Brutalist / Liquid Glass comments from `globals.css`. Target size: well under 1,000 lines.
- Delete every `LEGACY-ALIAS` token.
- Delete unused font files (Source Serif 4, Geist Mono if unused) and their `@font-face` rules.
- Confirm the Phase 0 greps now return **0**: `nb-|glass-`, raw hex in `.tsx` (except documented exceptions: `kasavu.ts`, OG scripts, `manifest`), `data-accent|accent-color|ColorAccent|AccentColor`, Tailwind palette classes.
- Update `README.md` / `documentation.md` and add a short "design" section pointing to `DESIGN.md`. Update the auto-memory note (Liquid Glass → Ledger).
- Fix the DESIGN.md gap: define `@keyframes dusk-drift` or remove the reference.

**Done when:** all greps are zero; `lint` and `build` pass; CSS bundle is no larger than baseline.

---

## Phase 11 — QA and release

**Route checklist (all must be visited, light + dark, 360 / 768 / 1280px):**
`/`, `/about`, `/analytics`, `/blog`, `/blog/[slug]` (3 posts incl. a long one), `/blog/tag/[tag]`, `/bookmarks`, `/cheatsheets`, `/cheatsheets/[slug]`, `/contact`, `/corrections`, `/editorial-policy`, `/glossary`, `/l`, `/links`, `/news`, `/news/[slug]`, `/newsletter`, `/now`, `/privacy-policy`, `/resources`, `/search`, `/series`, `/silly-questions`, `/silly-questions/[slug]`, `/technical-terms`, `/technical-terms/[slug]`, `/til`, `/til/[slug]`, `/topics`, `/uses`, `/utm`, `/admin/reels`, a 404, every `loading.tsx`.

**Checks**
- Accessibility: contrast for every text/background pair against DESIGN.md §10 (≥ 4.5:1 text), keyboard-only pass, focus ring visible on every control, skip link, `aria-current`, `aria-pressed`, `prefers-reduced-motion` honoured, touch targets ≥ 44px.
- Performance vs Phase 0: LCP, CLS (no font-swap shift: use `size-adjust` fallbacks or preload), INP, CSS and font bytes.
- Behaviour regressions: theme toggle persists, search popup, TOC, bookmarks, upvote, comments, view counters, newsletter form, RSS and sitemap unchanged.
- SEO: `<title>`, canonical, OG tags unchanged; new OG images return 200 and are < 300 KB.
- Visual diff against Phase 0 screenshots, reviewed page by page.

**Release**
- Merge in phase order. After Phase 3 the visible brand switches, so announce that and watch analytics (bounce, vitals) for a week.
- Rollback: each phase is one PR, so revert that PR. Phases 1–3 are the riskiest, because the alias layer lets 4–9 be reverted independently.

## Risks and open items

| Risk | Mitigation |
|---|---|
| Self-hosting 3 new font families adds bytes and a swap shift | Preload only the two above-the-fold faces, `font-display: swap`, subset to latin, add metric-matched fallback. |
| Gradient italic words fail contrast on light bg (DESIGN.md §10: ≈ 2.5:1) | Dark is the default, as designed. In light mode keep to large display sizes and never put the gradient on anything that carries meaning alone. |
| Satori cannot render everything the web design does | Phase 9 uses a simplified card; judge it by social-card previews, not by pixel parity. |
| 55 components and ≈ 300 legacy class uses | Alias and re-skin layers (Phases 1–2) keep `main` working while page groups migrate. |
| No test suite | Phase 0 screenshots plus the Phase 11 route checklist stand in for it. Add Playwright screenshots only if you want them (not planned). |
| `DESIGN.md` has inferred values (input, select, toast, warning/info) | Treated as defaults. Flag any deviation in the PR. |

## Out of scope

- Content changes (posts, news, glossary text). Copy tweaks stop at microcopy listed in DESIGN.md §9.
- Supabase schema, API routes, analytics logic, daily news pipeline.
- The Instagram reel skill and the `reels/` output.
- Any new feature or page that does not exist today.
