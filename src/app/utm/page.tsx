'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const BASE = 'https://blog.ratnesh-maurya.com';

type OptionsState = {
  sources: string[];
  campaigns: string[];
  mediums: string[];
};

const STORAGE_KEY = 'utm_builder_options_v1';

function normalizeOption(v: string) {
  return v.trim().replace(/\s+/g, ' ');
}

function uniqueNonEmpty(values: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = normalizeOption(raw);
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function loadOptions(): OptionsState {
  const defaults: OptionsState = {
    sources: ['twitter', 'linkedin', 'facebook', 'whatsapp', 'reddit', 'hackernews', 'copy'],
    campaigns: ['share', 'comment'],
    mediums: ['social', 'community', 'referral', 'email'],
  };

  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<OptionsState> | null;
    if (!parsed) return defaults;
    return {
      sources: uniqueNonEmpty([...(parsed.sources ?? []), ...defaults.sources]),
      campaigns: uniqueNonEmpty([...(parsed.campaigns ?? []), ...defaults.campaigns]),
      mediums: uniqueNonEmpty([...(parsed.mediums ?? []), ...defaults.mediums]),
    };
  } catch {
    return defaults;
  }
}

function saveOptions(next: OptionsState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function buildUtmUrl(inputUrl: string, params: Record<string, string>) {
  const raw = inputUrl.trim();
  const full = raw.startsWith('/') ? `${BASE}${raw}` : raw;
  const parsed = new URL(full, BASE);

  for (const [k, v] of Object.entries(params)) {
    const val = v.trim();
    if (!val) {
      parsed.searchParams.delete(k);
    } else {
      parsed.searchParams.set(k, val);
    }
  }

  return parsed.toString();
}

type CustomDropdownProps = {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (next: string) => void;
  onCreateOption: (value: string) => void;
  inputClassName: string;
  inputStyle: React.CSSProperties;
};

function CustomDropdown({
  label,
  value,
  options,
  placeholder,
  onChange,
  onCreateOption,
  inputClassName,
  inputStyle,
}: CustomDropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return options;
    return options.filter((o) => o.toLowerCase().includes(query));
  }, [options, q]);

  const normalizedQ = normalizeOption(q);
  const canCreate =
    normalizedQ.length > 0 && !options.some((o) => o.toLowerCase() === normalizedQ.toLowerCase());

  return (
    <div ref={rootRef} className="relative">
      <div className="sr-only">{label}</div>
      <button
        type="button"
        className={`${inputClassName} flex items-center justify-between gap-2`}
        style={inputStyle}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate text-left">
          {value ? value : <span style={{ color: 'var(--text-muted)' }}>{placeholder || 'Select…'}</span>}
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border shadow-lg overflow-hidden"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
              autoFocus
            />
          </div>

          <div className="max-h-56 overflow-auto py-1">
            {canCreate && (
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:opacity-90"
                style={{ color: 'var(--accent-500)' }}
                onClick={() => {
                  onCreateOption(normalizedQ);
                  onChange(normalizedQ);
                  setOpen(false);
                }}
              >
                <PlusIcon />
                Create “{normalizedQ}”
              </button>
            )}

            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                No matches
              </div>
            ) : (
              filtered.map((o) => {
                const selected = o.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={o}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className="w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:opacity-90"
                    style={{ color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    onClick={() => {
                      onChange(o);
                      setOpen(false);
                    }}
                  >
                    <span className="truncate">{o}</span>
                    {selected && <CheckMiniIcon />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UtmBuilderPage() {
  const sp = useSearchParams();

  const initialUrl = sp.get('url') || '';
  const initialTitle = sp.get('title') || '';
  const initialDescription = sp.get('description') || '';

  const [options, setOptions] = useState<OptionsState>(() => loadOptions());

  const [url, setUrl] = useState(initialUrl);
  const [utmSource, setUtmSource] = useState('linkedin');
  const [utmMedium, setUtmMedium] = useState('social');
  const [utmCampaign, setUtmCampaign] = useState('share');
  const [utmContent, setUtmContent] = useState('');
  const [utmTerm, setUtmTerm] = useState('');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    saveOptions(options);
  }, [options]);

  const builtUrl = useMemo(() => {
    if (!url.trim()) return '';
    try {
      return buildUtmUrl(url, {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
      });
    } catch {
      return '';
    }
  }, [url, utmSource, utmMedium, utmCampaign, utmContent, utmTerm]);

  const addOption = (kind: keyof OptionsState, value: string) => {
    const v = normalizeOption(value);
    if (!v) return;
    setOptions((prev) => {
      const next = { ...prev, [kind]: uniqueNonEmpty([v, ...(prev[kind] ?? [])]) };
      return next;
    });
  };

  const copy = async () => {
    if (!builtUrl) return;
    try {
      await navigator.clipboard.writeText(builtUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const fieldBase =
    'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors';

  const labelBase = 'text-xs font-semibold uppercase tracking-widest';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-500)' }}>
            UTM Builder
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Build a tracked link
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Paste a URL (or a site path), pick UTM values, copy the final link.
              </p>
            </div>
          </div>

          {(initialTitle || initialDescription) && (
            <div className="mb-6 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-muted)' }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Context
              </div>
              {initialTitle && (
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {initialTitle}
                </div>
              )}
              {initialDescription && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {initialDescription}
                </div>
              )}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                URL / Path
              </div>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/blog/my-post or https://..."
                className={fieldBase}
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                  UTM Source
                </div>
                <CustomDropdown
                  label="UTM Source"
                  value={utmSource}
                  options={options.sources}
                  placeholder="Pick a source"
                  onChange={setUtmSource}
                  onCreateOption={(v) => addOption('sources', v)}
                  inputClassName={fieldBase}
                  inputStyle={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                  UTM Medium
                </div>
                <CustomDropdown
                  label="UTM Medium"
                  value={utmMedium}
                  options={options.mediums}
                  placeholder="Pick a medium"
                  onChange={setUtmMedium}
                  onCreateOption={(v) => addOption('mediums', v)}
                  inputClassName={fieldBase}
                  inputStyle={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                  UTM Campaign
                </div>
                <CustomDropdown
                  label="UTM Campaign"
                  value={utmCampaign}
                  options={options.campaigns}
                  placeholder="Pick a campaign"
                  onChange={setUtmCampaign}
                  onCreateOption={(v) => addOption('campaigns', v)}
                  inputClassName={fieldBase}
                  inputStyle={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                  UTM Content (optional)
                </div>
                <input
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  placeholder="e.g. footer_share_button"
                  className={fieldBase}
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                  UTM Term (optional)
                </div>
                <input
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  placeholder="e.g. systems_design"
                  className={fieldBase}
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="pt-2">
              <div className={labelBase} style={{ color: 'var(--text-muted)' }}>
                Final URL
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={builtUrl}
                  readOnly
                  className={fieldBase}
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={copy}
                  disabled={!builtUrl}
                  className="inline-flex items-center gap-2 px-4 rounded-xl border text-sm font-semibold transition-all disabled:opacity-60"
                  style={{
                    borderColor: copied ? 'var(--accent-400)' : 'var(--border)',
                    backgroundColor: copied ? 'var(--accent-50)' : 'var(--surface)',
                    color: copied ? 'var(--accent-500)' : 'var(--text-secondary)',
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Tip: if you pass just a path (like <code>/blog/slug</code>), it will be expanded to <code>{BASE}</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CheckMiniIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
