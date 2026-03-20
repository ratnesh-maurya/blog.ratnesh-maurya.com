import { Analytics } from "@/components/Analytics";
import { AppWrapper } from "@/components/AppWrapper";
import { ProfilePageStructuredData, SiteEntitiesStructuredData } from "@/components/StructuredData";
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
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
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









const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);var a=localStorage.getItem('accent-color')||'blue';document.documentElement.setAttribute('data-accent',a);}catch(e){}})();`;

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
        <SiteEntitiesStructuredData />
        <ProfilePageStructuredData />
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
