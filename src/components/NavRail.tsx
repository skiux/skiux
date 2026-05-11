import { useRef, useState } from 'react';

const items = [
  { label: 'INDEX', href: '#top' },
  { label: 'NOW', href: '#now' },
  { label: 'WORK', href: '#projects' },
  { label: 'COLOPHON', href: '#colophon' },
];

export default function NavRail() {
  const refs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [lineY, setLineY] = useState<number | null>(null);

  const onEnter = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setLineY(r.top + r.height / 2);
  };

  return (
    <>
      <nav
        className="flex flex-col items-end gap-3 text-[11px] uppercase tracking-[0.22em] text-bone/75"
        style={{ fontFamily: 'var(--font-mono)' }}
        onMouseLeave={() => setLineY(null)}
      >
        {items.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            data-cursor="link"
            ref={(el) => {
              refs.current[i] = el;
            }}
            onMouseEnter={() => onEnter(i)}
            className="py-1 transition-colors duration-300 hover:text-bone"
          >
            {item.label}
          </a>
        ))}
      </nav>
      {lineY !== null && (
        <span
          aria-hidden
          className="pointer-events-none fixed left-0 right-0 z-30 h-px bg-bone/25 transition-opacity duration-300"
          style={{ top: lineY }}
        />
      )}
    </>
  );
}
