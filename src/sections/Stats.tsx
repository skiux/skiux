import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { site } from '../content/site';

/**
 * A 6-tile grid of systems-flavored counters.
 *
 * The 'days since first commit' tile is live (computed from a fixed anchor
 * date). Tiles with `flicker: true` get a slow random low-amplitude wobble to
 * suggest the value is moving but not screaming for attention.
 */

const FIRST_COMMIT = new Date('2018-06-01T00:00:00Z'); // anchor — swap to user's real first commit later

function daysSince(d: Date) {
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.round(ease(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{n.toLocaleString()}</>;
}

export default function Stats() {
  // live value for sinceFirstCommit, refreshed each render
  const live = daysSince(FIRST_COMMIT);

  return (
    <section
      id="stats"
      data-section="stats"
      data-tone="light"
      className="relative w-full bg-bone py-[18vh]"
    >
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        <Reveal className="col-span-12 md:col-span-3 md:col-start-2">
          <SectionLabel section="stats" index="§ 03" state="loaded" />
          <h2
            className="mt-6 leading-[0.92] tracking-[-0.02em] text-charcoal"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 360,
              fontSize: 'clamp(40px, 6vw, 96px)',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            By the<br />
            <em className="text-ash" style={{ fontStyle: 'italic', fontWeight: 320 }}>numbers.</em>
          </h2>
          <p
            className="mt-6 max-w-[22ch] text-[14px] leading-[1.6] text-ash"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Some honest, some rounded, none load-bearing. Read them the way you
            would read an uptime page — for context, not for proof.
          </p>
        </Reveal>

        <ul className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-12 md:col-span-7 md:col-start-6 md:grid-cols-3 md:gap-y-16">
          {site.stats.map((s, i) => {
            const value = s.live === 'sinceFirstCommit' ? live : s.n;
            return (
              <Reveal key={s.label} delay={0.04 * i} as="li">
                <div className="border-t border-hairline pt-4">
                  <div
                    className={`leading-none tracking-[-0.04em] ${s.tone === 'quiet' ? 'text-ash' : 'text-charcoal'}`}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 320,
                      fontSize: 'clamp(48px, 5.6vw, 88px)',
                      fontVariationSettings: '"opsz" 144',
                      animation: s.flicker ? 'pulse 3.4s ease-in-out infinite' : undefined,
                    }}
                  >
                    <CountUp to={value} />
                  </div>
                  <div
                    className="mt-3 text-[10px] uppercase leading-[1.5] tracking-[0.22em] text-warm-gray"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
      <div className="hairline mt-[16vh]" />
    </section>
  );
}
