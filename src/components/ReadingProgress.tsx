'use client';

import { useEffect, useRef } from 'react';

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5" style={{ backgroundColor: 'var(--border)' }}>
      <div
        ref={barRef}
        className="h-full will-change-transform"
        style={{
          background: 'linear-gradient(90deg, var(--accent-400), var(--accent-500))',
          transformOrigin: 'left',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
