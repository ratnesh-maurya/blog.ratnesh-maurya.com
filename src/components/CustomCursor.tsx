'use client';

import { useState, useEffect } from 'react';

const RADIUS = 500;
const FALLBACK_GLOW = 'rgba(0, 136, 230, 0.06)';

function getCursorGlowColor(): string {
  if (typeof document === 'undefined') return FALLBACK_GLOW;
  const value = getComputedStyle(document.documentElement).getPropertyValue('--cursor-glow').trim();
  return value || FALLBACK_GLOW;
}

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowColor, setGlowColor] = useState(FALLBACK_GLOW);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setVisible(true);
    setGlowColor(getCursorGlowColor());

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setGlowColor(getCursorGlowColor());
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(${RADIUS}px at ${position.x}px ${position.y}px, ${glowColor}, transparent 55%)`,
      }}
      aria-hidden
    />
  );
}
