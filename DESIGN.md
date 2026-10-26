# DESIGN.md — "Ledger" design system

A portable spec of this site's design language, reverse-engineered from the source
(`src/app/globals.css`, `src/app/layout.tsx`, `src/components/*`). Drop this file into another
repo and give it to a developer or an LLM to build new pages that look like the same product,
or to rebrand it (see [§ 0 Rebrand guide](#0-rebrand-guide)).

- Values are exact from code unless marked `(inferred)`.
- The source has no 50–950 colour scales; those are inferred, with every observed value kept as an anchor.
- Stack the source uses: Next.js (App Router), Tailwind v4 (CSS-first), `next/font/google`, `lucide-react`.

---

## 0. Rebrand guide

The system has two layers. **Rebrand the identity layer; keep the structural layer.**

### Identity layer (swap these)

| Item | Ledger value | Where it lives |
|---|---|---|
| Brand gradient (two stops) | marigold `#FF7A18` → kumkum `#E8336D` | `--marigold`, `--kumkum`, `--saffron` |
| Accent text (light / dark) | `#B83A3E` / `#DD5755` | `--accent` (the coral from the middle of the gradient) |
| Kicker colour (light / dark) | `#C21E56` / `#FF7FA6` | `--rose` |
| Spot colours | peacock `#FFB347`, neel `#C2185B` | `--peacock`, `--neel` (dusk sky, 404) |
| Neutral tint | warm yellow-brown ink/paper | `--bg`, `--text`, `--line`, … |
| Display font | Instrument Serif | `--font-display` |
| Body font | Geist | `--font-sans` |
| Label/data font | JetBrains Mono | `--font-mono` |
| Script font | Tiro Devanagari Hindi (watermarks) | `--font-deva` |
| Cultural motifs | Devanagari watermark, "buti" divider, handloom ornament | `.lg-rail`, `.wordmark`, `.buti`, `kasavu.ts` |
| Voice | dry, first-person, engineer-to-engineer | §9 |

### Structural layer (keep these)

- Tokens are semantic roles (`--bg`, `--surface`, `--text`, `--muted`, `--line`, `--rule`, `--accent`, `--pill`), and components only reference roles.
- Editorial layout: hairline rules, numbered sections, mono kickers, serif display, one gradient word per heading.
- Pills for every control, `--r-lg` cards with one soft shadow, translucent header, dot grid and glow under the first screen.
- Motion limited to colour, border and opacity at `.15s ease`.
- Dark is the default theme; every colour token needs a light and a dark value.

### Rebrand checklist

1. Pick two brand stops and replace `--marigold` / `--kumkum` (keep the 500 steps as the gradient ends). Re-derive `--accent` and `--rose` for AA contrast on both `--bg` values (≥ 4.5:1 for text).
2. Re-tint the neutrals: keep the same lightness steps (ink 50 → 950 in §2), change only hue/chroma. Keep the same hue across all of them.
3. Swap the three font variables. Keep the roles: display = headings only, sans = reading, mono = labels/data. If the new brand has no script font, delete `--font-deva`, `.lg-rail`, `.wordmark`.
4. Remove or replace the Indian motifs (Devanagari watermark, buti divider, kasavu ornaments, `--water`/`--water-2` can then be dropped).
5. Replace `--peacock` / `--neel` (used only by the dusk sky and 404 numeral) or delete the sky.
6. Rewrite microcopy to the new voice (§9). Keep the patterns (sentence case, mono kickers, arrow glyphs).
7. Re-run the contrast table in §10 for every text/background pair you changed.
8. Update `theme-color` in the viewport meta to the new dark `--bg`.

### Prompt to give an LLM for a rebrand

> Read DESIGN.md. Keep the structural layer in §0 exactly. Rebrand the identity layer to: *{brand name, two brand colours, tone words, display/body/mono fonts}*. Output the updated `:root` / `[data-theme="dark"]` token blocks first, then apply them to the components. Do not add colours outside the token set.

---

## 1. Design philosophy

**Principles**

1. Editorial broadsheet: content is organised by hairline rules and `§ 0N` numbered sections, not boxes.
2. Serif display with mono labels; one italic word per heading carries the brand gradient.
3. Warm paper and ink, never cool grey; every neutral shares one tint.
4. The brand gradient is a gradient or a small dot, never a large flat area.
5. Depth comes from soft ambient glow, a dot grid and a faint shadow, not heavy elevation.
6. Dark is the default theme; light is opt-in.
7. Cultural identity is quiet: watermarks and ornament, never clip-art.

**Mood:** editorial, warm, precise, confident, unhurried.

**Deliberately avoids:** cool grey/blue neutrals; saturated flat accent blocks; heavy drop shadows; sans-serif display type; rounded-rectangle buttons; icon-heavy UI; emoji; bouncy or parallax motion; stock illustration.

---

## 2. Color system

### 2.1 Palettes

**Marigold (brand / accent)**

| Step | Hex | Note |
|---|---|---|
| 50 | `#FFF5EB` | (inferred) |
| 100 | `#FFE8D1` | (inferred) |
| 200 | `#FFD0A3` | (inferred) |
| 300 | `#FFA866` | (formerly dark `--accent`) |
| 400 | `#FF8F3D` | (inferred) |
| **500** | **`#FF7A18`** | observed: `--marigold` |
| 600 | `#E65F00` | (inferred) |
| 700 | `#C24A0A` | (inferred) |
| 800 | `#B4381A` | (formerly light `--accent`) |
| 900 | `#7F2610` | (inferred) |
| 950 | `#4A1409` | (inferred) |

**Kumkum (secondary / rose)**

| Step | Hex | Note |
|---|---|---|
| 50 | `#FFF0F4` | (inferred) |
| 100 | `#FFDCE7` | (inferred) |
| 200 | `#FFB9CF` | (inferred) |
| 300 | `#FF7FA6` | observed: dark `--rose` |
| 400 | `#F55A8A` | (inferred) |
| **500** | **`#E8336D`** | observed: `--kumkum` |
| 600 | `#D42660` | (inferred) |
| 700 | `#C21E56` | observed: light `--rose` |
| 800 | `#9A1745` | (inferred) |
| 900 | `#6E1032` | (inferred) |
| 950 | `#420A1E` | (inferred) |

**Coral (accent):** the colour halfway along the marigold → kumkum gradient. Dark `--accent` is `#DD5755`, sampled from the gradient heading word. Light `--accent` is `#B83A3E`, the same hue made deeper, because `#DD5755` is only 3.6:1 on the light paper.

**Spot colours (single values):** peacock/amber `#FFB347`, neel/magenta `#C2185B`, ok/green `#1FA463`.

**Ink / paper (warm neutral)**

| Step | Hex | Role |
|---|---|---|
| 50 | `#FBFAF7` | light bg |
| 100 | `#F6F3EC` | surface-2 |
| 200 | `#EFEBE3` | line-2 |
| 250 | `#D9D4C8` | numerals, outline-button border |
| 300 | `#E7E3DA` | line |
| 400 | `#B3AEA3` | faint (decorative only) |
| 500 | `#6B675E` | muted |
| 600 | `#4A463E` | body |
| 700 | `#3D3A33` | secondary |
| 800 | `#2F2B25` | dark line |
| 900 | `#17150F` | ink |
| 950 | `#0E0D0B` | dark bg |

### 2.2 Semantic tokens (light → dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FBFAF7` | `#0E0D0B` | page |
| `--surface` | `#FFFFFF` | `#17150F` | cards |
| `--surface-2` | `#F6F3EC` | `#1F1C17` | tags, code, hover |
| `--glass` | `rgba(255,255,255,.72)` | `rgba(23,21,15,.72)` | blurred panels |
| `--text` | `#17150F` | `#F3F0E8` | headings, strong text |
| `--body` | `#4A463E` | `#C9C4B8` | paragraphs |
| `--secondary` | `#3D3A33` | `#D6D1C5` | nav links, tag text |
| `--muted` | `#6B675E` | `#A39E92` | captions, labels |
| `--faint` | `#B3AEA3` | `#6B675E` | decorative dashes only |
| `--line` | `#E7E3DA` | `#2F2B25` | hairlines |
| `--line-2` | `#EFEBE3` | `#26231E` | inner dividers |
| `--rule` | `#17150F` | `#F3F0E8` | section top rules, active underline |
| `--accent` | `#B83A3E` | `#DD5755` | links, CTAs, focus ring (gradient mid-coral) |
| `--rose` | `#C21E56` | `#FF7FA6` | kickers, section labels |
| `--pill` | `#17150F` | `#F3F0E8` | primary button fill |
| `--on-pill` | `#FBFAF7` | `#17150F` | text on primary button |
| `--marigold`, `--kumkum`, `--peacock`, `--neel`, `--ok` | same in both | | fills and gradients only |
| `--num` | `#D9D4C8` | `#3A362F` | big § numerals |
| `--water` | `#F1EDE4` | `#16140F` | hero script rail |
| `--water-2` | `#ECE8DF` | `#1C1A15` | footer wordmark |
| `--hover` | `#F6F3EC` | `#1A1814` | row hover |
| `--tag-bg` | `#F4F1EA` | `#24211C` | small tag |
| `--panel` | `#17150F` | `#1A1814` | inverted ink panel |
| `--panel-text` / `--panel-body` / `--panel-muted` | `#F3F0E8` / `#C9C4B8` / `#A39E92` | same | text on panel |
| `--panel-line` / `--panel-line-2` | `#3A362F` / `#2F2B25` | same | panel rules |
| `--heat-0` | `#ECE8DF` | `#24211C` | empty heatmap cell |
| `--heat-1…4` | `rgba(255,122,24,.32)`, `rgba(255,122,24,.68)`, `rgba(232,51,109,.85)`, `#E8336D` | same | heatmap levels |
| `--dot` | `rgba(23,21,15,.085)` | `rgba(110,105,89,.06)` | dot grid |
| `--glow-1` | `rgba(255,122,24,.10)` | `rgba(255,122,24,.10)` | top glow (marigold) |
| `--glow-2` | `rgba(232,51,109,.07)` | `rgba(232,51,109,.08)` | top glow (kumkum) |
| `--sky-alpha` | `.55` | `.35` | dusk-sky opacity |

There are no dedicated warning / error / info tokens. Use `--rose` for error/bad, `--accent` for positive text in code traces, and `--ok` for a live-status dot. Warning and info are not defined `(inferred: use marigold-600 / ink-500)`.

### 2.3 Text colours

- Primary: `--text`. Secondary: `--body`, `--secondary`. Muted: `--muted`.
- On pill button: `--on-pill`. On ink panel: `--panel-text`.
- On paper button inside a panel: `#17150F`.

### 2.4 Usage rules

- The gradient `linear-gradient(90deg, #FF7A18, #E8336D)` is allowed only on: one italic heading word, 8–10px dots, 2px top hairlines, the 2px email underline, and the blurred orb.
- `--rose` is only for mono eyebrows and kickers.
- `--accent` is for inline links, text CTAs ("Read more →"), highlighted numbers and the focus ring. It is the coral from the middle of the gradient, so links read as part of the same brand colour as the gradient words. Link hover goes to `--muted`, never to a brighter colour.
- Marigold and kumkum are never text colour at body size and never a flat fill larger than a dot.
- Selection: `background: #FF7A18; color: #17150F`.

---

## 3. Typography

**Families (Google Fonts via `next/font`)**

- Display: Instrument Serif 400 + italic. Stack: `var(--font-instrument), Georgia, 'Times New Roman', serif`.
- Sans: Geist 400/500/600. Stack: `var(--font-geist), system-ui, -apple-system, 'Segoe UI', sans-serif`.
- Mono: JetBrains Mono 400/500. Stack: `var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace`.
- Script: Tiro Devanagari Hindi 400. Stack: `var(--font-tiro), var(--font-instrument), serif`. Applied via `[lang="hi"]`.
- Body base: 17px / 1.6 (16px at ≤720px). `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility`.

**Scale**

| Level | Family | Size | LH | Wt | Tracking |
|---|---|---|---|---|---|
| Hero H1 | Display | `clamp(72px,13vw,196px)` | .88 | 400 | -.04em |
| H2 xl (contact) | Display | `clamp(48px,7vw,100px)` | .95 | 400 | -.03em |
| Page H1 | Display | `clamp(46px,7.4vw,88px)` | 1 | 400 | -.02em |
| H2 section | Display | `clamp(40px,5.4vw,72px)` | 1 | 400 | -.02em |
| H2 sub | Display | `clamp(30px,3.6vw,42px)` | 1 | 400 | -.02em |
| Role h3 | Display | 36px | 1 | 400 | 0 |
| Story h3 | Display | `clamp(32px,3.4vw,44px)` | 1.05 | 400 | -.01em |
| Card h3 | Display | `clamp(26px,2.9vw,36px)` | 1.12 | 400 | -.03em |
| Row h3 / project title | Display | 30px | 1.1 | 400 | 0 / -.03em |
| Post title | Display | 28px | 1.15 | 400 | 0 |
| Lead paragraph | Display | `clamp(26px,2.6vw,32px)` | 1.2 | 400 | 0 |
| Big number | Display | 60 / 56 / 40 / 30px | 1 | 400 | 0 |
| Logo wordmark | Display | 26px (footer 28px) | 1 | 400 | -.01em |
| Lede | Sans | `clamp(18px,1.9vw,21px)` | 1.6 | 400 | 0 |
| Body | Sans | 17px | 1.6 | 400 | 0 |
| Body-sm | Sans | 15 / 14.5 / 14px | 1.6 | 400 | 0 |
| UI heading h3 | Sans | 21px | 1.3 (inferred) | 600 | -.01em |
| List-item title | Sans | 19px | 1.35 | 600 | 0 |
| Button | Sans | 16px (sm 15px) | 1 | 500 | 0 |
| Nav link | Sans | 14px | n/a | 400 | 0 |
| Eyebrow | Mono | 12.5px | 1.3 | 500 | .14em, UPPERCASE |
| Kicker | Mono | 12px | 1.4 | 400 | .08em, no caps |
| Mono caption | Mono | 12px | 1.7 | 400 | 0 |
| Footer column head | Mono | 11px | 1.3 | 400 | .08em, UPPERCASE |
| Tag | Mono | 12.5px | 1 | 500 | 0 |
| Small tag | Mono | 11.5px | 1.4 | 400 | 0 |
| Code / trace | Mono | 13px / 14px | 1.65 / 1.9 | 400 | 0 |

**Rules**

- Headings are always Display at weight 400 with tight negative tracking. Never bold a heading.
- Wrap one word of a heading in `<em>` to get the italic gradient. One word per heading.
- Use `text-wrap: balance` on headings and `pretty` on paragraphs. Cap ledes at `60ch`.
- Dates, counts, ids, paths, tags and kickers are Mono.
- Large numerals are Display, with the label *below* (`flex-direction: column-reverse` on `dd`/`dt`).
- UI titles and list-item titles are Sans 600, not Display.

---

## 4. Spacing & layout

- **Base unit:** 4px `(inferred)`. Observed steps: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 72, 96. Even numbers only; some fall off the 8px grid.
- **Wrapper:** `width: min(1200px, 100% - 2 * var(--gutter)); margin-inline: auto`. Gutter `clamp(16px, 4vw, 48px)`.
- **Breakpoints:** 1100 (hide hire pill and script rail), 1000 (masonry to 2 columns), 900 (two-column to one), 760 (header wraps, nav scrolls), 720/700 (mobile body size and paddings), 520 (single column, small discs).
- **Grids:** `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` is the standard responsive grid (N = 180–440). Fixed 2-column card grids use `gap: 18–20px`.
- **Section rhythm:** `padding-block: 96px 24px` (72px on mobile); gap between section head and content 40px (32px mobile). Each section opens with `border-top: 1px solid var(--rule)` plus 16px top padding. Page head: `clamp(48px, 8vw, 96px)` top, `clamp(28px, 4vw, 48px)` bottom. `h2.sub`: 72px top, 22px bottom margin. Footer margin-top `clamp(48px, 8vw, 96px)`.
- **Card padding:** 28–36px (mobile 22–26px). List rows: 22–32px vertical.
- **Z-index:** header 50, floating button 60, lightbox 80/81, skip link 100.

---

## 5. Shape & depth

**Radius**

| Value | Use |
|---|---|
| 999px | all buttons, chips, tags, pills, inputs `(inferred)` |
| 28px | ink contact panel |
| 26px (`--r-lg`) | cards, glass cards, post list |
| 22px | lead-story block |
| 20px | stats panel |
| 18px (`--r-md`) | inner cards, code blocks, popover, photos |
| 14px | screenshot frames |
| 12px (`--r-sm`) | tiles, lightbox image |
| 6px | small tag, focus ring |
| 2.5px | heatmap cells |
| 50% | dots, theme toggle, avatar discs |

**Borders:** 1px solid `--line` by default. 1px solid `--rule` for section tops and the footer top. 1px dashed `--line` for the copy button and trace-link divider. Outline buttons use `--num`. Active nav link: 1px bottom border in `--rule`.

**Shadow**

- `--shadow` light: `0 1px 2px rgba(23,21,15,.04), 0 10px 30px rgba(23,21,15,.06)`.
- `--shadow` dark: `0 1px 2px rgba(0,0,0,.3), 0 12px 32px rgba(0,0,0,.38)`.
- Floating pill: `0 10px 30px rgba(30,20,40,.16)`.
- Popover: `0 18px 48px rgba(30,20,40,.2)`.
- Hover on an elevated row: `0 0 0 1px var(--line), var(--shadow)`.
- Effectively two levels: flat with a hairline, or `--shadow`.

**Blur and translucency**

- Header: `color-mix(in srgb, var(--bg) 88%, transparent)` + `blur(12px)`.
- Ghost button: `--glass` + `blur(8px)`.
- Glass card: `--glass` + `blur(16px) saturate(1.3)`, border `color-mix(in srgb, var(--line) 80%, transparent)`.
- Floating pill: `blur(14px)`.
- Lightbox backdrop: `rgba(10,10,16,.9)`.

**Textures and gradients**

- Dot grid on body: `radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 1.4px)` at `22px 22px`.
- Top glow (`body::before`, 900px tall): `ellipse 46% 60% at 88% 0%` and `ellipse 30% 40% at 6% 2%` in `--glow-1`; `ellipse 36% 46% at 62% 6%` in `--glow-2`; each fading to transparent at 70%.
- Dusk sky (`.sky`, 820px; `.sky-soft` 560px at 60% of the opacity): four ellipses — marigold 75%, kumkum 55%, peacock 50%, neel 28% (`color-mix(in srgb, var(--x) N%, transparent)`), `filter: blur(46px)`, mask `linear-gradient(to bottom, #000 38%, transparent 94%)`.
- Orb: 520px circle with the gradient, `blur(110px)`, `opacity .42`, bleeding off the corner of an ink panel.
- Glass-card hairline: 2px gradient bar inset 24px each side at `top: -1px`, `opacity .85`.
- Noise: none.
- Ornament: 200×24 "buti-and-lozenge" divider (SVG data-URI) above page titles.

---

## 6. Motion

- **Animated:** button/chip background, colour and border (`.15s ease`); row hover background (`.15s ease`); the email underline growing 0 → 100% via `background-size` (`.3s ease`); the live-status dot pulse (`opacity 1 → .25`, `2s infinite`); smooth anchor scroll with `scroll-padding-top: 96px`.
- **Never animated:** layout, scale, translate, shadows. No page transitions.
- **Hover:** colour or border shift only. Links go to `--muted`; outline buttons go to a `--text`/`--rule` border; primary buttons mix 16–18% brand colour in: `color-mix(in srgb, var(--pill) 82%, var(--kumkum))`.
- **Press:** no distinct active state (not observed).
- **Focus:** instant `2px solid var(--accent)` ring.
- **Reduced motion:** all transitions and animations drop to `.01ms`; smooth scroll turns off.
- **Easing:** `ease` (≈ `cubic-bezier(.25,.1,.25,1)`). No custom curves.
- Known gap: the source references `animation: dusk-drift 12s ease-in-out infinite alternate` but defines no `@keyframes dusk-drift`, so it does nothing. If you want it, add a `background-position` keyframe (the gradient is `background-size: 200% 100%`).

---

## 7. Iconography & imagery

- **Icons:** `lucide-react`, outline, `strokeWidth` 1.8, `aria-hidden`. Sizes 15 / 16 / 18 / 20px. Used: Sun, Moon, Check, Copy, X, ArrowUpRight, FileText. Sparse; usually paired with text.
- **Text glyphs:** mono `→` and `↗` stand in for icons.
- **Dots:** 7px status dot, 8–10px gradient bullet.
- **Images:** screenshots at 16/10 or 16/9.2, `object-fit: cover; object-position: top`, 14px or 26px radius, 1px `--line` border, `--surface-2` placeholder. Photo wall is masonry (3 / 2 / 1 columns, 16px gap, 18px radius, `--shadow`, `zoom-in` cursor). No overlays or filters. Logos sit on white discs (46 / 28 / 64px) with a 1px `--line` ring. No illustration style.

---

## 8. Components

### Button (pill, `border: 1px solid transparent`, `gap: 10px`)

- **Primary** (`.btn-primary`, `.lg-btn-ink`): bg `--pill`, text `--on-pill`; hover mixes 16–18% brand colour in. Padding `15px 26px`, 16px/500. Small: `10px 18px`, 15px.
- **Ghost** (`.btn-ghost`): `--glass` bg, `--line` border, `blur(8px)`; hover border `--text`.
- **Outline** (`.lg-btn`): `--surface` bg, `--num` border, padding `14px 22px`, 15px/500; hover border `--rule`.
- **On-panel:** `paper` (`--panel-text` bg, `#17150F` text, hover `#fff`) and `line` (transparent, `--panel-line` border, hover `--panel-muted`).
- **Disabled / loading:** not defined `(inferred: opacity .5, cursor not-allowed; swap label for a mono "…")`.
- **Focus:** global ring.

### Input / Select / Toast (not present)

`(inferred)`:

- Input: pill, `--surface` bg, 1px `--line` border, 12–16px padding, 16px Sans. Hover and focus border `--rule`; focus ring is the global `--accent` outline. Error uses `--rose`.
- Select: same as input with a lucide chevron at 16px.
- Toast: `--glass` pill, popover shadow, bottom-right, with the 2px gradient hairline.

### Card

- **Standard:** `--surface`, `--r-lg`, `--shadow`, padding 28–30px. Anatomy: mono kicker row (first item `--rose`), Display h3, muted body, tags pushed to the bottom with `margin-top: auto`.
- **Glass:** `.glass` with the gradient hairline.
- **Image card:** image on top, 24/26px body padding.
- **Lead story:** split block, 22px radius, 1px border; text left, ink "facts" panel right (60px numerals, 1px `--panel-line` tops).
- **List item:** 18px radius, `--shadow`, 3-column grid; hover adds a 1px ring.

### Navbar

- Sticky, 64px min height, translucent with blur, 1px bottom border.
- Brand: lowercase word in Display 26px with a 10px gradient dot before it.
- Nav: 14px links, 26px gap, `margin-left: auto`. Active: `--text` with a 1px `--rule` underline. Hover: `--muted`.
- Status pill: 13px, `--surface`, 1px `--line` border, pulsing 7px `--ok` dot. Hidden ≤1100px.
- Theme toggle: 36px circle, 1px `--line` border, 18px icon. (Below 44px touch target; use 44px+ in new work.)
- Mobile (≤760px): nav drops to its own row and scrolls horizontally with the scrollbar hidden.

### Footer

- 1px `--rule` top border; `auto-fit` columns (min 180px, 32px gap).
- Brand block with a 13px muted note.
- Column heads: 11px mono uppercase. Links: 14px `--text`.
- Base row: huge script wordmark (`clamp(64px,10vw,140px)`, colour `--water-2`, not selectable), right-aligned note and a pill button.

### Modal / popover

- **Lightbox:** fixed, `rgba(10,10,16,.9)`, white 46px round controls.
- **Popover:** 360px max, `--surface`, 18px radius, 18px padding, popover shadow, gradient hairline, Display 20px title, 30px round close button.
- **Trigger:** glass pill with overlapping 28px logo discs (-9px overlap), bottom-right.

### Badge / tag

- Tag: mono 12.5/500, pill, `--surface-2` bg, `--muted` text, padding `7px 10px`.
- Small tag: 6px radius, `--tag-bg` bg, `--secondary` text, mono 11.5px.
- Strikethrough chip: `line-through`, `--surface-2`.

### Tabs / filter chips

- Sans 14/500, pill, `10px 16px`, 1px `--line` border, `--surface` bg, `--muted` text.
- Hover: text and border to `--text`.
- Selected (`aria-pressed="true"`): `--pill` bg and border, `--on-pill` text.

### Table (row table)

- Flex rows, 1px `--line` top border, 26px vertical padding.
- Three flex columns: mono kind (180px basis), main (Display h3 + body), side mono (200px basis). Hover fills `--hover` (`.15s`).
- Roles and posts use the same pattern with a 180px mono date column.

### Empty state

Muted paragraph. The 404 is a gradient numeral in the script font plus a "terminal trace" card (three coloured dots in the title bar, mono body, pill links).

### Code block

`--surface-2` bg, 1px `--line` border, 18px radius, mono 13/1.65, 20–22px padding.

---

## 9. Voice & microcopy

- Dry, first-person, engineer-to-engineer, lightly wry. Example: "Hiring? I build backends that still hold at 2 a.m."
- Sentence case for body and buttons. Section labels: lowercase mono kickers or uppercase mono eyebrows. Nav labels: single Title-case nouns.
- Buttons are short noun/verb phrases with an arrow glyph (`→`, `↗`); no exclamation marks.
- Numbering uses `§ 01`, `§ 02` and roman numerals in lists.
- Em-dashes as list markers and in prose. Real diacritics.
- Technical metaphors in status copy ("still hiring-ready, still shipping").

When rebranding, keep these patterns and change the personality.

---

## 10. Accessibility

- **Documented contrast on `--bg`** (from the CSS header): light — text 17.5, body 9.0, muted 5.4, accent 5.4, rose 5.6; dark — text 17.1, body 11.2, muted 7.3, accent 5.2, rose 8.2. All pass AA.
- **Pill button:** `#FBFAF7` on `#17150F` ≈ 17:1 (dark mode inverted).
- **Fails AA (decorative only):** `--faint` on bg (~2:1), `--num` numerals, marigold/kumkum as text. Gradient italic words are large display type, but marigold on the light bg is ≈ 2.5:1, below even the 3:1 large-text bar. Treat them as decorative or keep dark mode the default.
- **Focus ring:** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 6px }`.
- Skip link, `aria-current="page"`, `aria-pressed` on chips, `aria-label` on icon buttons, `lang` attribute on non-Latin text are all present.
- **Touch targets:** buttons ≈ 46–52px tall; theme toggle 36px (too small); chips ≈ 34px. Use ≥ 44px for new controls.

---

## 11. Implementation tokens

### 11a. CSS custom properties

```css
:root {
  color-scheme: light;
  --bg:#FBFAF7; --surface:#FFFFFF; --surface-2:#F6F3EC; --glass:rgba(255,255,255,.72);
  --text:#17150F; --body:#4A463E; --secondary:#3D3A33; --muted:#6B675E; --faint:#B3AEA3;
  --line:#E7E3DA; --line-2:#EFEBE3; --rule:#17150F;
  --accent:#B83A3E; --rose:#C21E56; --pill:#17150F; --on-pill:#FBFAF7;
  --marigold:#FF7A18; --kumkum:#E8336D; --peacock:#FFB347; --neel:#C2185B; --ok:#1FA463;
  --num:#D9D4C8; --water:#F1EDE4; --water-2:#ECE8DF; --hover:#F6F3EC; --tag-bg:#F4F1EA;
  --panel:#17150F; --panel-text:#F3F0E8; --panel-body:#C9C4B8; --panel-muted:#A39E92;
  --panel-line:#3A362F; --panel-line-2:#2F2B25;
  --heat-0:#ECE8DF; --heat-1:rgba(255,122,24,.32); --heat-2:rgba(255,122,24,.68);
  --heat-3:rgba(232,51,109,.85); --heat-4:#E8336D;
  --sky-alpha:.55; --dot:rgba(23,21,15,.085);
  --glow-1:rgba(255,122,24,.10); --glow-2:rgba(232,51,109,.07);
  --shadow:0 1px 2px rgba(23,21,15,.04), 0 10px 30px rgba(23,21,15,.06);

  --font-display:var(--font-instrument), Georgia, 'Times New Roman', serif;
  --font-sans:var(--font-geist), system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono:var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-deva:var(--font-tiro), var(--font-instrument), serif;

  --saffron:linear-gradient(90deg, var(--marigold), var(--kumkum));
  --wrap:1200px; --gutter:clamp(16px, 4vw, 48px);
  --r-lg:26px; --r-md:18px; --r-sm:12px;
  --dur-fast:.15s; --dur-med:.3s; --ease:ease;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg:#0E0D0B; --surface:#17150F; --surface-2:#1F1C17; --glass:rgba(23,21,15,.72);
  --text:#F3F0E8; --body:#C9C4B8; --secondary:#D6D1C5; --muted:#A39E92; --faint:#6B675E;
  --line:#2F2B25; --line-2:#26231E; --rule:#F3F0E8;
  --accent:#DD5755; --rose:#FF7FA6; --pill:#F3F0E8; --on-pill:#17150F;
  --num:#3A362F; --water:#16140F; --water-2:#1C1A15; --hover:#1A1814; --tag-bg:#24211C;
  --panel:#1A1814; --panel-line:#3A362F;
  --heat-0:#24211C; --sky-alpha:.35; --dot:rgba(110,105,89,.06);
  --glow-1:rgba(255,122,24,.10); --glow-2:rgba(232,51,109,.08);
  --shadow:0 1px 2px rgba(0,0,0,.3), 0 12px 32px rgba(0,0,0,.38);
}
```

Dark is the default: render `<html data-theme="dark">` on the server and let a tiny pre-paint script override it from `localStorage` for visitors who chose light:

```js
try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}
```

### 11b. Tailwind

**Tailwind v4 (what this repo uses, CSS-first):**

```css
@import "tailwindcss";

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-text: var(--text);
  --color-body: var(--body);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-rule: var(--rule);
  --color-accent: var(--accent);
  --color-rose: var(--rose);
  --color-pill: var(--pill);
  --color-on-pill: var(--on-pill);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 26px;
  --shadow-card: var(--shadow);
}
```

**Tailwind v3-style `tailwind.config.js` (`theme.extend`):**

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', surface: 'var(--surface)', 'surface-2': 'var(--surface-2)',
        text: 'var(--text)', body: 'var(--body)', secondary: 'var(--secondary)',
        muted: 'var(--muted)', faint: 'var(--faint)',
        line: 'var(--line)', 'line-2': 'var(--line-2)', rule: 'var(--rule)',
        accent: 'var(--accent)', rose: 'var(--rose)',
        pill: 'var(--pill)', 'on-pill': 'var(--on-pill)',
        panel: {
          DEFAULT: 'var(--panel)', text: 'var(--panel-text)', body: 'var(--panel-body)',
          muted: 'var(--panel-muted)', line: 'var(--panel-line)',
        },
        marigold: { 50:'#FFF5EB',100:'#FFE8D1',200:'#FFD0A3',300:'#FFA866',400:'#FF8F3D',500:'#FF7A18',600:'#E65F00',700:'#C24A0A',800:'#B4381A',900:'#7F2610',950:'#4A1409' },
        kumkum:   { 50:'#FFF0F4',100:'#FFDCE7',200:'#FFB9CF',300:'#FF7FA6',400:'#F55A8A',500:'#E8336D',600:'#D42660',700:'#C21E56',800:'#9A1745',900:'#6E1032',950:'#420A1E' },
        ink:      { 50:'#FBFAF7',100:'#F6F3EC',200:'#EFEBE3',300:'#E7E3DA',400:'#B3AEA3',500:'#6B675E',600:'#4A463E',700:'#3D3A33',800:'#2F2B25',900:'#17150F',950:'#0E0D0B' },
        peacock: '#FFB347', neel: '#C2185B', ok: '#1FA463',
      },
      fontFamily: {
        display: ['var(--font-instrument)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-geist)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        deva: ['var(--font-tiro)', 'var(--font-instrument)', 'serif'],
      },
      fontSize: {
        eyebrow: ['12.5px', { lineHeight: '1.3', letterSpacing: '.14em' }],
        kicker: ['12px', { lineHeight: '1.4', letterSpacing: '.08em' }],
        body: ['17px', { lineHeight: '1.6' }],
        'body-sm': ['15px', { lineHeight: '1.6' }],
        lede: ['clamp(18px,1.9vw,21px)', { lineHeight: '1.6' }],
        h2: ['clamp(40px,5.4vw,72px)', { lineHeight: '1', letterSpacing: '-.02em' }],
        h1: ['clamp(46px,7.4vw,88px)', { lineHeight: '1', letterSpacing: '-.02em' }],
        hero: ['clamp(72px,13vw,196px)', { lineHeight: '.88', letterSpacing: '-.04em' }],
      },
      borderRadius: { sm: '12px', md: '18px', lg: '26px', xl: '28px', pill: '999px' },
      boxShadow: {
        card: 'var(--shadow)',
        float: '0 10px 30px rgba(30,20,40,.16)',
        pop: '0 18px 48px rgba(30,20,40,.2)',
      },
      backgroundImage: { saffron: 'linear-gradient(90deg,#FF7A18,#E8336D)' },
      maxWidth: { wrap: '1200px', lede: '60ch' },
      spacing: { gutter: 'clamp(16px,4vw,48px)' },
      transitionDuration: { fast: '150ms', med: '300ms' },
      screens: { xs: '520px', sm: '720px', md: '900px', lg: '1100px' },
    },
  },
};
```

