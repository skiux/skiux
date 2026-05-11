import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * A full-bleed charcoal break between sections. The page lives in light neutrals;
 * this is the one moment of inversion — a rhythm beat. Big italic display phrase,
 * scroll-driven word fade-in, a thin baseline ruler. No buttons, no images.
 */
export default function Inverted() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Two phrases stack. Each phrase animates over a different portion of the
  // scroll range so they don't reveal at the same time.
  const yA = useTransform(scrollYProgress, [0.0, 0.35], ['12%', '0%']);
  const oA = useTransform(scrollYProgress, [0.0, 0.35], [0, 1]);
  const yB = useTransform(scrollYProgress, [0.25, 0.6], ['12%', '0%']);
  const oB = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);
  const oRuler = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const tickerX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: '#14110d', color: '#f4efe6' }}
    >
      {/* Top hairline */}
      <motion.div style={{ opacity: oRuler }} className="absolute left-0 right-0 top-0 h-px bg-bone/15" />

      {/* Tickertape sliding across the top — pure mono noise, just for texture */}
      <motion.div
        aria-hidden
        style={{ x: tickerX, fontFamily: 'var(--font-mono)' }}
        className="absolute left-0 right-0 top-0 select-none whitespace-nowrap py-2 text-[9px] uppercase tracking-[0.4em] text-bone/15"
      >
        {Array.from({ length: 8 })
          .map(
            () =>
              '0xff · skiux/index · ' +
              Math.random().toString(16).slice(2, 10) +
              ' · raft · lsm · mapreduce · tracing · '
          )
          .join('')}
      </motion.div>

      <div className="relative grid min-h-[120vh] grid-cols-12 items-center gap-6 px-6 py-[20vh] md:px-10">
        {/* Section index, top-right */}
        <div
          className="col-span-12 self-start text-right text-[10px] uppercase tracking-[0.32em] text-bone/40 md:col-span-2 md:col-start-11"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          § 01.5 — interlude
        </div>

        {/* The phrase, off-axis left, spanning many cols */}
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <motion.p
            style={{
              y: yA,
              opacity: oA,
              fontFamily: 'var(--font-display)',
              fontWeight: 320,
              fontSize: 'clamp(48px, 9vw, 160px)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
            }}
            className="text-balance text-bone"
          >
            Most of what I build is{' '}
            <em className="text-bone/45" style={{ fontStyle: 'italic' }}>
              invisible
            </em>{' '}
            by design.
          </motion.p>

          <motion.p
            style={{
              y: yB,
              opacity: oB,
              fontFamily: 'var(--font-display)',
              fontWeight: 320,
              fontSize: 'clamp(40px, 7vw, 132px)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
            }}
            className="mt-[10vh] text-balance pl-[6vw] text-bone md:pl-[14vw]"
          >
            This page is one of the few places it{' '}
            <em className="text-bone/45" style={{ fontStyle: 'italic' }}>
              is not.
            </em>
          </motion.p>
        </div>

        {/* Footnote at bottom-left, runs in mono */}
        <div
          className="col-span-12 mt-[18vh] flex items-baseline gap-4 text-[10px] uppercase tracking-[0.32em] text-bone/35 md:col-span-6 md:col-start-2"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="inline-block h-px w-12 bg-bone/30" />
          <span>continue ↓</span>
        </div>
      </div>

      {/* Bottom hairline */}
      <motion.div style={{ opacity: oRuler }} className="absolute bottom-0 left-0 right-0 h-px bg-bone/15" />
    </section>
  );
}
