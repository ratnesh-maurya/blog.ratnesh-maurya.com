'use client';

import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';

export function CodeCopyButton() {
  useEffect(() => {
    const article = document.querySelector('.prose');
    if (!article) return;

    const preBlocks = article.querySelectorAll('pre');
    const buttons: HTMLButtonElement[] = [];

    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      // Wrap pre in relative container if not already
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;

      Object.assign(btn.style, {
        position: 'absolute',
        top: '8px',
        right: '8px',
        padding: '6px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        opacity: '0',
        transition: 'opacity 150ms ease, background 150ms ease',
        zIndex: '10',
        lineHeight: '0',
      });

      wrapper.addEventListener('mouseenter', () => {
        btn.style.opacity = '1';
      });
      wrapper.addEventListener('mouseleave', () => {
        btn.style.opacity = '0';
      });

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code?.textContent ?? pre.textContent ?? '';
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          btn.style.color = 'var(--accent-500)';
          trackEvent('code_copy', 'Engagement', window.location.pathname);
          setTimeout(() => {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
            btn.style.color = 'var(--text-muted)';
          }, 2000);
        } catch {
          // Clipboard API not available
        }
      });

      wrapper.appendChild(btn);
      buttons.push(btn);
    });

    return () => {
      buttons.forEach((btn) => {
        const wrapper = btn.parentElement;
        if (wrapper) {
          const pre = wrapper.querySelector('pre');
          if (pre) {
            wrapper.parentNode?.insertBefore(pre, wrapper);
            wrapper.remove();
          }
        }
      });
    };
  }, []);

  return null;
}
