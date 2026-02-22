# Open Graph Images — Setup Guide (Dynamic Generation)

This document describes how Open Graph (OG) images are set up in this Next.js project: **dynamically generated** per route using the App Router file convention and a shared builder. Use it as a reference to replicate the same pattern in another project (e.g. a blog).

---

## 1. How Next.js OG images work

- **File convention:** A file named `opengraph-image.tsx` (or `opengraph-image.js`) in a route folder **defines the OG image for that route**.
- **Route mapping:**
  - `app/opengraph-image.tsx` → serves at **`/opengraph-image`** (site default).
  - `app/blog/opengraph-image.tsx` → serves at **`/blog/opengraph-image`**.
- **Exports:** The file must **default-export** a function that returns a `ImageResponse` from `next/og`. You can also export:
  - `alt` — string (accessibility)
  - `size` — `{ width: number, height: number }` (default 1200×630)
  - `contentType` — e.g. `'image/png'`
- **Runtime:** Optional `export const runtime = 'edge'` can improve reliability on Vercel.

---

## 1.1 Runtime vs stored OG images (this project)

**Runtime-generated (on each request)**  
These routes have an `opengraph-image.tsx` that returns an `ImageResponse`; the image is generated when the URL is requested (e.g. by crawlers or when the page is shared):

| Route | File | Served at |
|-------|------|-----------|
| Root (home) | `app/opengraph-image.tsx` | `/opengraph-image` |
| Blog listing | `app/blog/opengraph-image.tsx` | `/blog/opengraph-image` |
| Blog post | `app/blog/[slug]/opengraph-image.tsx` | `/blog/{slug}/opengraph-image` |
| Blog tag | `app/blog/tag/[tag]/opengraph-image.tsx` | `/blog/tag/{tag}/opengraph-image` |
| Silly questions listing | `app/silly-questions/opengraph-image.tsx` | `/silly-questions/opengraph-image` |
| Silly question | `app/silly-questions/[slug]/opengraph-image.tsx` | `/silly-questions/{slug}/opengraph-image` |
| Technical terms listing | `app/technical-terms/opengraph-image.tsx` | `/technical-terms/opengraph-image` |
| Technical term (fallback) | `app/technical-terms/[slug]/opengraph-image.tsx` | `/technical-terms/{slug}/opengraph-image` |
| TIL listing | `app/til/opengraph-image.tsx` | `/til/opengraph-image` |
| TIL entry | `app/til/[slug]/opengraph-image.tsx` | `/til/{slug}/opengraph-image` |
| Cheatsheets listing | `app/cheatsheets/opengraph-image.tsx` | `/cheatsheets/opengraph-image` |
| Cheatsheet | `app/cheatsheets/[slug]/opengraph-image.tsx` | `/cheatsheets/{slug}/opengraph-image` |
| About, Now, Uses, Topics, Search, Newsletter, Privacy, Resources, Series, Glossary | `app/{route}/opengraph-image.tsx` | `/{route}/opengraph-image` |

**Stored (pre-built, served from disk)**  
Only **technical terms** support a stored OG image so metadata can point to a static file and avoid runtime generation for that page:

- **Where they are stored:** `public/technical-terms/{slug}.png` (e.g. `public/technical-terms/indexing.png`).
- **How they are built:** Script `scripts/build-og-technical-terms.tsx` (run at build time, e.g. in `postbuild`) generates one PNG per term from `content/technical-terms/*.md` and writes to `public/technical-terms/`.
- **How the page uses them:** In `app/technical-terms/[slug]/page.tsx`, `generateMetadata()` checks for `public/technical-terms/${slug}.png`. If it exists, `openGraph.images` and `twitter.images` are set to `https://blog.ratnesh-maurya.com/technical-terms/{slug}.png`; otherwise no static image is set and crawlers may use the runtime route `/technical-terms/{slug}/opengraph-image` if linked elsewhere.

So: **all OG images are generated at runtime** by the routes above; **only technical term pages** can use a **stored** image from `public/technical-terms/` when that file exists.

---

## 2. Project structure

```text
src/
├── app/
│   ├── layout.tsx                 # metadataBase + default openGraph.images
│   ├── opengraph-image.tsx         # Root OG image (home)
│   ├── blog/
│   │   └── opengraph-image.tsx     # /blog OG
│   ├── now/
│   │   └── opengraph-image.tsx    # /now OG
│   ├── projects/
│   │   └── opengraph-image.tsx    # etc.
│   ├── social/
│   │   └── opengraph-image.tsx
│   ├── github/
│   │   └── opengraph-image.tsx
│   ├── uses/
│   │   └── opengraph-image.tsx
│   ├── photos/
│   │   └── opengraph-image.tsx
│   └── sitemap.ts                 # Optional: list OG image URLs for crawlers
└── lib/
    └── og-image.tsx               # Shared buildOgImage() used by section routes
```

