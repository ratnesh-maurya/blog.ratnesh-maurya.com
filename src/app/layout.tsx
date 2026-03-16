import { Analytics } from "@/components/Analytics";
import { AppWrapper } from "@/components/AppWrapper";
import { OrganizationStructuredData, ProfilePageStructuredData, WebsiteStructuredData } from "@/components/StructuredData";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { oembedAlternate } from "@/lib/oembed";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066CC" },
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
      ...oembedAlternate('/'),
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









const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);var a=localStorage.getItem('accent-color');if(a){var p={blue:{light:{'--accent-50':'#EBF5FF','--accent-100':'#CCE8FF','--accent-200':'#99D1FF','--accent-300':'#66BAFF','--accent-400':'#33A3FF','--accent-500':'#0066CC','--accent-600':'#005299','--accent-700':'#003D73','--accent-800':'#00294D','--accent-900':'#001426'},dark:{'--accent-50':'#0F172A','--accent-100':'#1E293B','--accent-200':'#334155','--accent-300':'#475569','--accent-400':'#5B9BD5','--accent-500':'#6BAED6','--accent-600':'#8BC4E0','--accent-700':'#A8D4EB','--accent-800':'#C5E2F0','--accent-900':'#DDE9F5'}},green:{light:{'--accent-50':'#ECFDF5','--accent-100':'#D1FAE5','--accent-200':'#A7F3D0','--accent-300':'#6EE7B7','--accent-400':'#34D399','--accent-500':'#059669','--accent-600':'#047857','--accent-700':'#065F46','--accent-800':'#064E3B','--accent-900':'#022C22'},dark:{'--accent-50':'#0A1F17','--accent-100':'#132F23','--accent-200':'#1E4D38','--accent-300':'#2D6A4F','--accent-400':'#3FA77A','--accent-500':'#6BCF9F','--accent-600':'#8EDBB6','--accent-700':'#B3E8CD','--accent-800':'#D1F2E1','--accent-900':'#E8F9F0'}},purple:{light:{'--accent-50':'#F5F3FF','--accent-100':'#EDE9FE','--accent-200':'#DDD6FE','--accent-300':'#C4B5FD','--accent-400':'#A78BFA','--accent-500':'#7C3AED','--accent-600':'#6D28D9','--accent-700':'#5B21B6','--accent-800':'#4C1D95','--accent-900':'#2E1065'},dark:{'--accent-50':'#13091F','--accent-100':'#1E103A','--accent-200':'#2D1B5E','--accent-300':'#3E2780','--accent-400':'#6748B0','--accent-500':'#8B6DC7','--accent-600':'#A78BD8','--accent-700':'#C3ACE7','--accent-800':'#DACEEF','--accent-900':'#EDE6F7'}}};var c=p[a];if(c){var v=t==='dark'?c.dark:c.light;var r=document.documentElement;for(var k in v)r.style.setProperty(k,v[k]);}};}catch(e){}})();`;

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
