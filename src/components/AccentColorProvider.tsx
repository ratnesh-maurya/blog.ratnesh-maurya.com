'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface AccentPalette {
  id: string;
  name: string;
  swatch: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

const ACCENT_PALETTES: AccentPalette[] = [
  {
    id: 'blue',
    name: 'Blue',
    swatch: '#0066CC',
    light: {
      '--accent-50': '#EBF5FF', '--accent-100': '#CCE8FF', '--accent-200': '#99D1FF',
      '--accent-300': '#66BAFF', '--accent-400': '#33A3FF', '--accent-500': '#0066CC',
      '--accent-600': '#005299', '--accent-700': '#003D73', '--accent-800': '#00294D',
      '--accent-900': '#001426',
    },
    dark: {
      '--accent-50': '#0F172A', '--accent-100': '#1E293B', '--accent-200': '#334155',
      '--accent-300': '#475569', '--accent-400': '#5B9BD5', '--accent-500': '#6BAED6',
      '--accent-600': '#8BC4E0', '--accent-700': '#A8D4EB', '--accent-800': '#C5E2F0',
      '--accent-900': '#DDE9F5',
    },
  },
  {
    id: 'green',
    name: 'Green',
    swatch: '#059669',
    light: {
      '--accent-50': '#ECFDF5', '--accent-100': '#D1FAE5', '--accent-200': '#A7F3D0',
      '--accent-300': '#6EE7B7', '--accent-400': '#34D399', '--accent-500': '#059669',
      '--accent-600': '#047857', '--accent-700': '#065F46', '--accent-800': '#064E3B',
      '--accent-900': '#022C22',
    },
    dark: {
      '--accent-50': '#0A1F17', '--accent-100': '#132F23', '--accent-200': '#1E4D38',
      '--accent-300': '#2D6A4F', '--accent-400': '#3FA77A', '--accent-500': '#6BCF9F',
      '--accent-600': '#8EDBB6', '--accent-700': '#B3E8CD', '--accent-800': '#D1F2E1',
      '--accent-900': '#E8F9F0',
    },
  },
  {
    id: 'purple',
    name: 'Purple',
    swatch: '#7C3AED',
    light: {
      '--accent-50': '#F5F3FF', '--accent-100': '#EDE9FE', '--accent-200': '#DDD6FE',
      '--accent-300': '#C4B5FD', '--accent-400': '#A78BFA', '--accent-500': '#7C3AED',
      '--accent-600': '#6D28D9', '--accent-700': '#5B21B6', '--accent-800': '#4C1D95',
      '--accent-900': '#2E1065',
    },
    dark: {
      '--accent-50': '#13091F', '--accent-100': '#1E103A', '--accent-200': '#2D1B5E',
      '--accent-300': '#3E2780', '--accent-400': '#6748B0', '--accent-500': '#8B6DC7',
      '--accent-600': '#A78BD8', '--accent-700': '#C3ACE7', '--accent-800': '#DACEEF',
      '--accent-900': '#EDE6F7',
    },
  },
];

const STORAGE_KEY = 'accent-color';
const DEFAULT_ACCENT = 'blue';

interface AccentColorContextType {
  accentId: string;
  setAccentId: (id: string) => void;
  palettes: AccentPalette[];
}

const AccentColorContext = createContext<AccentColorContextType>({
  accentId: DEFAULT_ACCENT,
  setAccentId: () => { },
  palettes: ACCENT_PALETTES,
});

export function useAccentColor() {
  return useContext(AccentColorContext);
}

function applyPalette(paletteId: string) {
  const palette = ACCENT_PALETTES.find((p) => p.id === paletteId) ?? ACCENT_PALETTES[0];
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const vars = isDark ? palette.dark : palette.light;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
  const [accentId, setAccentIdState] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ACCENT_PALETTES.some((p) => p.id === stored)) {
      setAccentIdState(stored);
      applyPalette(stored);
    }
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      applyPalette(localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ACCENT);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const setAccentId = useCallback((id: string) => {
    setAccentIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyPalette(id);
  }, []);

  return (
    <AccentColorContext.Provider value={{ accentId, setAccentId, palettes: ACCENT_PALETTES }}>
      {children}
    </AccentColorContext.Provider>
  );
}
