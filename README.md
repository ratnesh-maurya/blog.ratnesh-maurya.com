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

### Writing a New Blog Post

To add a new blog post, simply create a new markdown file in the `content/blog/` directory. Follow these guidelines to ensure consistency and proper formatting.

#### 1. File Naming Convention

- **Location**: Create your file in `content/blog/`
- **Extension**: Must be a `.md` file
- **Filename Format**: Use **Title-Case-with-dashes** (no spaces)
  - ✅ Good: `Amazon-SNS-for-Cost-Reduction-and-Message-Delivery-Assurance-in-Startups.md`
  - ✅ Good: `Architectural-Design-for-a-Ride-App-such-as-OLA-UBER-RAPIDO.md`
  - ❌ Bad: `amazon sns.md` or `Amazon_SNS.md`

#### 2. Frontmatter Structure

Every blog post **must start** with YAML frontmatter between `---` lines. Here's the complete template:

```markdown
---
title: "Your Blog Post Title"
description: "A concise, SEO-friendly summary (1-2 sentences) that describes what readers will learn from this post."
date: "2024-01-15"
author: "Ratnesh Maurya"
category: "Web Development"
tags: ["Next.js", "React", "Web Development"]
image: "/images/blog/your-image-file.jpg"
featured: false
questions: ["How to compress a 20GB file to 15GB?", "How compression works?", "What is the best compression algorithm?"]
---
```

**Frontmatter Fields Explained:**

- **title** (required): The main title of your blog post. Should be descriptive and SEO-friendly.
- **description** (required): A brief summary (1-2 sentences) used for meta descriptions and previews.
- **date** (required): Publication date in `"YYYY-MM-DD"` format (as a string).
- **author** (required): Usually `"Ratnesh Maurya"`. Keep consistent spelling.
- **category** (required): A single high-level category. Examples: `"AWS"`, `"Web Development"`, `"System Design"`, `"Go"`, `"DevOps"`.
- **tags** (required): Array of specific topics/tags. Examples: `["Amazon S3", "S3 Policies"]`, `["Next.js", "Markdown"]`. Use consistent casing.
- **image** (required): Path to the featured image under `/public/images/blog/`. Example: `"/images/blog/Understanding-S3-and-S3-Policies.jpg"`.
- **featured** (optional): Set to `true` only if you want this post to appear as featured on the homepage. Default: `false`.
- **questions** (optional): Array of SEO-related questions that will appear in FAQ structured data for better search engine visibility. These questions are **not displayed** on the blog page itself, but help with SEO rich snippets. Examples:
  - `["How to compress a 20GB file to 15GB?", "How compression works?"]`
  - `["What is Amazon SNS?", "How does SNS reduce costs?"]`

#### 3. Content Structure

After the frontmatter, write your blog post content in markdown:

```markdown
# Your Blog Post Title

Start with a brief introduction (1-3 paragraphs) explaining:
- What the post is about
- Who it's for
- What readers will learn

## Main Section Heading

Use `##` for main sections. The blog automatically generates a Table of Contents from headings.

### Subsection Heading

Use `###` for subsections. Avoid going deeper than `####` unless necessary.

### Code Examples

Always specify the language for syntax highlighting:

\`\`\`bash
npm install
\`\`\`

\`\`\`json
{
  "key": "value"
}
\`\`\`

Use inline code with backticks for commands: \`npm run dev\`

### Images

Store images in `/public/images/blog/` and reference them:

![Alt text describing the image](/images/blog/your-image.jpg)

### Lists

- Use bullet lists for features, benefits, etc.
- Keep items concise

1. Use numbered lists for steps
2. Follow a logical order
3. Test your examples

## Conclusion

Wrap up with a summary or next steps.
```

#### 4. Best Practices

- **Headings**: Use descriptive headings (`##`, `###`) - they appear in the auto-generated Table of Contents
- **Code Blocks**: Always specify a language for proper syntax highlighting
- **Images**: Place images in `/public/images/blog/` and use descriptive alt text
- **Consistency**: Follow the style of existing posts like `building-this-blog.md` or `Understanding-S3-and-S3-Policies.md`
- **Tags**: Reuse existing tags when possible to avoid duplicates (e.g., don't mix `"S3"` and `"Amazon S3"`)

#### 5. Quick Checklist

Before committing your new blog post, verify:

- [ ] File saved in `content/blog/` with dash-separated filename
- [ ] Frontmatter includes all required fields
- [ ] `title` matches the H1 heading in content
- [ ] `date` is in `"YYYY-MM-DD"` format
- [ ] `image` path exists in `/public/images/blog/`
- [ ] Content starts with H1 heading
- [ ] Code blocks have language specified
- [ ] All links and image paths are valid

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


