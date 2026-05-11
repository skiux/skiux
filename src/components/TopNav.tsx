import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { site } from '../content/site';

/**
 * Sticky top nav.
 *
 * Mode A — on the home page (route '/'): transparent over the dark Hero,
 *           flips to bone + hairline once past 85% of the first viewport.
 * Mode B — on every other route: always light (bone + hairline) since those
 *           pages start with their own full-bleed dark hero.
 *
 * Highlights the active route. Soon-pages get a small `· soon` tag.
 */
export default function TopNav({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [past, setPast] = useState(false);
  const [caretOn, setCaretOn] = useState(true);

  useEffect(() => {
    if (!isHome) {
      setPast(false);
      return;
    }
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    const id = setInterval(() => setCaretOn((c) => !c), 600);
    return () => clearInterval(id);
  }, []);

  // Dark = transparent + bone text. Only home (before scrolling past hero) qualifies.
  const dark = isHome && !past;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: dark ? 'transparent' : 'rgba(244,239,230,0.86)',
        backdropFilter: dark ? 'none' : 'blur(10px)',
        WebkitBackdropFilter: dark ? 'none' : 'blur(10px)',
        color: dark ? '#f4efe6' : '#2a2825',
        borderBottom: dark ? '1px solid transparent' : '1px solid #d8d4cc',
      }}
    >
      <div className="grid grid-cols-12 items-center gap-6 px-6 py-4 md:px-10 md:py-5">
        {/* Logo */}
        <Link
          to="/"
          data-cursor="link"
          className="col-span-3 flex items-baseline gap-1 text-[15px] tracking-[-0.02em] transition-opacity hover:opacity-80 md:col-span-3"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 460 }}
        >
          <span>{site.name}</span>
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '0.5em',
              height: '0.95em',
              background: 'currentColor',
              opacity: caretOn ? 1 : 0.15,
              transform: 'translateY(0.12em)',
              transition: 'opacity 80ms linear',
            }}
          />
        </Link>

        {/* Route links — center */}
        <nav
          className="col-span-6 hidden items-center justify-center gap-8 text-[11px] uppercase tracking-[0.32em] md:flex"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {site.nav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                data-cursor="link"
                className="relative inline-flex items-baseline gap-1.5"
                style={{ opacity: active ? 1 : 0.62 }}
              >
                <span>{item.label}</span>
                {item.soon && (
                  <span
                    className="ml-1 text-[9px] tracking-[0.28em]"
                    style={{ opacity: 0.55 }}
                  >
                    · soon
                  </span>
                )}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                  style={{
                    width: active ? '100%' : 0,
                    background: 'currentColor',
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: ⌘K + handle */}
        <div
          className="col-span-9 flex items-center justify-end gap-4 text-[10px] uppercase tracking-[0.32em] md:col-span-3"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <button
            type="button"
            onClick={onOpenCommand}
            data-cursor="link"
            className="flex items-center gap-2 transition-opacity hover:opacity-100"
            style={{ opacity: 0.75 }}
            aria-label="Open command palette"
          >
            <span
              className="rounded-[2px] border px-1.5 py-0.5 text-[9px]"
              style={{ borderColor: 'currentColor' }}
            >
              ⌘ K
            </span>
            <span className="hidden md:inline">search</span>
          </button>
          <span className="hidden opacity-50 md:inline">·</span>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            className="transition-opacity hover:opacity-100"
            style={{ opacity: 0.75 }}
          >
            @{site.handle}
          </a>
        </div>
      </div>
    </header>
  );
}
