---
title: "Building This Blog: A Modern Next.js Blog with Markdown"
description: "How I built this blog using Next.js, TypeScript, Tailwind CSS, and markdown for content management. A complete guide to creating a fast, SEO-optimized blog."
date: "2025-09-08"
author: "Ratnesh Maurya"
tags: ["Next.js", "Blog", "Markdown", "TypeScript", "Tailwind CSS"]
category: "Web Development"
featured: true
image: "/images/blog/building-blog.jpg"
---

# Building This Blog: A Modern Next.js Blog with Markdown

Creating a blog in 2024 requires balancing performance, SEO, and developer experience. Here's how I built this blog using modern web technologies.

## Tech Stack

I chose a modern, performant stack:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Markdown** - Simple content management
- **Static Export** - Fast, deployable anywhere

## Key Features

### 📝 Markdown-Based Content

All blog posts and silly questions are written in markdown with frontmatter:

```markdown
---
title: "Your Post Title"
description: "Post description"
date: "2024-01-20"
author: "Your Name"
tags: ["tag1", "tag2"]
category: "Category"
featured: true
---

# Your content here...
```

### 🎨 Modern Design

- Clean, Medium-inspired layout
- Responsive design that works on all devices
- Dark mode support (coming soon)
- Smooth animations and transitions

### 🚀 Performance Optimized

- Static site generation
- Optimized images and fonts
- Minimal JavaScript bundle
- Fast loading times

### 📊 SEO Optimized

- Automatic sitemap generation
- RSS feed
- Structured data (JSON-LD)
- Open Graph and Twitter Card meta tags
- Semantic HTML structure

## Content Management

The blog uses a simple file-based content management system:

```
content/
├── blog/           # Blog posts
└── silly-questions/ # Q&A content
```

### Adding New Posts

1. Create a new `.md` file in `content/blog/`
2. Add frontmatter with metadata
3. Write your content in markdown
4. Push to deploy (automatic with Vercel/Netlify)

### Table of Contents

Blog posts automatically generate a table of contents from headings:

```typescript
export function generateTableOfContents(content: string): TocItem[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/g;
  // ... implementation
}
```

## Deployment

The blog is configured for static export, making it deployable anywhere:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

### Build Process

```bash
npm run build  # Generates static files in 'out/' directory
```

## Lessons Learned

1. **Keep it simple** - Markdown + frontmatter is perfect for blogs
2. **Static is fast** - Static sites load incredibly fast
3. **SEO matters** - Proper meta tags and structured data help discoverability
4. **Developer experience** - TypeScript and good tooling make development enjoyable

## What's Next?

Future improvements planned:

- [ ] Dark mode toggle
- [ ] Search functionality
- [ ] Comment system
- [ ] Newsletter signup
- [ ] Analytics integration

## Conclusion

Building a modern blog doesn't have to be complicated. With Next.js and markdown, you can create a fast, SEO-friendly blog that's easy to maintain and deploy.

The complete source code is available on [GitHub](https://github.com/ratnesh-maurya/blog.ratnesh-maurya.com), and you can deploy your own version in minutes!

---
