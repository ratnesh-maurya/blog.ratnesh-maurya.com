# Ratnesh Maurya — Brand Identity & Theme Documentation

This document defines the **brand identity** and **design system** for ratnesh-maurya.com and how to apply the same theme to sub-products (e.g. blog.ratnesh-maurya.com).

---

## 1. Brand identity

### 1.1 Positioning

- **Primary site:** ratnesh-maurya.com — portfolio and hub.
- **Sub-products:** blog (blog.ratnesh-maurya.com), tools (e.g. tracker, jsonic, mdconverter on subdomains).
- **Positioning:** Backend Engineer, Go & Elixir, cloud-native systems. Professional but approachable; technical depth with clarity.

### 1.2 Voice & tone

- Clear, direct, no fluff.
- Technical terms used where appropriate; explanations when helpful.
- Confident but not boastful; Indian identity (e.g. locale `en_IN`, optional Hindi in footer) without overdoing it.

### 1.3 Naming

- **Primary:** “Ratnesh Maurya”
- **Short / nav:** “RM” (e.g. “RM / Now”)
- **Domain:** ratnesh-maurya.com (canonical); subdomains for blog, tools.

---

## 2. Theme — design tokens

The theme is **dark-first**, with a **deep navy background**, **teal primary**, and **indigo secondary**. It’s implemented via Tailwind v4 `@theme` and reused across the portfolio and OG images.

### 2.1 Color palette

| Token / usage        | Hex / value              | Use |
|----------------------|--------------------------|-----|
| **Background**       | `#030d0e`                | Page background, scrollbar track, themeColor |
| **Surface**          | `rgb(255 255 255 / 0.03)` | Cards, panels |
| **Surface (stronger)** | `rgb(255 255 255 / 0.055)` | Elevated surfaces |
| **Text high**        | `#f0fdfa`                | Headings, primary text |
| **Text mid**         | `#94a3b8`                | Body, secondary text |
| **Text low**         | `#475569`                | Muted, captions |
| **Teal (primary)**   | `#14b8a6`                | Links, accents, CTAs, nav active |
| **Teal (lighter)**   | `#2dd4bf`                | Hover, badges |
| **Teal (light)**     | `#99f6e4`                | Gradient text, pills |
| **Teal (darker)**    | `#0d9488`                | Optional darker variant |
| **Teal dim**         | `rgb(20 184 166 / 0.12)` | Glows, subtle fills |
| **Teal glow**        | `rgb(20 184 166 / 0.08)` | Ambient orbs, shadows |
| **Indigo (secondary)** | `#6366f1`              | Secondary orb, optional accent |

### 2.2 Typography

- **Sans:** Inter (Google Font) — `--font-inter`; weights 300, 400, 500, 600, 700; `display: swap`.
- **Mono:** JetBrains Mono — `--font-jetbrains-mono`; weights 400, 500.
- **Usage:** Sans for UI and body; mono for code, labels, 404 code.

### 2.3 Spacing & layout

- **Content width:** `max-w-3xl` or `max-w-4xl` (768px–896px) for reading; `max-w-4xl` for wider layouts.
- **Page padding:** `px-5 sm:px-8` or `px-6 md:px-10`.
- **Section spacing:** `mb-14`, `space-y-12`, `pt-24 pb-24` for inner pages with top bar.

### 2.4 Radii & borders

- **Cards / bento:** `rounded-2xl` (16px); border `1px solid rgb(255 255 255 / 0.07)`.
- **Pills / badges:** `rounded-full`; border `1px solid rgba(20,184,166,0.18)` or `0.12`.
- **Top bar:** `border-b border-[rgba(255,255,255,0.07)]`.

### 2.5 Motion

- **Easing:** `[0.25, 0.46, 0.45, 0.94]` (ease-out).
- **Orbs:** ~28s and ~38s infinite ease-in-out.
- **Gradient text:** 7s linear infinite sweep.

---

## 3. How the brand is applied (portfolio setup)

### 3.1 CSS — Tailwind v4 `@theme`

In `src/app/globals.css`, design tokens are defined so Tailwind and ad-hoc classes stay consistent:

```css
@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);

  --color-bg:        #030d0e;
  --color-surface:   rgb(255 255 255 / 0.03);
  --color-surface-2: rgb(255 255 255 / 0.055);
  --color-text-hi:   #f0fdfa;
  --color-text-mid:  #94a3b8;
  --color-text-lo:   #475569;
  --color-teal:      #14b8a6;
  --color-teal-lo:   #0d9488;
  --color-indigo:    #6366f1;
  --color-teal-dim:  rgb(20 184 166 / 0.12);
  --color-teal-glow: rgb(20 184 166 / 0.08);
}
```

