import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';

/**
 * Fixed bottom statusline — vim/tmux flavored. Three regions:
 *   left:   current section (detected via IntersectionObserver on [data-section])
 *   center: scroll progress %, fps
 *   right:  live UTC clock
 *
 * Foreground/background flips on dark sections (hero, dark labs) by reading
 * `data-tone` attribute on the current section.
 */

function formatClock(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function StatusBar() {
  const [section, setSection] = useState({ id: 'top', label: 'index', tone: 'dark' as 'dark' | 'light' });
  const [progress, setProgress] = useState(0);
  const [fps, setFps] = useState(60);
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const fpsRef = useRef({ last: performance.now(), frames: 0 });

  // scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // current section via IO
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const el = visible.target as HTMLElement;
          setSection({
            id: el.id || el.dataset.section || '',
            label: el.dataset.section || el.id || '',
            tone: (el.dataset.tone as 'dark' | 'light') || 'light',
          });
        }
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: '-30% 0px -30% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // fps counter
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      fpsRef.current.frames += 1;
      const now = performance.now();
      const dt = now - fpsRef.current.last;
      if (dt >= 1000) {
        setFps(Math.round((fpsRef.current.frames * 1000) / dt));
        fpsRef.current.last = now;
        fpsRef.current.frames = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // clock
  useEffect(() => {
    const id = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const dark = section.tone === 'dark';

  // index of current section in nav
  const idx = Math.max(
    0,
    site.nav.findIndex((n) => n.href.slice(1) === section.id)
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-colors duration-500"
      style={{
        background: dark ? 'rgba(20,17,13,0.78)' : 'rgba(244,239,230,0.84)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        color: dark ? 'rgba(244,239,230,0.78)' : '#6b655c',
        borderTop: `1px solid ${dark ? 'rgba(244,239,230,0.12)' : '#d8d4cc'}`,
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] md:px-10">
        <div className="flex items-center gap-3 truncate">
          <span className={dark ? 'text-bone/45' : 'text-ash/70'}>
            § {String(idx).padStart(2, '0')}
          </span>
          <span className="truncate">{section.label}</span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <span>scroll {String(Math.round(progress * 100)).padStart(3, '0')}%</span>
          <span className={dark ? 'text-bone/45' : 'text-ash/70'}>·</span>
          <span>fps {fps}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={dark ? 'text-bone/45' : 'text-ash/70'}>utc{(() => {
            const off = -new Date().getTimezoneOffset() / 60;
            return (off >= 0 ? '+' : '') + off;
          })()}</span>
          <span>{clock}</span>
        </div>
      </div>
    </div>
  );
}
