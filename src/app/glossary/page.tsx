import { redirect } from 'next/navigation';

/** Canonical glossary lives at /technical-terms — avoid duplicate hubs in nav and SERP. */
export default function GlossaryPage() {
  redirect('/technical-terms/');
}
