# Deployment Guide

This blog is configured for static export and can be deployed to any static hosting service.

## Quick Deployment Options

### 1. Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy
4. Set up custom domain: `blog.ratnesh-maurya.com`

### 2. Netlify

1. Build the site: `npm run build`
2. Drag and drop the `out/` folder to [Netlify](https://netlify.com)
3. Or connect your GitHub repository for automatic deployments

### 3. GitHub Pages

1. Build the site: `npm run build`
2. Push the `out/` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

### 4. Any Static Host

The `out/` folder contains all static files and can be uploaded to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Firebase Hosting
- Surge.sh
- Any web server

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Serve built files locally
npm run serve
```

## Environment Configuration

Update these URLs in the following files for your domain:

### `src/app/sitemap.ts`
```typescript
const baseUrl = 'https://your-domain.com';
```

### `src/app/feed.xml/route.ts`
```typescript
const baseUrl = 'https://your-domain.com';
```

### `src/components/StructuredData.tsx`
```typescript
url: 'https://your-domain.com',
```

### `src/app/layout.tsx`
```typescript
openGraph: {
  url: "https://your-domain.com",
  // ...
},
```

## Custom Domain Setup

### For blog.ratnesh-maurya.com:

1. **DNS Configuration:**
   - Add a CNAME record: `blog` → `your-host.com`
   - Or A record pointing to your hosting provider's IP

2. **Vercel Custom Domain:**
   - Go to Project Settings → Domains
   - Add `blog.ratnesh-maurya.com`
   - Follow DNS configuration instructions

3. **SSL Certificate:**
   - Most hosting providers (Vercel, Netlify) provide automatic SSL
   - Certificate will be issued for your custom domain

## Content Management Workflow

1. **Add new blog post:**
   ```bash
   # Create new file
   touch content/blog/my-new-post.md
   
   # Add frontmatter and content
   # Commit and push
   git add .
   git commit -m "Add new blog post"
   git push
   ```

2. **Add silly question:**
   ```bash
   # Create new file
   touch content/silly-questions/my-mistake.md
   
   # Add frontmatter and content
   # Commit and push
   ```

3. **Automatic deployment:**
   - Push to main branch triggers automatic deployment
   - New content appears live within minutes

## Performance Optimization

The blog is already optimized for performance:

- ✅ Static site generation
- ✅ Optimized images (when using Next.js Image component)
- ✅ Minimal JavaScript bundle
- ✅ CSS optimization
- ✅ Automatic code splitting

## SEO Checklist

- ✅ Sitemap generated at `/sitemap.xml`
- ✅ RSS feed at `/feed.xml`
- ✅ Robots.txt at `/robots.txt`
- ✅ Structured data (JSON-LD)
- ✅ Open Graph meta tags
- ✅ Twitter Card meta tags
- ✅ Semantic HTML structure

## Monitoring

Consider adding:

1. **Google Analytics** - Track visitors and page views
2. **Google Search Console** - Monitor search performance
3. **Vercel Analytics** - Built-in performance monitoring
4. **Lighthouse CI** - Automated performance testing

## Backup Strategy

1. **Content backup:** All content is in Git repository
2. **Database backup:** Not needed (static site)
3. **Asset backup:** Store images in Git or external CDN

## Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run lint`
- Verify all markdown files have valid frontmatter
- Ensure all imports are correct

### Pages Not Loading
- Check that all required files are in the `out/` directory
- Verify routing configuration
- Check browser console for errors

### SEO Issues
- Validate structured data with [Google's Rich Results Test](https://search.google.com/test/rich-results)
- Check sitemap at `/sitemap.xml`
- Verify meta tags in page source

## Support

If you encounter issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review the build logs for errors
3. Test locally with `npm run build && npm run serve`
4. Check hosting provider documentation

---

Happy blogging! 🚀