### 3.2 Base styles

- `:root { color-scheme: dark; }`
- `body`: background `#030d0e`, color `#f0fdfa`, antialiased, `min-height: 100vh`
- Scrollbar: 5px, track `#030d0e`, thumb teal with opacity

### 3.3 Reusable utility classes

Defined in `globals.css` and used across pages:

| Class           | Purpose |
|-----------------|--------|
| `.hero-grid`    | Dot grid background (radial dots, 32px) |
| `.gradient-text`| Teal → white → teal animated gradient for hero name |
| `.bento-card`   | Card with surface bg, border, hover glow/ring and slight lift |
| `.orb`, `.orb-sky`, `.orb-indigo` | Ambient background blurs (teal + indigo) |
| `.tech-pill`    | Tech stack pill (teal tint, rounded-full) |
| `.tag-pill`     | Small uppercase label pill (nav/section tags) |
| `.nav-dot`      | 4px teal dot for nav indicator |

### 3.4 Layout pattern (inner pages)

Inner pages (Now, Uses, Photos, etc.) share:

1. **Background:** `fixed inset-0 z-0 bg-[#030d0e]` + `.orb.orb-sky` + `.orb.orb-indigo`
2. **Wrapper:** `relative z-10 min-h-screen` with `fontFamily: 'var(--font-inter), system-ui, sans-serif'`
3. **Top bar:** Fixed, `bg-[rgba(3,9,17,0.88)] backdrop-blur-xl`, border-bottom, with Back link and page label (e.g. “RM / Now”)
4. **Content:** `max-w-3xl mx-auto px-5 sm:px-8 pt-24 pb-24`
5. **Section labels:** Small uppercase teal text + gradient line
6. **Cards:** `rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)]` with hover border/glow
7. **Badge:** `inline-flex ... rounded-full bg-[rgba(20,184,166,0.08)] border border-[rgba(20,184,166,0.18)] text-[#2dd4bf]`

### 3.5 Fonts (Next.js layout)

In `src/app/layout.tsx`:

- Inter and JetBrains Mono loaded via `next/font/google` with `variable: '--font-inter'` and `--font-jetbrains-mono`.
- Layout uses `className` or `style={{ fontFamily: 'var(--font-inter), ...' }}` so all pages inherit the brand type.

### 3.6 Metadata & OG

- **metadataBase:** `https://ratnesh-maurya.com`
- **themeColor:** `#030d0e`
- **OG/Twitter:** Title, description, `og:image` per route (root and section-specific `opengraph-image.tsx`).
- **OG image style:** Same palette (background `#030d0e`, gradient, dot grid, teal glow, teal accent text). Implemented in `src/app/opengraph-image.tsx` and `src/lib/og-image.tsx` (`buildOgImage`).

---

## 4. Full setup checklist (portfolio)

- [ ] **globals.css:** `@theme` tokens, base body, scrollbar, `.hero-grid`, `.gradient-text`, `.bento-card`, `.orb*`, `.tech-pill`, `.tag-pill`, `.nav-dot`
- [ ] **layout.tsx:** Inter + JetBrains Mono, `metadataBase`, `themeColor`, default OG image
- [ ] **Per-route:** `opengraph-image.tsx` where needed; use `buildOgImage` for sections
- [ ] **Inner pages:** Shared background (orbs), top bar, content width, section/card styles
- [ ] **Footer:** Bento quote card, teal border-left, nav + socials, “Ratnesh Maurya” in teal

---

## 5. Applying the theme to the blog (or other sub-products)

Use this to keep blog.ratnesh-maurya.com (or any sub-product) visually aligned with the portfolio.

### 5.1 Copy design tokens

In the blog’s global CSS (e.g. Tailwind v4 or main stylesheet):

1. **Colors:** Copy the same hex and `rgb(...)` values from §2.1 into your theme (Tailwind `@theme` or CSS variables).
2. **Fonts:** Load Inter and JetBrains Mono the same way (e.g. Next.js `next/font/google` with the same `variable` names) and set `--font-sans` / `--font-mono` to those variables.
3. **Base:** `color-scheme: dark`; body background `#030d0e`, color `#f0fdfa`; same scrollbar styling if you control it.

### 5.2 Reuse utility classes

If the blog uses the same stack (e.g. Next + Tailwind):

- Copy from portfolio `globals.css`: `.hero-grid`, `.gradient-text`, `.bento-card`, `.orb-sky`, `.orb-indigo`, `.tech-pill`, `.tag-pill` (and any keyframes like `orb-teal`, `orb-indigo`, `gradient-sweep`).
- Use the same class names on the blog so headers, cards, and tags look consistent.

