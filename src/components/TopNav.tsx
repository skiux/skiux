import { useEffect, useState } from 'react';
import { site } from '../content/site';

/**
 * Sticky top nav. Three modes by scroll position:
 *   hero    — transparent, bone foreground (over dark hero)
 *   light   — bone background w/ 1px hairline, charcoal foreground
 *
 * Visual: monospace, ALL-CAPS micro-letters with wide tracking, generous
 * gutters. Logo is `Skiux▮` with a slow blinking caret.
 */
export default function TopNav({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [past, setPast] = useState(false);
  const [caretOn, setCaretOn] = useState(true);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCaretOn((c) => !c), 600);
    return () => clearInterval(id);
  }, []);

  const dark = !past;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: dark ? 'transparent' : 'rgba(244,239,230,0.84)',
        backdropFilter: dark ? 'none' : 'blur(8px)',
        WebkitBackdropFilter: dark ? 'none' : 'blur(8px)',
        color: dark ? '#f4efe6' : '#2a2825',
        borderBottom: dark ? '1px solid transparent' : '1px solid #d8d4cc',
      }}
    >
      <div className="grid grid-cols-12 items-center gap-6 px-6 py-4 md:px-10 md:py-5">
        {/* Logo */}
        <a
          href="#top"
          data-cursor="link"
          className="col-span-2 flex items-baseline gap-1 text-[14px] tracking-[-0.02em] hover:opacity-80 md:col-span-3"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 460 }}
        >
          <span>{site.name}</span>
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '0.5em',
              height: '0.9em',
              background: 'currentColor',
              opacity: caretOn ? 1 : 0.15,
              transform: 'translateY(0.1em)',
              transition: 'opacity 80ms linear',
            }}
          />
        </a>

        {/* Section links — middle, monospace micro caps */}
        <nav
          className="col-span-7 hidden items-center justify-center gap-6 text-[10px] uppercase tracking-[0.32em] md:col-span-6 md:flex"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {site.nav.slice(1).map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-cursor="link"
              className="relative inline-block opacity-65 transition-opacity hover:opacity-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side: ⌘K + handle */}
        <div
          className="col-span-10 flex items-center justify-end gap-4 text-[10px] uppercase tracking-[0.32em] md:col-span-3"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <button
            type="button"
            onClick={onOpenCommand}
            data-cursor="link"
            className="flex items-center gap-2 opacity-65 transition-opacity hover:opacity-100"
            aria-label="Open command palette"
          >
            <span
              className="rounded-[2px] border px-1.5 py-0.5 text-[9px]"
              style={{ borderColor: 'currentColor', opacity: 0.7 }}
            >
              ⌘ K
            </span>
            <span className="hidden md:inline">search</span>
          </button>
          <span className="hidden opacity-45 md:inline">·</span>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            className="opacity-65 transition-opacity hover:opacity-100"
          >
            @{site.handle}
          </a>
        </div>
      </div>
    </header>
  );
}