---

## 3. Root layout — wiring metadata to the image

Set **metadataBase** and point **openGraph.images** / **twitter.images** to the path where the image is served. Next.js will use the **route-specific** `opengraph-image` when a page has one (e.g. `/now` uses `/now/opengraph-image`); the root layout typically sets the **default** (home) image.

```tsx
// src/app/layout.tsx (excerpt)

const BASE_URL = 'https://ratnesh-maurya.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  openGraph: {
    // ... other openGraph fields
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,  // or '/opengraph-image' — resolved with metadataBase
        width: 1200,
        height: 630,
        alt: 'Ratnesh Maurya — Backend Engineer',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    // ...
    images: [`${BASE_URL}/opengraph-image`],
  },
};
```

- **metadataBase** is required so relative URLs (like `/opengraph-image`) become absolute.
- For **child routes** (e.g. `/now`), Next.js automatically uses that route’s OG image when you place `opengraph-image.tsx` in the route folder; you don’t need to repeat `images` in every page’s metadata unless you want to override.

---

## 4. Root OG image (home) — custom layout

The **site default** image is a custom design (name, tagline, URL). It does **not** use the shared builder.

**File:** `src/app/opengraph-image.tsx`

```tsx
import { ImageResponse } from 'next/og';

export const alt = 'Ratnesh Maurya — Backend Engineer | Go & Elixir';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #030d0e 0%, #060f20 50%, #030d0e 100%)',
          padding: '64px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(20,184,166,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.25)',
              borderRadius: 100,
              padding: '6px 16px',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#14b8a6',
              }}
            />
            <span style={{ color: '#2dd4bf', fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>
              Go · Elixir · Cloud Native
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.0,
              background: 'linear-gradient(135deg, #f0fdfa 0%, #2dd4bf 45%, #14b8a6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Ratnesh Maurya
          </div>

          {/* Title */}
          <div style={{ fontSize: 28, color: '#94a3b8', fontWeight: 500 }}>
            Backend Engineer · Go · Elixir · Kubernetes
          </div>

          {/* URL */}
          <div style={{ fontSize: 18, color: '#334155', marginTop: 8 }}>
            ratnesh-maurya.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

Optional: add at the top for Edge on Vercel:

```ts
export const runtime = 'edge';
```

---

## 5. Shared OG image builder (section pages)

Section pages (Blog, Now, Social, etc.) share one layout: **breadcrumb + title + subtitle + badge**. The builder lives in `lib/og-image.tsx`.

**File:** `src/lib/og-image.tsx`

```tsx
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

interface OgOptions {
  title: string;
  subtitle: string;
  breadcrumb?: string;   // e.g. "Now" or "Projects"
  accent?: string;       // hex accent — defaults to teal
}

