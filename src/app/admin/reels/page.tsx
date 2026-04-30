import { Metadata } from 'next';
import AdminReelsClient from './AdminReelsClient';

export const metadata: Metadata = {
  title: 'Reels Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminReelsPage() {
  return <AdminReelsClient />;
}
