import { redirect } from 'next/navigation';

export default function NowPage() {
  redirect('/about#now');
}