export function buildOgImage({ title, subtitle, breadcrumb, accent = '#14b8a6' }: OgOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #030d0e 0%, #061a1a 50%, #030d0e 100%)',
          padding: '64px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle, ${accent}22 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }}
        />
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`,
          }}
        />
        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: '#475569' }}>
            <span>ratnesh-maurya.com</span>
            {breadcrumb && (
              <>
                <span style={{ color: '#334155' }}>›</span>
                <span style={{ color: accent }}>{breadcrumb}</span>
              </>
            )}
          </div>
          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.0,
              color: '#f0fdfa',
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          {/* Subtitle */}
          <div style={{ fontSize: 26, color: '#64748b', fontWeight: 400, marginTop: 4 }}>
            {subtitle}
          </div>
          {/* Brand badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              background: `${accent}14`,
              border: `1px solid ${accent}33`,
              borderRadius: 100,
              padding: '6px 16px',
              alignSelf: 'flex-start',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
            <span style={{ color: accent, fontSize: 14, fontWeight: 600 }}>Ratnesh Maurya</span>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
```

**API:**

| Prop         | Type   | Description |
|--------------|--------|-------------|
| `title`     | string | Main heading (e.g. "Blog", "What I'm doing now") |
| `subtitle`  | string | Line under the title |
| `breadcrumb`| string?| Shown as `site › breadcrumb` (e.g. "Now", "Blog") |
| `accent`    | string?| Hex colour for glow/breadcrumb/badge (default `#14b8a6`) |

**Note:** `${accent}22` and `${accent}18` are hex + 2-digit alpha (e.g. `#14b8a622`). For non-hex tooling use `rgba(20, 184, 166, 0.13)` and `0.09` instead.

---

## 6. Section route — using the builder

Each section has a thin `opengraph-image.tsx` that calls `buildOgImage` and re-exports `size` and `contentType` (and `alt` if you use it).

**Example:** `src/app/blog/opengraph-image.tsx`

```tsx
import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Blog — Ratn Labs by Ratnesh Maurya';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return buildOgImage({
    title: 'Ratn Labs',
    subtitle: 'Systems thinking, backend architecture & AI engineering',
    breadcrumb: 'Blog',
  });
}
```

**Example:** `src/app/now/opengraph-image.tsx`

```tsx
import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Now — Ratnesh Maurya';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return buildOgImage({
    title: "What I'm doing now",
    subtitle: 'Current focus, learning & life — updated February 2026',
    breadcrumb: 'Now',
  });
}
```

**Example:** `src/app/social/opengraph-image.tsx`

```tsx
import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Social — Ratnesh Maurya on X & LinkedIn';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return buildOgImage({
    title: 'Social',
    subtitle: 'X (Twitter) & LinkedIn — posts, updates & professional profile',
    breadcrumb: 'Social',
  });
}
```

Pattern: one file per route, default export returns `buildOgImage({ title, subtitle, breadcrumb })`.

---

## 7. Per-route metadata (optional)

Pages can override Open Graph (e.g. title/description). The **image** is taken from the route’s `opengraph-image.tsx` automatically; you only set `images` in metadata if you want to override the default.

```tsx
// src/app/now/page.tsx (excerpt)

export const metadata: Metadata = {
  title: 'Now',
  description: "...",
  alternates: { canonical: 'https://ratnesh-maurya.com/now' },
  openGraph: {
    title: 'Now — Ratnesh Maurya',
    description: "Focused on learning Go and Elixir. Backend, concurrency, OTP.",
    url: 'https://ratnesh-maurya.com/now',
    // No images: Next.js uses /now/opengraph-image automatically
  },
};
```

---

## 8. Sitemap — expose OG image URLs to crawlers

Listing OG image URLs in the sitemap helps crawlers discover them. Next.js supports an `images` array on each sitemap entry.

**File:** `src/app/sitemap.ts` (excerpt)

```ts
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0,  images: [`${BASE_URL}/opengraph-image`] },
  { url: `${BASE_URL}/projects`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9, images: [`${BASE_URL}/projects/opengraph-image`] },
  { url: `${BASE_URL}/blog`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9, images: [`${BASE_URL}/blog/opengraph-image`] },
  { url: `${BASE_URL}/github`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8, images: [`${BASE_URL}/github/opengraph-image`] },
  { url: `${BASE_URL}/social`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, images: [`${BASE_URL}/social/opengraph-image`] },
  { url: `${BASE_URL}/now`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8, images: [`${BASE_URL}/now/opengraph-image`] },
  { url: `${BASE_URL}/uses`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, images: [`${BASE_URL}/uses/opengraph-image`] },
  { url: `${BASE_URL}/photos`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6, images: [`${BASE_URL}/photos/opengraph-image`] },
];
```

---

## 9. Dynamic OG image (e.g. per blog post)

For **dynamic routes** like `app/blog/[slug]/page.tsx`, you can add **`app/blog/[slug]/opengraph-image.tsx`** and use the `params` to fetch post data and build the image.

**Example pattern:**

```tsx
// src/app/blog/[slug]/opengraph-image.tsx (example — adjust to your data source)

import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'Blog post';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug); // your data fetch
  return buildOgImage({
    title: post.title,
    subtitle: post.description ?? 'Ratn Labs',
    breadcrumb: 'Blog',
  });
}
```

If your shared `buildOgImage` doesn’t accept a `siteLabel`, you can extend it (e.g. `siteLabel: 'blog.ratnesh-maurya.com'`) and use it in the breadcrumb for the blog.

---

## 10. Checklist — replicate in another project (e.g. blog)

- [ ] Install Next.js (App Router) and use `next/og` `ImageResponse`.
- [ ] Set `metadataBase` in the root layout and add `openGraph.images` / `twitter.images` for the default image.
- [ ] Add `app/opengraph-image.tsx` for the home image (custom or via a builder).
- [ ] Add `src/lib/og-image.tsx` with `buildOgImage` (copy from §5); adjust site name/breadcrumb if needed.
- [ ] For each section route, add `app/[section]/opengraph-image.tsx` that calls `buildOgImage({ title, subtitle, breadcrumb })`.
- [ ] Optional: `export const runtime = 'edge'` in OG image files for Vercel.
- [ ] Optional: add `images` to sitemap entries for each OG image URL.
- [ ] For dynamic routes (e.g. blog posts), add `app/blog/[slug]/opengraph-image.tsx` and pass `params` into your data fetch and into `buildOgImage`.

Using this setup, every route gets a **dynamically generated** OG image; the home uses a custom layout and section pages use the shared builder with consistent branding.
