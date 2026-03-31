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
      '--accent-50': '#0A0A0B', '--accent-100': '#111218', '--accent-200': '#1A1E2E',
      '--accent-300': '#2A3550', '--accent-400': '#4D9EE8', '--accent-500': '#3B8FE4',
      '--accent-600': '#60A9F0', '--accent-700': '#8BC2F5', '--accent-800': '#B5D9F9',
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
  {
    id: 'rose',
    name: 'Rose',
    swatch: '#E11D48',
    light: {
      '--accent-50': '#FFF1F2', '--accent-100': '#FFE4E6', '--accent-200': '#FECDD3',
      '--accent-300': '#FDA4AF', '--accent-400': '#FB7185', '--accent-500': '#E11D48',
      '--accent-600': '#BE123C', '--accent-700': '#9F1239', '--accent-800': '#881337',
      '--accent-900': '#4C0519',
    },
    dark: {
      '--accent-50': '#1A0A10', '--accent-100': '#2E1220', '--accent-200': '#4A1E35',
      '--accent-300': '#6E2B4A', '--accent-400': '#E04070', '--accent-500': '#F43F6E',
      '--accent-600': '#F76B8A', '--accent-700': '#FA9AB0', '--accent-800': '#FCCDD5',
      '--accent-900': '#FEE7EB',
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
      '--accent-50': '#1A0F08', '--accent-100': '#2E1A0E', '--accent-200': '#4A2A18',
      '--accent-300': '#6E3E22', '--accent-400': '#E07830', '--accent-500': '#F08C40',
      '--accent-600': '#F5A862', '--accent-700': '#F8C48A', '--accent-800': '#FBDDB5',
      '--accent-900': '#FDF0E0',
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
      '--accent-50': '#0A1A18', '--accent-100': '#122C28', '--accent-200': '#1A4640',
      '--accent-300': '#256058', '--accent-400': '#38A89A', '--accent-500': '#5CC8BC',
      '--accent-600': '#80D8CE', '--accent-700': '#A8E8E0', '--accent-800': '#CCF2ED',
      '--accent-900': '#E8FAF7',
    },
  },
  {
    id: 'red',
    name: 'Red',
    swatch: '#DC2626',
    light: {
      '--accent-50': '#FEF2F2', '--accent-100': '#FEE2E2', '--accent-200': '#FECACA',
      '--accent-300': '#FCA5A5', '--accent-400': '#F87171', '--accent-500': '#DC2626',
      '--accent-600': '#B91C1C', '--accent-700': '#991B1B', '--accent-800': '#7F1D1D',
      '--accent-900': '#450A0A',
    },
    dark: {
      '--accent-50': '#1A0A0A', '--accent-100': '#2E1212', '--accent-200': '#4A1E1E',
      '--accent-300': '#6E2B2B', '--accent-400': '#E04040', '--accent-500': '#EF4444',
      '--accent-600': '#F47070', '--accent-700': '#F8A0A0', '--accent-800': '#FBCCCC',
      '--accent-900': '#FDE8E8',
    },
  },
];

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
  const palette = ACCENT_PALETTES.find((p) => p.id === paletteId)?.id ?? DEFAULT_ACCENT;
  document.documentElement.setAttribute('data-accent', palette);
}

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
  const [accentId, setAccentIdState] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    let initial = DEFAULT_ACCENT;
    try {
      const stored = localStorage.getItem('accent_color');
      if (stored && ACCENT_PALETTES.some(p => p.id === stored)) initial = stored;
    } catch { /* ignore */ }
    setAccentIdState(initial);
    applyPalette(initial);
  }, []);

  const setAccentId = useCallback((id: string) => {
    setAccentIdState(id);
    applyPalette(id);
    try { localStorage.setItem('accent_color', id); } catch { /* ignore */ }
  }, []);

  return (
    <AccentColorContext.Provider value={{ accentId, setAccentId, palettes: ACCENT_PALETTES }}>
      {children}
    </AccentColorContext.Provider>
  );
}
