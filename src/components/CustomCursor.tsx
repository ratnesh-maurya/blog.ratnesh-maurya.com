'use client';

import { useState, useEffect } from 'react';

const RADIUS = 500;
const GLOW_COLOR = 'rgba(20, 184, 166, 0.06)';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setVisible(true);

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(${RADIUS}px at ${position.x}px ${position.y}px, ${GLOW_COLOR}, transparent 55%)`,
      }}
      aria-hidden
    />
  );
}