### 11c. `design-tokens.json` (W3C design-token format)

Light is `$value`; dark is in `$extensions.mode.dark`.

```json
{
  "color": {
    "$type": "color",
    "bg":        { "$value": "#FBFAF7", "$extensions": { "mode": { "light": "#FBFAF7", "dark": "#0E0D0B" } } },
    "surface":   { "$value": "#FFFFFF", "$extensions": { "mode": { "light": "#FFFFFF", "dark": "#17150F" } } },
    "surface-2": { "$value": "#F6F3EC", "$extensions": { "mode": { "light": "#F6F3EC", "dark": "#1F1C17" } } },
    "text":      { "$value": "#17150F", "$extensions": { "mode": { "light": "#17150F", "dark": "#F3F0E8" } } },
    "body":      { "$value": "#4A463E", "$extensions": { "mode": { "light": "#4A463E", "dark": "#C9C4B8" } } },
    "secondary": { "$value": "#3D3A33", "$extensions": { "mode": { "light": "#3D3A33", "dark": "#D6D1C5" } } },
    "muted":     { "$value": "#6B675E", "$extensions": { "mode": { "light": "#6B675E", "dark": "#A39E92" } } },
    "faint":     { "$value": "#B3AEA3", "$extensions": { "mode": { "light": "#B3AEA3", "dark": "#6B675E" } } },
    "line":      { "$value": "#E7E3DA", "$extensions": { "mode": { "light": "#E7E3DA", "dark": "#2F2B25" } } },
    "line-2":    { "$value": "#EFEBE3", "$extensions": { "mode": { "light": "#EFEBE3", "dark": "#26231E" } } },
    "rule":      { "$value": "#17150F", "$extensions": { "mode": { "light": "#17150F", "dark": "#F3F0E8" } } },
    "accent":    { "$value": "#B83A3E", "$extensions": { "mode": { "light": "#B83A3E", "dark": "#DD5755" } } },
    "rose":      { "$value": "#C21E56", "$extensions": { "mode": { "light": "#C21E56", "dark": "#FF7FA6" } } },
    "pill":      { "$value": "#17150F", "$extensions": { "mode": { "light": "#17150F", "dark": "#F3F0E8" } } },
    "on-pill":   { "$value": "#FBFAF7", "$extensions": { "mode": { "light": "#FBFAF7", "dark": "#17150F" } } },
    "num":       { "$value": "#D9D4C8", "$extensions": { "mode": { "light": "#D9D4C8", "dark": "#3A362F" } } },
    "water":     { "$value": "#F1EDE4", "$extensions": { "mode": { "light": "#F1EDE4", "dark": "#16140F" } } },
    "water-2":   { "$value": "#ECE8DF", "$extensions": { "mode": { "light": "#ECE8DF", "dark": "#1C1A15" } } },
    "hover":     { "$value": "#F6F3EC", "$extensions": { "mode": { "light": "#F6F3EC", "dark": "#1A1814" } } },
    "tag-bg":    { "$value": "#F4F1EA", "$extensions": { "mode": { "light": "#F4F1EA", "dark": "#24211C" } } },
    "panel":     { "$value": "#17150F", "$extensions": { "mode": { "light": "#17150F", "dark": "#1A1814" } } },
    "panel-text":  { "$value": "#F3F0E8" },
    "panel-body":  { "$value": "#C9C4B8" },
    "panel-muted": { "$value": "#A39E92" },
    "panel-line":  { "$value": "#3A362F" },
    "marigold": {
      "50": { "$value": "#FFF5EB" }, "100": { "$value": "#FFE8D1" }, "200": { "$value": "#FFD0A3" },
      "300": { "$value": "#FFA866" }, "400": { "$value": "#FF8F3D" }, "500": { "$value": "#FF7A18" },
      "600": { "$value": "#E65F00" }, "700": { "$value": "#C24A0A" }, "800": { "$value": "#B4381A" },
      "900": { "$value": "#7F2610" }, "950": { "$value": "#4A1409" }
    },
    "kumkum": {
      "50": { "$value": "#FFF0F4" }, "100": { "$value": "#FFDCE7" }, "200": { "$value": "#FFB9CF" },
      "300": { "$value": "#FF7FA6" }, "400": { "$value": "#F55A8A" }, "500": { "$value": "#E8336D" },
      "600": { "$value": "#D42660" }, "700": { "$value": "#C21E56" }, "800": { "$value": "#9A1745" },
      "900": { "$value": "#6E1032" }, "950": { "$value": "#420A1E" }
    },
    "ink": {
      "50": { "$value": "#FBFAF7" }, "100": { "$value": "#F6F3EC" }, "200": { "$value": "#EFEBE3" },
      "300": { "$value": "#E7E3DA" }, "400": { "$value": "#B3AEA3" }, "500": { "$value": "#6B675E" },
      "600": { "$value": "#4A463E" }, "700": { "$value": "#3D3A33" }, "800": { "$value": "#2F2B25" },
      "900": { "$value": "#17150F" }, "950": { "$value": "#0E0D0B" }
    },
    "peacock": { "$value": "#FFB347" },
    "neel":    { "$value": "#C2185B" },
    "ok":      { "$value": "#1FA463" }
  },
  "gradient": {
    "saffron": {
      "$type": "gradient",
      "$value": [ { "color": "#FF7A18", "position": 0 }, { "color": "#E8336D", "position": 1 } ]
    }
  },
  "fontFamily": {
    "$type": "fontFamily",
    "display": { "$value": ["Instrument Serif", "Georgia", "Times New Roman", "serif"] },
    "sans":    { "$value": ["Geist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
    "mono":    { "$value": ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"] },
    "script":  { "$value": ["Tiro Devanagari Hindi", "Instrument Serif", "serif"] }
  },
  "typography": {
    "$type": "typography",
    "hero":    { "$value": { "fontFamily": "{fontFamily.display}", "fontSize": "clamp(72px,13vw,196px)", "fontWeight": 400, "lineHeight": 0.88, "letterSpacing": "-0.04em" } },
    "h1":      { "$value": { "fontFamily": "{fontFamily.display}", "fontSize": "clamp(46px,7.4vw,88px)", "fontWeight": 400, "lineHeight": 1, "letterSpacing": "-0.02em" } },
    "h2":      { "$value": { "fontFamily": "{fontFamily.display}", "fontSize": "clamp(40px,5.4vw,72px)", "fontWeight": 400, "lineHeight": 1, "letterSpacing": "-0.02em" } },
    "h3":      { "$value": { "fontFamily": "{fontFamily.display}", "fontSize": "30px", "fontWeight": 400, "lineHeight": 1.1, "letterSpacing": "0" } },
    "lede":    { "$value": { "fontFamily": "{fontFamily.sans}", "fontSize": "clamp(18px,1.9vw,21px)", "fontWeight": 400, "lineHeight": 1.6, "letterSpacing": "0" } },
    "body":    { "$value": { "fontFamily": "{fontFamily.sans}", "fontSize": "17px", "fontWeight": 400, "lineHeight": 1.6, "letterSpacing": "0" } },
    "body-sm": { "$value": { "fontFamily": "{fontFamily.sans}", "fontSize": "15px", "fontWeight": 400, "lineHeight": 1.6, "letterSpacing": "0" } },
    "button":  { "$value": { "fontFamily": "{fontFamily.sans}", "fontSize": "16px", "fontWeight": 500, "lineHeight": 1, "letterSpacing": "0" } },
    "eyebrow": { "$value": { "fontFamily": "{fontFamily.mono}", "fontSize": "12.5px", "fontWeight": 500, "lineHeight": 1.3, "letterSpacing": "0.14em" } },
    "kicker":  { "$value": { "fontFamily": "{fontFamily.mono}", "fontSize": "12px", "fontWeight": 400, "lineHeight": 1.4, "letterSpacing": "0.08em" } }
  },
  "dimension": {
    "$type": "dimension",
    "radius-sm": { "$value": "12px" },
    "radius-md": { "$value": "18px" },
    "radius-lg": { "$value": "26px" },
    "radius-xl": { "$value": "28px" },
    "radius-pill": { "$value": "999px" },
    "wrap": { "$value": "1200px" },
    "section-gap": { "$value": "96px" },
    "section-gap-mobile": { "$value": "72px" },
    "card-pad": { "$value": "28px" },
    "touch-min": { "$value": "44px" },
    "blur-header": { "$value": "12px" },
    "blur-ghost": { "$value": "8px" },
    "blur-glass": { "$value": "16px" },
    "blur-sky": { "$value": "46px" },
    "blur-orb": { "$value": "110px" }
  },
  "shadow": {
    "$type": "shadow",
    "card": {
      "$value": [
        { "color": "rgba(23,21,15,0.04)", "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px" },
        { "color": "rgba(23,21,15,0.06)", "offsetX": "0px", "offsetY": "10px", "blur": "30px", "spread": "0px" }
      ],
      "$extensions": {
        "mode": {
          "dark": [
            { "color": "rgba(0,0,0,0.3)", "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px" },
            { "color": "rgba(0,0,0,0.38)", "offsetX": "0px", "offsetY": "12px", "blur": "32px", "spread": "0px" }
          ]
        }
      }
    },
    "float": { "$value": { "color": "rgba(30,20,40,0.16)", "offsetX": "0px", "offsetY": "10px", "blur": "30px", "spread": "0px" } },
    "pop":   { "$value": { "color": "rgba(30,20,40,0.2)",  "offsetX": "0px", "offsetY": "18px", "blur": "48px", "spread": "0px" } }
  },
  "duration": {
    "$type": "duration",
    "fast":  { "$value": "150ms" },
    "med":   { "$value": "300ms" },
    "pulse": { "$value": "2000ms" }
  },
  "cubicBezier": {
    "$type": "cubicBezier",
    "ease": { "$value": [0.25, 0.1, 0.25, 1] }
  }
}
```

