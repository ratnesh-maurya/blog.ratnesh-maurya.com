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
    swatch: '#0088E6',
    light: {
      '--accent-50': '#E3F2FF', '--accent-100': '#CCE8FF', '--accent-200': '#99D1FF',
      '--accent-300': '#66BAFF', '--accent-400': '#33A3FF', '--accent-500': '#0088E6',
      '--accent-600': '#006BB8', '--accent-700': '#004D8A', '--accent-800': '#00305C',
      '--accent-900': '#00182E',
    },
    dark: {
      '--accent-50': '#0F172A', '--accent-100': '#1E293B', '--accent-200': '#334155',
      '--accent-300': '#475569', '--accent-400': '#5B7BA8', '--accent-500': '#6B8FC9',
      '--accent-600': '#8BA8D4', '--accent-700': '#A8C2E0', '--accent-800': '#C5D6EB',
      '--accent-900': '#DDE5F0',
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
  {
    id: 'orange',
    name: 'Orange',
    swatch: '#EA580C',
    light: {
      '--accent-50': '#FFF7ED', '--accent-100': '#FFEDD5', '--accent-200': '#FED7AA',
      '--accent-300': '#FDBA74', '--accent-400': '#FB923C', '--accent-500': '#EA580C',
      '--accent-600': '#C2410C', '--accent-700': '#9A3412', '--accent-800': '#7C2D12',
      '--accent-900': '#431407',
    },
    dark: {
      '--accent-50': '#1A0F05', '--accent-100': '#2E1A0A', '--accent-200': '#4D2A12',
      '--accent-300': '#6E3B1A', '--accent-400': '#B05C2A', '--accent-500': '#D47842',
      '--accent-600': '#E09565', '--accent-700': '#E8B08A', '--accent-800': '#F0CCB0',
      '--accent-900': '#F7E4D4',
    },
  },
  {
    id: 'pink',
    name: 'Rose',
    swatch: '#E11D48',
    light: {
      '--accent-50': '#FFF1F2', '--accent-100': '#FFE4E6', '--accent-200': '#FECDD3',
      '--accent-300': '#FDA4AF', '--accent-400': '#FB7185', '--accent-500': '#E11D48',
      '--accent-600': '#BE123C', '--accent-700': '#9F1239', '--accent-800': '#881337',
      '--accent-900': '#4C0519',
    },
    dark: {
      '--accent-50': '#1A0810', '--accent-100': '#2E0F1B', '--accent-200': '#4D1A2E',
      '--accent-300': '#6E2642', '--accent-400': '#B04068', '--accent-500': '#D4587F',
      '--accent-600': '#E07A9A', '--accent-700': '#E8A0B5', '--accent-800': '#F0C5D0',
      '--accent-900': '#F7E0E8',
    },
  },
  {
    id: 'teal',
    name: 'Teal',
    swatch: '#0D9488',
    light: {
      '--accent-50': '#F0FDFA', '--accent-100': '#CCFBF1', '--accent-200': '#99F6E4',
      '--accent-300': '#5EEAD4', '--accent-400': '#2DD4BF', '--accent-500': '#0D9488',
      '--accent-600': '#0F766E', '--accent-700': '#115E59', '--accent-800': '#134E4A',
      '--accent-900': '#042F2E',
    },
    dark: {
      '--accent-50': '#0A1A18', '--accent-100': '#102D28', '--accent-200': '#1A4D44',
      '--accent-300': '#266A5E', '--accent-400': '#3B9E8B', '--accent-500': '#5DC0AE',
      '--accent-600': '#80D1C3', '--accent-700': '#A6E0D6', '--accent-800': '#C8EDE7',
      '--accent-900': '#E4F7F3',
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
