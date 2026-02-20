import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image';

export const alt = 'kubectl Cheatsheet — Ratn Labs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'edge';

export default function Image() {
  return buildOgImage({
    title: 'kubectl Cheatsheet',
    subtitle: 'Kubernetes CLI — pods, deployments, debugging.',
    breadcrumb: 'Cheatsheets',
  });
}
