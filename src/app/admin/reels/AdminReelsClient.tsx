'use client';

import { useCallback, useEffect, useState } from 'react';

type ReelLink = { label: string; url: string };
type Reel = {
  slug: string;
  title: string;
  description: string;
  reel_url: string;
  thumb_url: string | null;
  posted_at: string;
  links: ReelLink[];
  updated_at?: string;
};

const SECRET_KEY = 'ratn_labs_admin_secret';

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): Reel => ({
  slug: '',
  title: '',
  description: '',
  reel_url: '',
  thumb_url: '',
  posted_at: today(),
  links: [{ label: '', url: '' }],
});

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  boxShadow: 'var(--glass-shadow-sm)',
  backdropFilter: 'blur(12px) saturate(160%)',
  WebkitBackdropFilter: 'blur(12px) saturate(160%)',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--glass-bg-subtle)',
  border: '1px solid var(--glass-border)',
  color: 'var(--text-primary)',
};

export default function AdminReelsClient() {
  const [secret, setSecret] = useState('');
  const [secretSaved, setSecretSaved] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [form, setForm] = useState<Reel>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(SECRET_KEY) : null;
    if (stored) {
      setSecret(stored);
      setSecretSaved(true);
    }
  }, []);

  const flash = (type: 'ok' | 'err', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const fetchReels = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reels', { headers: { 'x-admin-secret': s }, cache: 'no-store' });
      if (!res.ok) {
        flash('err', `Load failed: ${res.status}`);
        if (res.status === 401) {
          window.localStorage.removeItem(SECRET_KEY);
          setSecretSaved(false);
        }
        return;
      }
      const data = await res.json();
      setReels(data.reels ?? []);
    } catch (e) {
      flash('err', `Network error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (secretSaved && secret) fetchReels(secret);
  }, [secretSaved, secret, fetchReels]);

  const saveSecret = () => {
    if (!secret.trim()) return;
    window.localStorage.setItem(SECRET_KEY, secret.trim());
    setSecretSaved(true);
  };

  const clearSecret = () => {
    window.localStorage.removeItem(SECRET_KEY);
    setSecret('');
    setSecretSaved(false);
    setReels([]);
  };

  const updateLink = (idx: number, key: 'label' | 'url', val: string) => {
    setForm((f) => ({
      ...f,
      links: f.links.map((l, i) => (i === idx ? { ...l, [key]: val } : l)),
    }));
  };

  const addLink = () => setForm((f) => ({ ...f, links: [...f.links, { label: '', url: '' }] }));
  const removeLink = (idx: number) =>
    setForm((f) => ({ ...f, links: f.links.filter((_, i) => i !== idx) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) return flash('err', 'Set secret first');
    setLoading(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        reel_url: form.reel_url.trim(),
        thumb_url: form.thumb_url?.trim() || null,
        posted_at: form.posted_at,
        links: form.links.filter((l) => l.label.trim() && l.url.trim()),
      };
      const res = await fetch('/api/admin/reels', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        flash('err', data.error || `Save failed: ${res.status}`);
        return;
      }
      flash('ok', `Saved: ${payload.slug}`);
      setForm(emptyForm());
      fetchReels(secret);
    } catch (e) {
      flash('err', `Network error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const editReel = (r: Reel) => {
    setForm({
      slug: r.slug,
      title: r.title,
      description: r.description ?? '',
      reel_url: r.reel_url,
      thumb_url: r.thumb_url ?? '',
      posted_at: r.posted_at,
      links: r.links?.length ? r.links : [{ label: '', url: '' }],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteReel = async (slug: string) => {
    if (!confirm(`Delete reel "${slug}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reels?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        flash('err', data.error || `Delete failed: ${res.status}`);
        return;
      }
      flash('ok', `Deleted: ${slug}`);
      fetchReels(secret);
    } catch (e) {
      flash('err', `Network error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!secretSaved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="rounded-2xl p-8 max-w-md w-full" style={cardStyle}>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Reels Admin
          </h1>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Enter the admin secret to manage reels.
          </p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveSecret()}
            placeholder="ADMIN_SECRET"
            className="w-full rounded-xl px-4 py-3 text-sm mb-3"
            style={inputStyle}
            autoFocus
          />
          <button
            onClick={saveSecret}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--accent-500)', color: 'white' }}
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Reels Admin
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage entries on /links
            </p>
          </div>
          <button
            onClick={clearSecret}
            className="text-xs font-semibold rounded-lg px-3 py-1.5"
            style={inputStyle}
          >
            Lock
          </button>
        </header>

        {msg && (
          <div
            className="rounded-xl px-4 py-3 text-sm font-medium"
            style={{
              backgroundColor: msg.type === 'ok' ? 'var(--accent-50)' : '#fee',
              color: msg.type === 'ok' ? 'var(--accent-700)' : '#900',
              border: '1px solid var(--glass-border)',
            }}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={submit} className="rounded-2xl p-6 space-y-4" style={cardStyle}>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            Add / update reel
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Slug (lowercase, hyphens)" required>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                pattern="[a-z0-9-]+"
                required
                className="w-full rounded-xl px-3 py-2 text-sm"
                style={inputStyle}
              />
            </Field>
            <Field label="Posted at" required>
              <input
                type="date"
                value={form.posted_at}
                onChange={(e) => setForm({ ...form, posted_at: e.target.value })}
                required
                className="w-full rounded-xl px-3 py-2 text-sm"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Title" required>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded-xl px-3 py-2 text-sm"
              style={inputStyle}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl px-3 py-2 text-sm"
              style={inputStyle}
            />
          </Field>

          <Field label="Reel / post URL" required>
            <input
              type="url"
              value={form.reel_url}
              onChange={(e) => setForm({ ...form, reel_url: e.target.value })}
              required
              className="w-full rounded-xl px-3 py-2 text-sm"
              style={inputStyle}
            />
          </Field>

          <Field label="Thumbnail URL (optional)">
            <input
              type="url"
              value={form.thumb_url ?? ''}
              onChange={(e) => setForm({ ...form, thumb_url: e.target.value })}
              className="w-full rounded-xl px-3 py-2 text-sm"
              style={inputStyle}
            />
          </Field>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Related links
            </label>
            <div className="space-y-2 mt-2">
              {form.links.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Label"
                    value={l.label}
                    onChange={(e) => updateLink(i, 'label', e.target.value)}
                    className="flex-1 rounded-xl px-3 py-2 text-sm"
                    style={inputStyle}
                  />
                  <input
                    placeholder="https://..."
                    value={l.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                    className="flex-[2] rounded-xl px-3 py-2 text-sm"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="text-xs font-semibold rounded-xl px-3"
                    style={inputStyle}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="text-xs font-semibold rounded-xl px-3 py-2"
                style={inputStyle}
              >
                + Add link
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-500)', color: 'white' }}
            >
              {loading ? 'Saving…' : 'Save reel'}
            </button>
            <button
              type="button"
              onClick={() => setForm(emptyForm())}
              className="rounded-xl px-4 py-3 text-sm font-semibold"
              style={inputStyle}
            >
              Reset
            </button>
          </div>
        </form>

        <section className="space-y-3">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            Existing reels ({reels.length})
          </h2>
          {reels.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>None yet.</p>
          ) : (
            <ul className="space-y-2">
              {reels.map((r) => (
                <li key={r.slug} className="rounded-2xl p-4 flex items-center gap-3" style={cardStyle}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {r.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {r.slug} · {r.posted_at} · {r.links?.length ?? 0} link{r.links?.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    onClick={() => editReel(r)}
                    className="text-xs font-semibold rounded-lg px-3 py-1.5"
                    style={inputStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReel(r.slug)}
                    className="text-xs font-semibold rounded-lg px-3 py-1.5"
                    style={{ ...inputStyle, color: '#c00' }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
        {label} {required && <span style={{ color: 'var(--accent-500)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}