If the blog uses a different stack (e.g. Hugo, Astro, another CMS):

- Define the same **values** in that stack’s theme (e.g. Hugo `params` or Astro/Tailwind config).
- Recreate the same **components**: top bar (Back + “Blog” label), section labels (uppercase teal + line), card style (surface, border, hover), badge style (rounded-full, teal border/bg).
- Optionally reuse the same **class names** by pasting the relevant CSS into the blog’s global styles.

### 5.3 Layout structure on the blog

- **Background:** Full-bleed `#030d0e` with optional orbs (`.orb-sky`, `.orb-indigo`) for key pages.
- **Header:** Fixed or sticky bar with logo/link “Ratnesh Maurya” (teal), nav links (mid gray, teal on hover), and optional “Back to portfolio” → ratnesh-maurya.com.
- **Content width:** Match portfolio (e.g. `max-w-3xl` for articles).
- **Typography:** Inter body; JetBrains Mono for code blocks.
- **Links:** Default `#94a3b8`, hover `#2dd4bf` or `#14b8a6`.
- **Cards/lists:** Same border and surface as portfolio cards; teal left border for blockquotes if you use them.

### 5.4 OG images on the blog

- **Option A (recommended):** Use the same **visual style** as the portfolio OG images:
  - Background: `linear-gradient(135deg, #030d0e 0%, #061a1a 50%, #030d0e 100%)`
  - Dot grid: `radial-gradient(circle, rgba(20,184,166,0.15) 1px, transparent 1px)`, 40px
  - Radial glow: teal `rgba(20,184,166,0.12)` circle
  - Text: title in `#f0fdfa`, subtitle/breadcrumb in `#64748b` / `#475569`, accent `#14b8a6`
  - Breadcrumb: “blog.ratnesh-maurya.com › [Section]” or “blog.ratnesh-maurya.com”
- **Option B:** If the blog has a different generator (e.g. serverless function), pass the same hex values and layout (title + subtitle + optional breadcrumb) so OG images feel like one family.

### 5.5 Metadata and cross-links

- **metadataBase:** `https://blog.ratnesh-maurya.com` (or the blog’s canonical origin).
- **themeColor:** `#030d0e`.
- **Cross-links:** In blog header/footer, link “Portfolio” → `https://ratnesh-maurya.com`; in portfolio, link “Blog” → `https://blog.ratnesh-maurya.com` (already done in nav and Footer).

### 5.6 Blog-specific checklist

- [ ] Add same color tokens and fonts to blog theme.
- [ ] Reuse or recreate: top bar, section labels, card style, badge/pill style.
- [ ] Set body and scrollbar to match portfolio.
- [ ] OG images: same palette and layout (title, subtitle, optional breadcrumb).
- [ ] metadataBase and themeColor set for the blog domain.
- [ ] Header/footer link to ratnesh-maurya.com; portfolio already links to blog.

---

## 6. Quick reference — hex values

```text
#030d0e   background
#f0fdfa   text primary
#94a3b8   text secondary
#64748b   text muted
#475569   text low
#334155   text lowest
#14b8a6   teal primary
#2dd4bf   teal light
#99f6e4   teal lighter
#0d9488   teal dark
#6366f1   indigo
```

Use these in any sub-product (blog, tools) so all properties feel like one brand.

---

## 7. OG image generation logic (for blog or LLM)

**Should you give this file to the LLM for OG?** Yes. You can give the whole `documentation.md` to an LLM when building the blog so it has brand + theme + this section. For OG-only tasks, giving **§2 (theme)**, **§5.4 (OG on blog)**, and **§7** is enough.

The following is a **stack-agnostic specification** of how OG images are generated. Implement it in the blog with whatever you use (Next.js `opengraph-image.tsx`, Vercel OG, Puppeteer, Canvas, or a serverless image API).

### 7.1 Constants

- **Dimensions:** 1200 × 630 px (standard OG/Twitter card).
- **Output:** PNG.
- **Accent (primary):** `#14b8a6` (teal). Optional override per page (e.g. section colour).

### 7.2 Layer order (bottom to top)

Draw in this order so overlapping is correct:

1. **Background**
2. **Dot grid** (full bleed, behind content)
3. **Radial glow** (centred, behind content)
4. **Content block** (breadcrumb, title, subtitle, optional badge)

### 7.3 Layer specs

**1. Background**

