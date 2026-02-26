import { BlogImage } from '@/components/BlogImage';
import type { MDXComponents } from 'mdx/types';
import {
  ArchitectureCard,
  ArchitectureColumns,
  Flow,
  FlowStep,
  PerformanceComparison,
  PerformanceRow,
} from './Architecture';
import { CachingAdoptionPieChart, CachingTradeoffChart, DemoBarChart, DemoPieChart } from './Charts';

function Callout({
  type = 'info',
  title,
  children
}: {
  type?: 'info' | 'warning' | 'tip';
  title?: string;
  children?: React.ReactNode;
}) {
  const styles = {
    info: { borderColor: 'var(--accent-500)', bg: 'color-mix(in srgb, var(--accent-500) 8%, transparent)' },
    warning: { borderColor: '#b45309', bg: 'rgba(180, 83, 9, 0.08)' },
    tip: { borderColor: 'var(--accent-600)', bg: 'color-mix(in srgb, var(--accent-600) 8%, transparent)' }
  };
  const s = styles[type];
  return (
    <div
      className="my-6 rounded-xl border-l-4 p-4"
      style={{
        borderLeftColor: s.borderColor,
        backgroundColor: s.bg,
        color: 'var(--text-primary)'
      }}
    >
      {title && (
        <p className="mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
      )}
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  );
}

function Badge({
  children
}: {
  children?: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--accent-500) 12%, transparent)',
        color: 'var(--text-primary)',
        border: '1px solid color-mix(in srgb, var(--accent-500) 35%, transparent)'
      }}
    >
      {children}
    </span>
  );
}

function Steps({
  title,
  children
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="my-8 rounded-2xl p-5"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      {title && (
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          {title}
        </p>
      )}
      <ol className="m-0 list-none space-y-4 p-0">{children}</ol>
    </div>
  );
}

function Step({
  title,
  children
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <div
        className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-500) 15%, transparent)',
          color: 'var(--accent-500)'
        }}
      >
        ●
      </div>
      <div>
        {title && (
          <p className="mb-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </p>
        )}
        <div className="prose prose-sm max-w-none" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </div>
    </li>
  );
}

function ResourceCard({
  title,
  href,
  label,
  children
}: {
  title: string;
  href: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block no-underline transition-transform duration-150 hover:-translate-y-0.5"
      style={{
        color: 'inherit'
      }}
    >
      <div
        className="flex flex-col gap-2 rounded-xl p-4"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </p>
          {label && <Badge>{label}</Badge>}
        </div>
        {children && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {children}
          </p>
        )}
      </div>
    </a>
  );
}

function Highlight({
  children
}: {
  children?: React.ReactNode;
}) {
  return (
    <span
      className="rounded px-1"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--accent-500) 15%, transparent)',
        color: 'var(--text-primary)'
      }}
    >
      {children}
    </span>
  );
}

export const mdxComponents: MDXComponents = {
  img: (props) => (
    <BlogImage
      src={props.src ?? ''}
      alt={props.alt ?? ''}
      width={props.width ? Number(props.width) : 800}
      height={props.height ? Number(props.height) : 400}
      className={props.className as string}
    />
  ),
  Callout,
  Badge,
  Steps,
  Step,
  ResourceCard,
  Highlight,
  DemoBarChart,
  DemoPieChart,
  CachingAdoptionPieChart,
  CachingTradeoffChart,
  ArchitectureColumns,
  ArchitectureCard,
  Flow,
  FlowStep,
  PerformanceComparison,
  PerformanceRow
};
