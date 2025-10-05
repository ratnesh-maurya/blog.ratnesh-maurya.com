'use client';

import { useState, useEffect } from 'react';

interface SEOIndicatorProps {
  showInDev?: boolean;
}

export function SEOIndicator({ showInDev = true }: SEOIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [seoChecks, setSeoChecks] = useState({
    structuredData: false,
    metaTags: false,
    openGraph: false,
    twitter: false,
    canonical: false,
  });

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development' || !showInDev) {
      return;
    }

    // Check for structured data
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    // Check for meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    
    // Check for Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    // Check for Twitter Card tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    
    // Check for canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');

    setSeoChecks({
      structuredData: structuredDataScripts.length > 0,
      metaTags: !!(metaDescription && metaKeywords),
      openGraph: !!(ogTitle && ogDescription && ogImage),
      twitter: !!(twitterCard && twitterTitle),
      canonical: !!canonical,
    });

    setIsVisible(true);
  }, [showInDev]);

  if (!isVisible) return null;

  const allPassed = Object.values(seoChecks).every(check => check);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm text-gray-900">SEO Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close SEO indicator"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-1 text-xs">
        <SEOCheckItem label="Structured Data" passed={seoChecks.structuredData} />
        <SEOCheckItem label="Meta Tags" passed={seoChecks.metaTags} />
        <SEOCheckItem label="Open Graph" passed={seoChecks.openGraph} />
        <SEOCheckItem label="Twitter Cards" passed={seoChecks.twitter} />
        <SEOCheckItem label="Canonical URL" passed={seoChecks.canonical} />
      </div>

      <div className={`mt-3 pt-3 border-t ${allPassed ? 'border-green-200' : 'border-yellow-200'}`}>
        <p className={`text-xs font-medium ${allPassed ? 'text-green-600' : 'text-yellow-600'}`}>
          {allPassed ? '✓ All SEO checks passed!' : '⚠ Some SEO checks failed'}
        </p>
      </div>
    </div>
  );
}

interface SEOCheckItemProps {
  label: string;
  passed: boolean;
}

function SEOCheckItem({ label, passed }: SEOCheckItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <span className={`font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
        {passed ? '✓' : '✗'}
      </span>
    </div>
  );
}

