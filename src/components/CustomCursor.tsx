import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a small crosshair with live (x,y) readout in monospace.
 * Uses mix-blend-mode: difference so it remains visible on both bone and ink.
 * Disabled on touch / coarse pointers.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (labelRef.current) {
        labelRef.current.textContent = `${String(e.clientX).padStart(4, '0')} ${String(
          e.clientY
        ).padStart(4, '0')}`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest('a, button, [data-cursor="link"]');
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(-50%, -50%) scale(${isInteractive ? 3 : 1})`;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.style.cursor = '';
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60]"
      style={{ mixBlendMode: 'difference', willChange: 'transform' }}
    >
      <div className="relative" style={{ transform: 'translate(-50%, -50%)' }}>
        {/* crosshair */}
        <span className="absolute left-1/2 top-1/2 block h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-white" />
        <span className="absolute left-1/2 top-1/2 block h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
        {/* center dot grows on link hover */}
        <span
          ref={dotRef}
          className="absolute left-1/2 top-1/2 block h-1 w-1 rounded-full bg-white transition-transform duration-200"
          style={{ transform: 'translate(-50%, -50%) scale(1)' }}
        />
        {/* readout */}
        <span
          ref={labelRef}
          className="absolute left-4 top-4 whitespace-nowrap text-[10px] tracking-[0.18em] text-white/85"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          0000 0000
        </span>
      </div>
    </div>
  );
}