---

## 12. Do / Don't rules

1. **Do** set every heading in the display serif at weight 400 with negative tracking. **Don't** bold it or use a sans display face.
2. **Do** italicise exactly one word per heading with the brand gradient (`<em>`). **Don't** gradient a whole heading or body text.
3. **Do** use only token variables for colour so both themes work. **Don't** hardcode hex in components.
4. **Do** keep neutrals warm and single-tint. **Don't** use Tailwind greys/slate or pure `#000` / `#fff` page backgrounds.
5. **Do** make every button, chip and tag a pill (999px). **Don't** use rounded rectangles for controls.
6. **Do** give the primary button `--pill` bg and `--on-pill` text. **Don't** fill a button with a brand colour.
7. **Do** open each section with a 1px `--rule` line, a mono `§ 0N` kicker and a display H2. **Don't** use coloured banners or boxed section headers.
8. **Do** put dates, counts, ids and eyebrows in the mono font (11–12.5px). **Don't** set them in the sans.
9. **Do** use cards of `--surface` + `--r-lg` + `--shadow` with 28px padding. **Don't** stack heavier shadows or add coloured borders.
10. **Do** separate list rows with 1px `--line` hairlines and a `--hover` background on hover. **Don't** add card chrome per row.
11. **Do** keep motion to colour, border and opacity changes at `.15s ease`, and honour `prefers-reduced-motion`. **Don't** add scale, slide-in, parallax or bounce.
12. **Do** keep dark as the default and test both themes. **Don't** add a colour without both a light and a dark value.
13. **Do** use the `--accent` 2px outline (3px offset) as the focus ring. **Don't** remove outlines.
14. **Do** use outline icons at stroke 1.8, sized 15–20px, and text arrows where possible. **Don't** use filled icons, emoji or illustrations.
15. **Do** cap line length (`60ch` ledes) and use `text-wrap: balance` / `pretty`. **Don't** run copy full-width.
16. **Do** make new controls at least 44px tall. **Don't** copy the 36px theme toggle.

