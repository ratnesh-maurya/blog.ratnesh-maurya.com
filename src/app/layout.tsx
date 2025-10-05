import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/AppWrapper";
import { Analytics } from "@/components/Analytics";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const balooBhai2 = Baloo_Bhai_2({
  variable: "--font-baloo-bhai-2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.ratnesh-maurya.com'),
  title: {
    default: "Blog's By Ratnesh - Backend Engineering & System Design",
    template: "%s | Blog's By Ratnesh"
  },
  description: "A blog about backend engineering, system design, web development, and the silly mistakes we all make along the way. Learn from real-world experiences.",
  keywords: [
    "backend engineering",
    "system design",
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
    "debugging tips"
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
    title: "Blog's By Ratnesh - Backend Engineering & System Design",
    description: "A blog about backend engineering, system design, web development, and the silly mistakes we all make along the way.",
    url: "https://blog.ratnesh-maurya.com",
    siteName: "Blog's By Ratnesh",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog's By Ratnesh - Backend Engineering & System Design",
    description: "A blog about backend engineering, system design, and web development.",
    creator: "@ratnesh_maurya",
    site: "@ratnesh_maurya",
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
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'technology',
};









export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${balooBhai2.variable} antialiased`}>
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
      </body>
    </html>
  );
}
