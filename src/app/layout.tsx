import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ratnesh Maurya's Blog",
  description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
  keywords: ["web development", "programming", "javascript", "typescript", "react", "nextjs"],
  authors: [{ name: "Ratnesh Maurya" }],
  openGraph: {
    title: "Ratnesh Maurya's Blog",
    description: "A blog about web development, programming, and the silly mistakes we all make along the way.",
    url: "https://blog.ratnesh-maurya.com",
    siteName: "Ratnesh Maurya's Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratnesh Maurya's Blog",
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
