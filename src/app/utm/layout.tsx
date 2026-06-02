import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UTM Link Builder — Ratn Labs',
  description: 'Internal tool for building campaign tracking URLs.',
  robots: { index: false, follow: false },
};

export default function UtmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
