import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
};

export const metadata: Metadata = {
  title: "Blog's By Ratnesh",
  description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
  keywords: ["web development", "programming", "javascript", "typescript", "react", "nextjs"],
  authors: [{ name: "Ratnesh Maurya" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Blog's By Ratnesh",
  },
  openGraph: {
    title: "Blog's By Ratnesh",
    description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
    url: "https://blog.ratnesh-maurya.com",
    siteName: "Blog's By Ratnesh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog's By Ratnesh",
    description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};









export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <AppWrapper>{children}</AppWrapper>
        <Analytics />
      </body>
    </html>
  );
}
