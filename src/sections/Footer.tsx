import LiveClock from '../components/LiveClock';
import { site } from '../content/site';

export default function Footer() {
  return (
    <footer className="relative w-full bg-bone">
      <div className="hairline" />
      <div className="grid w-full grid-cols-12 gap-6 px-6 py-10 md:px-10 md:py-14">
        {/* Big closing line, offset left */}
        <div className="col-span-12 md:col-span-7 md:col-start-2">
          <p
            className="text-balance leading-[1.05] tracking-[-0.02em] text-charcoal"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5.4vw, 84px)',
              fontStyle: 'italic',
              fontWeight: 320,
            }}
          >
            {site.footerLine}
          </p>
        </div>

        {/* Right column: links */}
        <div
          className="col-span-12 flex flex-col gap-3 self-end text-[12px] tracking-[0.18em] text-ash md:col-span-3 md:col-start-9 md:items-end md:text-right"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {site.github && (
            <a className="uppercase transition-colors hover:text-ink" data-cursor="link" href={site.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          )}
          {site.email && (
            <a className="uppercase transition-colors hover:text-ink" data-cursor="link" href={`mailto:${site.email}`}>
              Email ↗
            </a>
          )}
          {site.twitter && (
            <a className="uppercase transition-colors hover:text-ink" data-cursor="link" href={site.twitter} target="_blank" rel="noreferrer">
              X ↗
            </a>
          )}
          <span className="mt-4 text-[10px] uppercase tracking-[0.28em] text-ash/75">
            {site.location} ·
          </span>
        </div>

        {/* Bottom row: monospace meta */}
        <div className="col-span-12 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5 text-[10px] uppercase tracking-[0.28em] text-ash/75 md:col-start-2 md:col-end-12 md:mt-16" style={{ fontFamily: 'var(--font-mono)' }}>
          <span>© 2026 {site.name}</span>
          <LiveClock />
          <span>v0.0.1 · index 001</span>
        </div>
      </div>
    </footer>
  );
}
