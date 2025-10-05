import { Metadata } from 'next';
import { AboutPageClient } from '@/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'About | Blog&apos;s By Ratnesh',
  description: 'Backend Engineer passionate about building scalable systems with Golang and Elixir. Explore my coding profiles, tech stack, and connect with me!',
  keywords: ['Ratnesh Maurya', 'Backend Engineer', 'Golang', 'Elixir', 'System Design', 'Software Engineer'],
  openGraph: {
    title: 'About Ratnesh Maurya | Backend Engineer',
    description: 'Backend Engineer passionate about building scalable systems with Golang and Elixir. Check out my GitHub, LeetCode, and Codeforces profiles!',
    type: 'profile',
    url: 'https://blog.ratnesh-maurya.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Ratnesh Maurya | Backend Engineer',
    description: 'Backend Engineer passionate about building scalable systems with Golang and Elixir.',
    creator: '@ratnesh_maurya',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
