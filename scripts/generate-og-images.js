const fs = require('fs');
const path = require('path');

// Create the social images directory if it doesn't exist
const socialDir = path.join(__dirname, '..', 'public', 'images', 'social');
if (!fs.existsSync(socialDir)) {
  fs.mkdirSync(socialDir, { recursive: true });
}

// Function to create beautiful SVG OG image
function createOGImage(title, subtitle, type = 'og', theme = 'default') {
  const width = type === 'twitter' ? 1200 : 1200;
  const height = type === 'twitter' ? 600 : 630;

  // Theme configurations with orange-brown gradient
  const themes = {
    default: {
      bgGradient: ['#f97316', '#92400e'],
      accent: '#fbbf24',
      textPrimary: '#ffffff',
      textSecondary: '#fed7aa',
      textTertiary: '#fdba74'
    },
    blog: {
      bgGradient: ['#ea580c', '#7c2d12'],
      accent: '#f59e0b',
      textPrimary: '#ffffff',
      textSecondary: '#fef3c7',
      textTertiary: '#fde68a'
    },
    silly: {
      bgGradient: ['#fb923c', '#9a3412'],
      accent: '#f59e0b',
      textPrimary: '#ffffff',
      textSecondary: '#fed7aa',
      textTertiary: '#fdba74'
    }
  };

  const currentTheme = themes[theme] || themes.default;

  // Split title into multiple lines if too long
  const maxCharsPerLine = 25;
  const titleLines = [];
  const words = title.split(' ');
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) titleLines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) titleLines.push(currentLine);

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Main background gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${currentTheme.bgGradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${currentTheme.bgGradient[1]};stop-opacity:1" />
    </linearGradient>

    <!-- Accent gradient for decorative elements -->
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${currentTheme.accent};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${currentTheme.accent};stop-opacity:0.3" />
    </linearGradient>

    <!-- Text shadow filter -->
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>

    <!-- Glow effect -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGradient)"/>

  <!-- Decorative geometric shapes -->
  <circle cx="${width - 150}" cy="150" r="80" fill="url(#accentGradient)" opacity="0.3"/>
  <circle cx="${width - 100}" cy="100" r="40" fill="${currentTheme.accent}" opacity="0.2"/>
  <rect x="50" y="${height - 100}" width="200" height="4" fill="url(#accentGradient)" rx="2"/>

  <!-- Decorative dots pattern -->
  <g opacity="0.1">
    ${Array.from({length: 20}, (_, i) => {
      const x = 100 + (i % 5) * 200;
      const y = 80 + Math.floor(i / 5) * 120;
      return `<circle cx="${x}" cy="${y}" r="3" fill="${currentTheme.textPrimary}"/>`;
    }).join('')}
  </g>

  <!-- Content container -->
  <g transform="translate(80, ${height/2 - (titleLines.length * 30)})">
    <!-- Title (multi-line support) -->
    <text font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="${currentTheme.textPrimary}" filter="url(#textShadow)">
      ${titleLines.map((line, index) =>
        `<tspan x="0" dy="${index === 0 ? 0 : 60}" font-size="${titleLines.length > 1 ? 42 : 52}">${line}</tspan>`
      ).join('')}
    </text>

    <!-- Subtitle -->
    <text x="0" y="${titleLines.length * 60 + 40}" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="${currentTheme.textSecondary}" filter="url(#textShadow)">
      <tspan x="0" dy="0">${subtitle}</tspan>
    </text>

    <!-- Blog name with accent -->
    <g transform="translate(0, ${titleLines.length * 60 + 100})">
      <rect x="-5" y="-5" width="400" height="35" fill="${currentTheme.accent}" opacity="0.2" rx="4"/>
      <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="${currentTheme.textTertiary}">
        <tspan x="0" dy="0">✨ Blog's By Ratnesh</tspan>
      </text>
    </g>
  </g>

  <!-- Bottom accent line -->
  <rect x="0" y="${height - 8}" width="100%" height="8" fill="url(#accentGradient)"/>
</svg>`;

  return svg;
}

// Generate default OG images with beautiful themes
const images = [
  {
    filename: 'default-home-og.svg',
    title: 'Web Development & Programming',
    subtitle: 'Learn from real-world experiences & insights',
    theme: 'default'
  },
  {
    filename: 'default-home-twitter.svg',
    title: 'Web Development & Programming',
    subtitle: 'Learn from real-world experiences',
    theme: 'default'
  },
  {
    filename: 'default-blog-og.svg',
    title: 'All Blog Posts',
    subtitle: 'Explore web development insights & tutorials',
    theme: 'blog'
  },
  {
    filename: 'default-blog-twitter.svg',
    title: 'All Blog Posts',
    subtitle: 'Explore web development insights',
    theme: 'blog'
  },
  {
    filename: 'default-silly-questions-og.svg',
    title: 'Silly Questions & Mistakes',
    subtitle: 'Learn from coding mistakes & avoid pitfalls',
    theme: 'silly'
  },
  {
    filename: 'default-silly-questions-twitter.svg',
    title: 'Silly Questions & Mistakes',
    subtitle: 'Learn from coding mistakes',
    theme: 'silly'
  }
];

images.forEach(({ filename, title, subtitle, theme }) => {
  const type = filename.includes('twitter') ? 'twitter' : 'og';
  const svg = createOGImage(title, subtitle, type, theme);
  const filepath = path.join(socialDir, filename);

  fs.writeFileSync(filepath, svg);
  console.log(`Generated: ${filepath}`);
});

// Function to generate dynamic OG image for any content
function generateDynamicOGImage(title, subtitle = '', type = 'og', theme = 'default') {
  const svg = createOGImage(title, subtitle, type, theme);
  return svg;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createOGImage,
    generateDynamicOGImage
  };
}

console.log('🎨 Beautiful OG images generated successfully!');
console.log('📝 Features included:');
console.log('  ✨ Beautiful gradients and themes');
console.log('  🎯 Multi-line title support');
console.log('  🎨 Decorative elements and patterns');
console.log('  💫 Text shadows and glow effects');
console.log('  🌈 Theme-specific color schemes');
console.log('');
console.log('💡 Note: These are SVG files optimized for social media.');
console.log('   For even better performance, consider converting to PNG/JPG.');
console.log('');
console.log('🚀 You can also use this script to generate custom OG images:');
console.log('   const { generateDynamicOGImage } = require("./generate-og-images");');
console.log('   const svg = generateDynamicOGImage("Your Title", "Your Subtitle", "og", "blog");');
