# Analytics Integration Guide

This blog includes comprehensive analytics tracking to help you understand user behavior, performance metrics, and content engagement.

## 🔧 Setup

### 1. Google Analytics 4 (GA4)

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add it to your environment variables:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 2. Optional Analytics Tools

#### Microsoft Clarity
- Free heatmaps and session recordings
- Sign up at [clarity.microsoft.com](https://clarity.microsoft.com/)
- Add your Project ID:
  ```bash
  NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
  ```

#### Hotjar
- Advanced heatmaps and user feedback
- Sign up at [hotjar.com](https://www.hotjar.com/)
- Add your Site ID:
  ```bash
  NEXT_PUBLIC_HOTJAR_ID=xxxxxxx
  ```

## 📊 Tracked Events

### Page Views
- Automatic tracking on all page navigations
- Includes page path, title, and referrer

### User Engagement
- **Time on Page**: Tracked every 30 seconds
- **Reading Progress**: Blog posts tracked at 25%, 50%, 75%, 100%
- **Scroll Depth**: Measured for content engagement

### Content Interactions
- **Blog Post Views**: Track which articles are most popular
- **Search Queries**: Monitor what users are looking for
- **Carousel Interactions**: Track featured post engagement
- **Theme Changes**: Monitor dark/light mode preferences

### Performance Metrics
- **Core Web Vitals**: CLS, FID, FCP, LCP, TTFB
- **Page Load Times**: Monitor site performance
- **Error Tracking**: JavaScript errors and failed requests

### Social Sharing
- Track shares to different platforms
- Monitor which content gets shared most

## 🎯 Custom Events

### Blog Post Tracking
```javascript
import { trackBlogView } from '@/lib/analytics';

// Track when a user views a blog post
trackBlogView(slug, title, category);
```

### Search Tracking
```javascript
import { trackSearch } from '@/lib/analytics';

// Track search queries and results
trackSearch(query, resultsCount);
```

### Theme Tracking
```javascript
import { trackThemeChange } from '@/lib/analytics';

// Track theme preference changes
trackThemeChange('dark'); // or 'light'
```

### Social Share Tracking
```javascript
import { trackSocialShare } from '@/lib/analytics';

// Track social media shares
trackSocialShare('twitter', url, title);
```

## 📈 Analytics Dashboard

### Key Metrics to Monitor

1. **Content Performance**
   - Most viewed blog posts
   - Average reading time
   - Bounce rate by content type

2. **User Behavior**
   - Search queries and success rate
   - Theme preference distribution
   - Navigation patterns

3. **Technical Performance**
   - Core Web Vitals scores
   - Page load times
   - Error rates

4. **Engagement**
   - Time spent on site
   - Pages per session
   - Return visitor rate

### Setting Up Custom Reports

1. **Content Engagement Report**
   - Filter by event category: "Blog"
   - Group by event label
   - Add reading progress events

2. **Search Performance Report**
   - Filter by event category: "Search"
   - Group by event label (search terms)
   - Add conversion metrics

3. **User Experience Report**
   - Include Core Web Vitals
   - Theme preference data
   - Device and browser breakdown

## 🔒 Privacy Considerations

### GDPR Compliance
- Analytics only track anonymous usage data
- No personally identifiable information is collected
- Users can opt-out through browser settings

### Data Retention
- Google Analytics: 14 months (configurable)
- Microsoft Clarity: 12 months
- Hotjar: Based on your plan

### Cookie Usage
- Analytics cookies are used for tracking
- Consider adding a cookie consent banner for EU users

## 🚀 Performance Impact

### Optimization Features
- Scripts load with `strategy="afterInteractive"`
- Analytics initialization is deferred
- Minimal impact on Core Web Vitals

### Bundle Size
- Google Analytics: ~45KB gzipped
- Microsoft Clarity: ~25KB gzipped
- Hotjar: ~30KB gzipped

## 🛠 Development

### Testing Analytics
```bash
# Enable analytics in development
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run dev
```

### Debug Mode
```javascript
// Enable GA debug mode
window.gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: true
});
```

### Event Testing
Use the browser console to test events:
```javascript
// Test custom event
gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test'
});
```

## 📋 Checklist

- [ ] Set up Google Analytics 4 property
- [ ] Add GA4 Measurement ID to environment variables
- [ ] Configure optional analytics tools (Clarity, Hotjar)
- [ ] Test analytics in development
- [ ] Verify events are firing in GA4 Real-time reports
- [ ] Set up custom reports and dashboards
- [ ] Configure data retention settings
- [ ] Add privacy policy updates if needed

## 🔗 Useful Links

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Microsoft Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Hotjar Documentation](https://help.hotjar.com/)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [GDPR Compliance for Analytics](https://support.google.com/analytics/answer/9019185)
