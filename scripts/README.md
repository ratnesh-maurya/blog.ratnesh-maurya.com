# OG Image Generation Script

This script generates beautiful Open Graph (OG) images for social media sharing.

## Features

✨ **Beautiful Design Elements:**
- Gradient backgrounds with multiple theme options
- Decorative geometric shapes and patterns
- Text shadows and glow effects
- Multi-line title support for long titles
- Theme-specific color schemes

🎨 **Available Themes:**
- `default` - Purple gradient with modern styling
- `blog` - Blue gradient perfect for blog posts
- `silly` - Warm gradient ideal for silly questions

## Usage

### Generate Default Images
```bash
node scripts/generate-og-images.js
```

### Generate Custom Images Programmatically
```javascript
const { generateDynamicOGImage } = require('./scripts/generate-og-images');

// Generate a custom OG image
const svg = generateDynamicOGImage(
  'Your Amazing Blog Post Title',
  'A compelling subtitle that draws readers in',
  'og',      // 'og' or 'twitter'
  'blog'     // 'default', 'blog', or 'silly'
);

// Save to file
const fs = require('fs');
fs.writeFileSync('custom-og-image.svg', svg);
```

## Generated Files

The script generates the following default images:
- `default-home-og.svg` - Home page OG image
- `default-home-twitter.svg` - Home page Twitter image
- `default-blog-og.svg` - Blog listing page OG image
- `default-blog-twitter.svg` - Blog listing page Twitter image
- `default-silly-questions-og.svg` - Silly questions page OG image
- `default-silly-questions-twitter.svg` - Silly questions page Twitter image

## Image Specifications

- **OG Images:** 1200x630px (optimal for Facebook, LinkedIn, etc.)
- **Twitter Images:** 1200x600px (optimal for Twitter cards)
- **Format:** SVG (lightweight and scalable)
- **Fallback:** Can be converted to PNG/JPG for broader compatibility

## Customization

You can easily customize the themes by modifying the `themes` object in the script:

```javascript
const themes = {
  yourTheme: {
    bgGradient: ['#startColor', '#endColor'],
    accent: '#accentColor',
    textPrimary: '#primaryTextColor',
    textSecondary: '#secondaryTextColor',
    textTertiary: '#tertiaryTextColor'
  }
};
```

## Integration with Next.js

The generated images are automatically used by the metadata functions in:
- `src/app/page.tsx` (Home page)
- `src/app/blog/page.tsx` (Blog listing)
- `src/app/silly-questions/page.tsx` (Silly questions listing)
- Individual blog posts and silly questions pages

## Performance Notes

- SVG images are lightweight and load quickly
- For production, consider converting to PNG/JPG for maximum compatibility
- Images are optimized for social media sharing platforms
