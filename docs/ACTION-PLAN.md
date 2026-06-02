# Ratn Labs — UX & SEO Action Plan

Living checklist from the site audit (2026-06). **Ship content and entity signals before more platform work.**

Legend: `[x]` done in repo · `[ ]` todo · `—` ongoing / off-site

---

## P0 — Do first (highest ROI)

### Content & freshness
- [ ] Add `updated: YYYY-MM-DD` to frontmatter when you revise any blog post (`content/blog/*.md`)
- [ ] Editorial rule: every new blog post links to ≥2 sibling posts + 1 `/technical-terms/` page
- [ ] Publish 1 cornerstone post per quarter (original benchmarks, war stories, not digests)

### Entity SEO (off-site — "Ratnesh Maurya" SERP)
- [ ] GitHub profile README → link `blog.ratnesh-maurya.com` + portfolio
- [ ] LinkedIn Featured → pin top 3 blog posts
- [ ] Verify every URL in `src/lib/seo/person.ts` `PERSON_SAME_AS` returns 200 and links back
- [ ] Google Search Console: submit sitemap, monitor "Ratnesh Maurya" + "Ratn Labs"

### IA (in repo)
- [x] `/glossary` → permanent redirect to `/technical-terms/`
- [x] Remove duplicate Glossary from nav / footer
- [x] Move **News** to "More" menu (Blog stays primary)
- [x] News page callout → points readers to Blog for original writing

---

## P1 — UX polish (in repo)

- [x] Home hero copy names Ratnesh Maurya in subtitle
- [x] `/analytics` — `noindex` (already set)
- [x] `/utm` — `noindex` via layout metadata
- [x] Remove unverified `pinterest-rich-pin` meta from blog posts
- [ ] Run PageSpeed on home + one article (mobile); fix INP if yellow (reduce card `backdrop-filter` on listings)
- [ ] Theme-aware code highlighting in dark mode (if still using light-only `github.css` in dark)

---

## P2 — SEO finishing moves

- [x] Stable Person `@id` — `src/lib/seo/person.ts`
- [x] Prebuild `seo-lint` — `npm run seo-lint`
- [x] Sitemap `lastModified` from git / post dates
- [x] DefinedTerm, AboutPage FAQ, breadcrumbs on major routes
- [ ] Run `npm run indexnow` after each deploy (or wire into CI)
- [ ] Bing Webmaster Tools — submit sitemap
- [ ] Add `updated:` to posts you know were revised (even backdated is better than never)

### Optional (low priority unless you target News / voice)
- [ ] Google News sitemap (`<news:news>`) for `/news/*`
- [ ] `Article.speakable` schema
- [ ] Claim Pinterest domain or skip rich pins entirely

---

## P3 — Stop / defer (diminishing returns)

- [ ] More JSON-LD types without new content
- [ ] New content surfaces (merge, don't multiply)
- [ ] `<meta keywords>` cleanup (Google ignores; cosmetic only)

---

## Editorial checklist (per blog post)

Copy into PR description or Notion when publishing:

1. **Title** 40–60 chars · **Description** 120–160 chars (`npm run seo-lint` validates)
2. **Tags** 2–5 relevant tags
3. **Internal links**: 2 related blog posts + 1 technical term
4. **`updated:`** set if revising an existing post
5. **Author box** visible at end (default on article template)
6. Share once with UTM from `/utm` (noindex tool)

---

## Content ratio targets

| Surface | Current (~Jun 2026) | Target |
|---------|---------------------|--------|
| Blog (original) | ~10 | Grow steadily; quality > quantity |
| News (digests) | ~53 | OK as secondary; don't outshine blog |
| Technical terms | ~69 | Link from blog; don't bulk for SEO alone |
| TIL | ~6 | Keep small and honest |

---

## Acceptance metrics

| Metric | Tool | Target |
|--------|------|--------|
| `Ratnesh Maurya` | Google SERP | Top 3 → #1 over 90 days |
| `Ratn Labs` | Google SERP | #1 |
| CWV p75 mobile | PageSpeed / CrUX | LCP &lt; 2.5s, INP &lt; 200ms |
| Rich results | Rich Results Test | Article + Person + Breadcrumb valid |
| Indexed % | GSC | ≥95% of submitted URLs |

---

## Related docs

- [DESIGN-CRITIC-AND-SEO-FIX-PLAN.md](./DESIGN-CRITIC-AND-SEO-FIX-PLAN.md) — full SCON audit (May 2026)
- [OPENGRAPH-SETUP.md](../OPENGRAPH-SETUP.md) — OG image pipeline

*Update this file when you check items off.*
