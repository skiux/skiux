/**
 * Log-line section label: `[2026-05-12 22:47:13] info :: <name> -- loaded`
 *
 * Color-coded levels mimic systemd-style logs without being noisy:
 *   info  = ash
 *   warn  = warm-gray (italic)
 *   debug = warm-gray (dim)
 *
 * The timestamp is rendered once at mount — it represents *the moment the
 * section was loaded* into the page, which is true enough.
 */
import { useState } from 'react';

type Level = 'info' | 'warn' | 'debug';

const levelStyles: Record<Level, string> = {
  info: 'text-ash',
  warn: 'text-ash italic',
  debug: 'text-warm-gray',
};

function ts() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function SectionLabel({
  section,
  level = 'info',
  state = 'loaded',
  index,
  light = false,
}: {
  section: string;
  level?: Level;
  state?: string;
  index?: string;
  light?: boolean;
}) {
  const [stamp] = useState(ts);

  return (
    <div
      className={`flex items-baseline gap-2 text-[10px] uppercase tracking-[0.22em] ${
        light ? 'text-bone/55' : levelStyles[level]
      }`}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <span className={light ? 'text-bone/30' : 'text-warm-gray'}>[{stamp}]</span>
      <span className={light ? 'text-bone/45' : 'text-warm-gray'}>{level}</span>
      <span className={light ? 'text-bone/30' : 'text-warm-gray'}>::</span>
      {index && <span className={light ? 'text-bone/60' : ''}>{index}</span>}
      <span>{section}</span>
      <span className={light ? 'text-bone/30' : 'text-warm-gray'}>—</span>
      <span className={light ? 'text-bone/50' : 'text-ash'}>{state}</span>
    </div>
  );
}