---

## 13. Reference snippet

A self-contained hero + card + button built only from the tokens above (dark by default). It loads the same Google Fonts the site uses.

```html
<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ledger sample</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
:root{
  --bg:#FBFAF7;--surface:#fff;--surface-2:#F6F3EC;--text:#17150F;--body:#4A463E;--muted:#6B675E;
  --line:#E7E3DA;--rule:#17150F;--accent:#B83A3E;--rose:#C21E56;--pill:#17150F;--on-pill:#FBFAF7;
  --marigold:#FF7A18;--kumkum:#E8336D;--dot:rgba(23,21,15,.085);
  --glow-1:rgba(255,122,24,.10);--glow-2:rgba(232,51,109,.07);
  --shadow:0 1px 2px rgba(23,21,15,.04),0 10px 30px rgba(23,21,15,.06);
  --font-display:'Instrument Serif',Georgia,serif;
  --font-sans:'Geist',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,monospace;
  --saffron:linear-gradient(90deg,var(--marigold),var(--kumkum));
  --r-lg:26px;--gutter:clamp(16px,4vw,48px)}
:root[data-theme=dark]{
  --bg:#0E0D0B;--surface:#17150F;--surface-2:#1F1C17;--text:#F3F0E8;--body:#C9C4B8;--muted:#A39E92;
  --line:#2F2B25;--rule:#F3F0E8;--accent:#DD5755;--rose:#FF7FA6;--pill:#F3F0E8;--on-pill:#17150F;
  --dot:rgba(110,105,89,.06);--glow-2:rgba(232,51,109,.08);
  --shadow:0 1px 2px rgba(0,0,0,.3),0 12px 32px rgba(0,0,0,.38)}
*{box-sizing:border-box}
body{margin:0;position:relative;isolation:isolate;color:var(--text);
  background:var(--bg) radial-gradient(circle at 1px 1px,var(--dot) 1px,transparent 1.4px) 0 0/22px 22px;
  font:17px/1.6 var(--font-sans);-webkit-font-smoothing:antialiased}
body::before{content:'';position:absolute;z-index:-1;inset:0 0 auto;height:900px;pointer-events:none;
  background:radial-gradient(ellipse 46% 60% at 88% 0%,var(--glow-1),transparent 70%),
             radial-gradient(ellipse 36% 46% at 62% 6%,var(--glow-2),transparent 70%)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
.wrap{width:min(1200px,100% - 2*var(--gutter));margin-inline:auto}
.eyebrow{font:500 12.5px/1.3 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.display{font-family:var(--font-display);font-weight:400;letter-spacing:-.02em;line-height:1;margin:0;text-wrap:balance}
.display em{font-style:italic;background-image:var(--saffron);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.06em}
.hero{padding-block:clamp(48px,8vw,96px) 40px}
.hero .display{font-size:clamp(46px,7.4vw,88px);margin-top:10px}
.lede{font-size:clamp(18px,1.9vw,21px);color:var(--muted);max-width:60ch;margin:18px 0 24px;text-wrap:pretty}
.btn{display:inline-flex;align-items:center;gap:10px;padding:15px 26px;border-radius:999px;border:1px solid transparent;
  background:var(--pill);color:var(--on-pill);font:500 16px/1 var(--font-sans);text-decoration:none;
  transition:background-color .15s ease}
.btn:hover{background:color-mix(in srgb,var(--pill) 82%,var(--kumkum))}
.sec{padding-block:48px;display:grid;gap:24px}
.head{padding-top:16px;border-top:1px solid var(--rule)}
.card{border-radius:var(--r-lg);background:var(--surface);box-shadow:var(--shadow);padding:30px;
  display:flex;flex-direction:column;gap:14px;max-width:520px}
.card .kick{font:500 12.5px/1.3 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--rose)}
.card h3{margin:0;font:400 clamp(26px,2.9vw,36px)/1.12 var(--font-display);letter-spacing:-.03em;text-wrap:balance}
.card p{margin:0;color:var(--muted)}
.tag{display:inline-block;font:500 12.5px/1 var(--font-mono);padding:7px 10px;border-radius:999px;background:var(--surface-2);color:var(--muted)}
</style>
</head>
<body>
<main class="wrap">
  <header class="hero">
    <span class="eyebrow">Field notes</span>
    <h1 class="display">Systems that keep <em>quiet</em> at night</h1>
    <p class="lede">Warm paper, ink rules and one saffron accent. Everything else stays out of the way.</p>
    <a class="btn" href="#work">Read the notes →</a>
  </header>
  <section class="sec" id="work">
    <div class="head"><span class="eyebrow">§ 01 · Work</span></div>
    <article class="card">
      <span class="kick">Case study</span>
      <h3>A ledger that reconciles itself</h3>
      <p>Rules instead of boxes, mono for the facts, serif for the voice.</p>
      <div><span class="tag">go</span> <span class="tag">postgres</span></div>
    </article>
  </section>
</main>
</body>
</html>
```

---

## Appendix: source notes

- `.nf-num` uses `animation: dusk-drift` with no `@keyframes` defined (see §6).
- `--dusk` is a legacy alias of `--saffron`; use `--saffron` in new code.
- The "Kasavu" palette in `src/lib/kasavu.ts` (`#6E5110`, `#2F5D50`, `#A6812F`, …) drives only SVG ornaments and the Open Graph frame. It is not part of the UI colour system.
- Source of truth for tokens: `src/app/globals.css`. Fonts: `src/app/layout.tsx`.
