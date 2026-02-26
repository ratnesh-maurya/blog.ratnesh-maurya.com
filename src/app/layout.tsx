import { Analytics } from "@/components/Analytics";
import { AppWrapper } from "@/components/AppWrapper";
import { OrganizationStructuredData, ProfilePageStructuredData, WebsiteStructuredData } from "@/components/StructuredData";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0088E6" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.ratnesh-maurya.com'),
  title: {
    default: "Ratn Labs — Systems, Backend & AI Engineering",
    template: "%s | Ratn Labs"
  },
  description: "Systems thinking, backend architecture, and AI engineering. Building scalable systems and sharing technical insights.",
  keywords: [
    "Ratnesh Maurya",
    "Ratnesh Maurya blog",
    "backend engineering",
    "system design",
    "AI engineering",
    "web development",
    "programming",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "node.js",
    "database design",
    "API development",
    "software architecture",
    "coding best practices",
    "debugging tips",
    "silly coding mistakes"
  ],
  authors: [{
    name: "Ratnesh Maurya",
    url: "https://ratnesh-maurya.com"
  }],
  creator: "Ratnesh Maurya",
  publisher: "Ratnesh Maurya",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://blog.ratnesh-maurya.com",
    types: {
      'application/rss+xml': 'https://blog.ratnesh-maurya.com/feed.xml',
    },
  },
  openGraph: {
    title: "Ratn Labs — Systems, Backend & AI Engineering",
    description: "Systems thinking, backend architecture, and AI engineering. Building scalable systems and sharing technical insights.",
    url: "https://blog.ratnesh-maurya.com",
    siteName: "Ratn Labs",
    type: "website",
    locale: "en_US",
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: "Ratn Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratn Labs — Systems, Backend & AI Engineering",
    description: "Systems thinking, backend architecture, and AI engineering.",
    creator: "@ratnesh_maurya",
    site: "@ratnesh_maurya",
    images: ['/og/home.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};









const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);var a=localStorage.getItem('accent-color');if(a){var p={blue:{light:{'--accent-50':'#E3F2FF','--accent-100':'#CCE8FF','--accent-200':'#99D1FF','--accent-300':'#66BAFF','--accent-400':'#33A3FF','--accent-500':'#0088E6','--accent-600':'#006BB8','--accent-700':'#004D8A','--accent-800':'#00305C','--accent-900':'#00182E'},dark:{'--accent-50':'#0F172A','--accent-100':'#1E293B','--accent-200':'#334155','--accent-300':'#475569','--accent-400':'#5B7BA8','--accent-500':'#6B8FC9','--accent-600':'#8BA8D4','--accent-700':'#A8C2E0','--accent-800':'#C5D6EB','--accent-900':'#DDE5F0'}},green:{light:{'--accent-50':'#ECFDF5','--accent-100':'#D1FAE5','--accent-200':'#A7F3D0','--accent-300':'#6EE7B7','--accent-400':'#34D399','--accent-500':'#059669','--accent-600':'#047857','--accent-700':'#065F46','--accent-800':'#064E3B','--accent-900':'#022C22'},dark:{'--accent-50':'#0A1F17','--accent-100':'#132F23','--accent-200':'#1E4D38','--accent-300':'#2D6A4F','--accent-400':'#3FA77A','--accent-500':'#6BCF9F','--accent-600':'#8EDBB6','--accent-700':'#B3E8CD','--accent-800':'#D1F2E1','--accent-900':'#E8F9F0'}},purple:{light:{'--accent-50':'#F5F3FF','--accent-100':'#EDE9FE','--accent-200':'#DDD6FE','--accent-300':'#C4B5FD','--accent-400':'#A78BFA','--accent-500':'#7C3AED','--accent-600':'#6D28D9','--accent-700':'#5B21B6','--accent-800':'#4C1D95','--accent-900':'#2E1065'},dark:{'--accent-50':'#13091F','--accent-100':'#1E103A','--accent-200':'#2D1B5E','--accent-300':'#3E2780','--accent-400':'#6748B0','--accent-500':'#8B6DC7','--accent-600':'#A78BD8','--accent-700':'#C3ACE7','--accent-800':'#DACEEF','--accent-900':'#EDE6F7'}},orange:{light:{'--accent-50':'#FFF7ED','--accent-100':'#FFEDD5','--accent-200':'#FED7AA','--accent-300':'#FDBA74','--accent-400':'#FB923C','--accent-500':'#EA580C','--accent-600':'#C2410C','--accent-700':'#9A3412','--accent-800':'#7C2D12','--accent-900':'#431407'},dark:{'--accent-50':'#1A0F05','--accent-100':'#2E1A0A','--accent-200':'#4D2A12','--accent-300':'#6E3B1A','--accent-400':'#B05C2A','--accent-500':'#D47842','--accent-600':'#E09565','--accent-700':'#E8B08A','--accent-800':'#F0CCB0','--accent-900':'#F7E4D4'}},pink:{light:{'--accent-50':'#FFF1F2','--accent-100':'#FFE4E6','--accent-200':'#FECDD3','--accent-300':'#FDA4AF','--accent-400':'#FB7185','--accent-500':'#E11D48','--accent-600':'#BE123C','--accent-700':'#9F1239','--accent-800':'#881337','--accent-900':'#4C0519'},dark:{'--accent-50':'#1A0810','--accent-100':'#2E0F1B','--accent-200':'#4D1A2E','--accent-300':'#6E2642','--accent-400':'#B04068','--accent-500':'#D4587F','--accent-600':'#E07A9A','--accent-700':'#E8A0B5','--accent-800':'#F0C5D0','--accent-900':'#F7E0E8'}},teal:{light:{'--accent-50':'#F0FDFA','--accent-100':'#CCFBF1','--accent-200':'#99F6E4','--accent-300':'#5EEAD4','--accent-400':'#2DD4BF','--accent-500':'#0D9488','--accent-600':'#0F766E','--accent-700':'#115E59','--accent-800':'#134E4A','--accent-900':'#042F2E'},dark:{'--accent-50':'#0A1A18','--accent-100':'#102D28','--accent-200':'#1A4D44','--accent-300':'#266A5E','--accent-400':'#3B9E8B','--accent-500':'#5DC0AE','--accent-600':'#80D1C3','--accent-700':'#A6E0D6','--accent-800':'#C8EDE7','--accent-900':'#E4F7F3'}}};var c=p[a];if(c){var v=t==='dark'?c.dark:c.light;var r=document.documentElement;for(var k in v)r.style.setProperty(k,v[k]);}};}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif4.variable} antialiased`}>
        {/* Inline theme script — runs synchronously before paint to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <ProfilePageStructuredData />
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
