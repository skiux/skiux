import { useEffect, useState } from 'react';

/**
 * A right-aligned vertical pseudo-log: a small column of monospace lines that
 * append once a second, rolling old ones off the top. Each line is shaped like
 * a journald entry. Pure decoration — but it *looks* like the site has a heartbeat.
 */

const VERBS = ['boot', 'load', 'sync', 'compact', 'tick', 'flush', 'fsync', 'snap', 'commit', 'gossip'];
const UNITS = ['raft', 'lsm', 'wal', 'tracer', 'index', 'mvcc', 'shard', 'cache', 'kv', 'planner'];

function rand<T>(a: readonly T[]) {
  return a[Math.floor(Math.random() * a.length)];
}

function hex(n = 6) {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

function makeLine() {
  const pad = (n: number) => String(n).padStart(2, '0');
  const d = new Date();
  const ts = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const verb = rand(VERBS);
  const unit = rand(UNITS);
  const dur = Math.floor(Math.random() * 9000 + 80) + 'µs';
  return `${ts}  ${unit.padEnd(7)} ${verb.padEnd(7)} ok 0x${hex()}  ${dur}`;
}

export default function HeroLog() {
  const [lines, setLines] = useState<string[]>(() => Array.from({ length: 8 }, makeLine));

  useEffect(() => {
    const id = setInterval(() => {
      setLines((l) => {
        const next = [...l.slice(1), makeLine()];
        return next;
      });
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <ul
      aria-hidden
      className="space-y-1.5 text-right text-[10px] uppercase tracking-[0.06em] text-bone/40"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {lines.map((line, i) => (
        <li
          key={i}
          style={{
            opacity: 0.25 + (i / lines.length) * 0.75,
            transition: 'opacity 400ms',
          }}
        >
          {line}
        </li>
      ))}
    </ul>
  );
}
