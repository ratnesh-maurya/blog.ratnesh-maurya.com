# Blog's By Ratnesh

A modern, SEO-optimized blog built with Next.js, featuring markdown-based content management and a dedicated "Silly Questions" section for sharing coding mistakes and learnings.

## 🚀 Features

- **Modern Design**: Clean, responsive design inspired by Medium
- **Markdown-Based**: Write blog posts and silly questions in markdown
- **SEO Optimized**: Comprehensive SEO with meta tags, structured data, sitemap, and RSS feed
- **Static Export**: Fully static site generation for fast loading and easy deployment
- **Table of Contents**: Automatic TOC generation for blog posts
- **Syntax Highlighting**: Beautiful code highlighting for technical content
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Optimized for performance with Next.js

## 📁 Project Structure

```
├── content/
│   ├── blog/           # Blog posts in markdown
│   └── silly-questions/ # Silly questions in markdown
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript types
└── public/             # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to see your blog.

## ✍️ Adding Content

### Blog Posts

Create a new markdown file in `content/blog/` with frontmatter:

```markdown
---
title: "Your Blog Post Title"
description: "A brief description of your post"
date: "2024-01-15"
author: "Ratnesh Maurya"
tags: ["Next.js", "React", "Web Development"]
category: "Web Development"
featured: true
image: "/images/your-image.jpg"
---

# Your Blog Post Content

Write your blog post content here using markdown...
```

### Silly Questions

Create a new markdown file in `content/silly-questions/` with frontmatter:

```markdown
---
question: "Why does my code work in my head but not on the computer?"
date: "2024-01-12"
tags: ["debugging", "beginner-mistakes"]
category: "Debugging"
---

**The Answer:** You probably forgot to save the file! 🤦‍♂️

Write your answer here...
```

## 🚀 Deployment

### Static Export

This blog is configured for static export, making it easy to deploy anywhere:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

### Deployment Options

1. **Vercel** (Recommended):
   - Connect your GitHub repository to Vercel
   - Automatic deployments on push

2. **Netlify**:
   - Drag and drop the `out/` folder to Netlify

3. **GitHub Pages**:
   - Push the `out/` folder to a `gh-pages` branch

4. **Any Static Host**:
   - Upload the `out/` folder to your hosting provider

## 🔧 Configuration

### SEO Settings

Update the metadata in `src/app/layout.tsx` and individual page files to customize SEO settings for your domain.

### Domain Configuration

Update the base URL in:
- `src/app/sitemap.ts`
- `src/app/feed.xml/route.ts`
- `src/components/StructuredData.tsx`

## 📝 Content Management

This blog uses a simple file-based content management system:

1. Write posts in markdown
2. Add frontmatter for metadata
3. Push to your repository
4. Automatic deployment (if configured)

## 🎨 Customization

- **Styling**: Modify `src/app/globals.css` for custom styles
- **Components**: Update components in `src/components/`
- **Layout**: Modify `src/app/layout.tsx` for site-wide changes
- **Colors**: Update Tailwind classes throughout the components

## 📊 SEO Features

- Automatic sitemap generation
- RSS feed
- Structured data (JSON-LD)
- Open Graph meta tags
- Twitter Card meta tags
- Optimized meta descriptions
- Canonical URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you have questions or need help, feel free to:
- Open an issue on GitHub
- Visit [ratnesh-maurya.com](https://ratnesh-maurya.com)

---

Built with ❤️ by [Ratnesh Maurya](https://ratnesh-maurya.com)
