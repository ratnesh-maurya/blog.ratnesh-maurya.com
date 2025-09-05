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
};

export const metadata: Metadata = {
  title: "Blog's By Ratnesh",
  description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
  keywords: ["web development", "programming", "javascript", "typescript", "react", "nextjs"],
  authors: [{ name: "Ratnesh Maurya" }],
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
