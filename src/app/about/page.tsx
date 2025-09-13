import { Metadata } from 'next';
import { AboutPageClient } from '@/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'About | Blog&apos;s By Ratnesh',
  description: 'Learn more about Ratnesh Maurya, a passionate Software Engineer at Initializ, specializing in backend development with Golang and Elixir.',
  openGraph: {
    title: 'About | Blog&apos;s By Ratnesh',
    description: 'Learn more about Ratnesh Maurya, a passionate Software Engineer at Initializ, specializing in backend development with Golang and Elixir.',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