- Full size: 1200 × 630.
- CSS: `linear-gradient(135deg, #030d0e 0%, #061a1a 50%, #030d0e 100%)`.
- Alternative (slightly bluer, used on portfolio home): `linear-gradient(135deg, #030d0e 0%, #060f20 50%, #030d0e 100%)`.

**2. Dot grid**

- Position: absolute, full area (inset 0).
- Pattern: radial gradient dots.
  - With hex accent: use accent + alpha for dot colour, e.g. `accent + "22"` (hex alpha 0.13) or `rgba(20,184,166,0.15)`.
  - Dot: circle, 1px, then transparent.
- Size: 40 × 40 px repeat.
- Opacity: 0.4–0.5 on the whole layer.

**3. Radial glow**

- Position: centred; vertical centre at ~30–50% from top (e.g. `top: 30%` or `50%`, `left: 50%`, `transform: translate(-50%, -50%)` or `translate(-50%, -60%)`).
- Size: circle, 600–700 px diameter.
- Fill: radial gradient, centre = accent with low alpha (e.g. `accent + "18"` = 0.09, or `rgba(20,184,166,0.12)`), fading to transparent by ~65% radius.
- No border; blur optional (1px is enough if your engine supports it).

**4. Content block**

- Position: relative (above glow). Padding from edges: 64 px.
- Layout: vertical flex, align start, justify end (content at bottom-left). Gap between elements: 12–16 px.

**4a. Breadcrumb (optional)**

- Shown for section/post pages; can omit for home.
- Format: `[site] › [section]` e.g. `blog.ratnesh-maurya.com › Blog` or `blog.ratnesh-maurya.com › [Post title]`.
- Style: font size 16, colour `#475569` for site; separator `#334155`; section/post in accent.
- Spacing: 8 px between items.

**4b. Title**

- Main heading. One line or wrap; keep to 1–2 lines if possible.
- Font size: 72 px (section pages) or 80 px (home); weight 800; letter-spacing -2; line-height 1.
- Colour: `#f0fdfa`.
- Optional (home only): gradient text `linear-gradient(135deg, #f0fdfa 0%, #2dd4bf 45%, #14b8a6 100%)` with background-clip text.

**4c. Subtitle**

- One line under the title.
- Font size: 26–28 px; weight 400–500; colour `#64748b` or `#94a3b8`.
- Margin top: 4–8 px.

**4d. URL or badge (optional)**

- **URL line:** e.g. `ratnesh-maurya.com` or `blog.ratnesh-maurya.com`. Font size 18, colour `#334155`; margin top 8 px.
- **Badge (section style):** pill with dot + text e.g. “Ratnesh Maurya” or “Go · Elixir · Cloud Native”. Background `accent + "14"` (0.08) or `rgba(20,184,166,0.1)`, border `accent + "33"` (0.2) or `rgba(20,184,166,0.25)`, border-radius 100, padding 6 px 16 px. Dot: 8×8 circle, accent fill. Text: 14 px, weight 600, accent colour; letter-spacing 1 for short tags.

### 7.4 Two variants

**A. Home / default (single brand image)**

- No breadcrumb.
- Badge: “Go · Elixir · Cloud Native” (or similar).
- Title: “Ratnesh Maurya” (large, optionally gradient).
- Subtitle: “Backend Engineer · Go · Elixir · Kubernetes”.
- URL line: “ratnesh-maurya.com”.

**B. Section or post (parameterised)**

- **Inputs:** `title`, `subtitle`, `breadcrumb` (optional), `siteLabel` (e.g. `blog.ratnesh-maurya.com`), `accent` (default `#14b8a6`).
- Breadcrumb: `[siteLabel]` or `[siteLabel] › [breadcrumb]`.
- Title: page or post title (72 px).
- Subtitle: short description or tagline.
- Badge: “Ratnesh Maurya” (or same as home) at bottom of content block.

### 7.5 Fonts

- OG renderers often use system fonts. Use `system-ui, -apple-system, sans-serif` so the logic is portable. If your engine supports custom fonts (e.g. Next.js `ImageResponse` with `fonts`), you can load Inter for the title/subtitle to match the site.

### 7.6 Implementation checklist for blog

- [ ] Output 1200×630 PNG.
- [ ] Background gradient, dot grid, radial glow, then content (same order as §7.2).
- [ ] Use same hex values and accent from §2 / §6.
- [ ] Home OG: no breadcrumb; title + subtitle + URL/badge as in §7.4 A.
- [ ] Post/section OG: breadcrumb + title + subtitle + badge; accept `title`, `subtitle`, `breadcrumb`, `siteLabel`.
- [ ] Set `og:image` (and Twitter `summary_large_image`) to the generated image URL for each page.
