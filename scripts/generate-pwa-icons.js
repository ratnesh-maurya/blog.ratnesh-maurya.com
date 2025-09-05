const fs = require('fs');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to create PWA icon SVG with orange-brown gradient
function createPWAIcon(size) {
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Orange to Brown gradient -->
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ea580c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#92400e;stop-opacity:1" />
    </linearGradient>
    
    <!-- Inner glow -->
    <radialGradient id="innerGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:0" />
    </radialGradient>
    
    <!-- Shadow filter -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Background circle with gradient -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#brandGradient)" filter="url(#shadow)"/>
  
  <!-- Inner glow overlay -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" fill="url(#innerGlow)"/>
  
  <!-- Blog icon - stylized 'B' -->
  <g transform="translate(${size * 0.25}, ${size * 0.2})">
    <!-- Letter B shape -->
    <path d="M 0 0 L 0 ${size * 0.6} L ${size * 0.25} ${size * 0.6} 
             C ${size * 0.35} ${size * 0.6} ${size * 0.4} ${size * 0.55} ${size * 0.4} ${size * 0.5}
             C ${size * 0.4} ${size * 0.45} ${size * 0.35} ${size * 0.4} ${size * 0.25} ${size * 0.4}
             L ${size * 0.15} ${size * 0.4}
             L ${size * 0.15} ${size * 0.2}
             L ${size * 0.22} ${size * 0.2}
             C ${size * 0.32} ${size * 0.2} ${size * 0.37} ${size * 0.15} ${size * 0.37} ${size * 0.1}
             C ${size * 0.37} ${size * 0.05} ${size * 0.32} 0 ${size * 0.22} 0
             Z
             M ${size * 0.08} ${size * 0.08} L ${size * 0.22} ${size * 0.08}
             C ${size * 0.27} ${size * 0.08} ${size * 0.29} ${size * 0.1} ${size * 0.29} ${size * 0.1}
             C ${size * 0.29} ${size * 0.1} ${size * 0.27} ${size * 0.12} ${size * 0.22} ${size * 0.12}
             L ${size * 0.08} ${size * 0.12}
             Z
             M ${size * 0.08} ${size * 0.28} L ${size * 0.25} ${size * 0.28}
             C ${size * 0.3} ${size * 0.28} ${size * 0.32} ${size * 0.3} ${size * 0.32} ${size * 0.32}
             C ${size * 0.32} ${size * 0.34} ${size * 0.3} ${size * 0.36} ${size * 0.25} ${size * 0.36}
             L ${size * 0.08} ${size * 0.36}
             Z" 
          fill="white" 
          opacity="0.95"/>
  </g>
  
  <!-- Decorative dots -->
  <circle cx="${size * 0.8}" cy="${size * 0.3}" r="${size * 0.03}" fill="white" opacity="0.6"/>
  <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.025}" fill="white" opacity="0.4"/>
  <circle cx="${size * 0.25}" cy="${size * 0.8}" r="${size * 0.02}" fill="white" opacity="0.5"/>
</svg>`;

  return svg;
}

// Generate all required PWA icon sizes
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

iconSizes.forEach(size => {
  const svg = createPWAIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`Generated: ${filepath}`);
});

// Also create favicon.ico as SVG (browsers will handle conversion)
const faviconSvg = createPWAIcon(32);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), faviconSvg);

// Create apple-touch-icon
const appleTouchIcon = createPWAIcon(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleTouchIcon);

console.log('🎨 PWA icons generated successfully!');
console.log('📱 Features included:');
console.log('  🧡 Orange to brown gradient theme');
console.log('  ✨ Stylized "B" logo for Blog\'s By Ratnesh');
console.log('  💫 Inner glow and shadow effects');
console.log('  🎯 All standard PWA icon sizes');
console.log('  🍎 Apple touch icon included');
console.log('');
console.log('💡 Note: These are SVG files. For production, consider converting to PNG.');
console.log('   You can use online tools or imagemagick: convert icon.svg icon.png');
