import type { ReactNode } from 'react';

const ACCENT = '#0d9488'; // teal – works in light and dark

type Tone = 'green' | 'pink' | 'yellow';

function getAccent(_tone: Tone = 'green') {
  return ACCENT;
}

export function ArchitectureColumns({
  title,
  children,
  tone = 'green',
}: {
  title?: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  const accent = getAccent(tone);

  return (
    <section className="my-10">
      {title && (
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {title}
        </p>
      )}
      <div
        className="grid items-stretch gap-5 md:grid-cols-3"
        style={{
          borderRadius: '1rem',
          padding: '1.25rem',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        {children}
      </div>
    </section>
  );
}

export function ArchitectureCard({
  title,
  subtitle,
  children,
  tone = 'green',
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  const accent = getAccent(tone);

  return (
    <div
      className="relative flex flex-col rounded-xl border p-5 pl-6"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l"
        style={{ backgroundColor: accent }}
      />
      <div className="mb-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <p
          className="mt-auto text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {children}
        </p>
      )}
    </div>
  );
}

export function Flow({
  title,
  children,
  tone = 'green',
}: {
  title?: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  const accent = getAccent(tone);
  const steps = (Array.isArray(children) ? children : [children]).filter(Boolean);

  return (
    <section className="my-10">
      {title && (
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {title}
        </p>
      )}
      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-max items-stretch gap-4 px-1">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              {step}
              {index < steps.length - 1 && (
                <div className="flex items-center" style={{ color: accent, opacity: 0.8 }}>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlowStep({
  title,
  children,
  tone = 'green',
}: {
  title: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  const accent = getAccent(tone);

  return (
    <div
      className="relative flex min-w-[220px] max-w-xs flex-col overflow-hidden rounded-xl border p-5"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 rounded-r"
        style={{ backgroundColor: accent }}
      />
      <p
        className="mb-2 text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </p>
      {children && (
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {children}
        </p>
      )}
    </div>
  );
}

export function PerformanceComparison({
  title,
  baselineLabel = 'Before',
  variantLabel = 'After',
  children,
  tone = 'green',
}: {
  title?: string;
  baselineLabel?: string;
  variantLabel?: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  const accent = getAccent(tone);

  return (
    <section className="my-10">
      {title && (
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {title}
        </p>
      )}
      <div
        className="rounded-xl border"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
        }}
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr
              style={{
                color: 'var(--text-muted)',
                backgroundColor: 'var(--background)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <th
                className="py-3 pl-5 pr-4 text-xs font-semibold uppercase tracking-wider"
                style={{ fontWeight: 600 }}
              >
                Metric
              </th>
              <th
                className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ fontWeight: 600 }}
              >
                {baselineLabel}
              </th>
              <th
                className="py-3 pl-4 pr-5 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ fontWeight: 600, color: accent }}
              >
                {variantLabel}
              </th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}

export function PerformanceRow({
  metric,
  before,
  after,
  unit,
}: {
  metric: string;
  before: string;
  after: string;
  unit?: string;
}) {
  const improved =
    Number.parseFloat(after) < Number.parseFloat(before) &&
    !Number.isNaN(Number.parseFloat(after)) &&
    !Number.isNaN(Number.parseFloat(before));

  return (
    <tr
      className="border-b last:border-b-0"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: improved ? 'rgba(13, 148, 136, 0.06)' : 'transparent',
      }}
    >
      <td className="py-3.5 pl-5 pr-4">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {metric}
          </span>
          {unit && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {unit}
            </span>
          )}
        </div>
      </td>
      <td
        className="py-3.5 px-4 text-right text-sm tabular-nums"
        style={{ color: 'var(--text-secondary)' }}
      >
        {before}
      </td>
      <td className="py-3.5 pl-4 pr-5 text-right">
        <span
          className="inline-flex items-center justify-end gap-1.5 text-sm font-semibold tabular-nums"
          style={{
            color: improved ? ACCENT : 'var(--text-primary)',
          }}
        >
          {after}
          {improved && (
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
        </span>
      </td>
    </tr>
  );
}
