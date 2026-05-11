/**
 * Log-line section label: `[2026-05-12 22:47:13] info :: <name> -- loaded`
 *
 * Color-coded levels mimic systemd-style logs without being noisy.
 * `light={true}` renders inverted (bone tones) for dark sections.
 */
import { useState } from 'react';

type Level = 'info' | 'warn' | 'debug';

function ts() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const lightTone = {
  base: 'text-bone/70',
  dim: 'text-bone/40',
  accent: 'text-bone/90',
};

const darkTone = {
  base: 'text-ash',      // #6b655c · ~5.6 on bone
  dim: 'text-ash/65',    // legible
  accent: 'text-charcoal', // #2a2825 · strong
};

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
  const t = light ? lightTone : darkTone;

  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11px] tracking-[0.18em] ${t.base}`}
      style={{ fontFamily: 'var(--font-mono)', textTransform: 'lowercase' }}
    >
      <span className={t.dim}>[{stamp}]</span>
      <span className={t.dim}>{level}</span>
      <span className={t.dim}>::</span>
      {index && <span className={`${t.accent} uppercase`}>{index}</span>}
      <span className={`${t.accent} uppercase`}>{section}</span>
      <span className={t.dim}>—</span>
      <span className={t.base}>{state}</span>
    </div>
  );
}
