import { useRef } from 'react';
import ShaderOverlay from '../components/ShaderOverlay';
import LiveClock from '../components/LiveClock';
import NavRail from '../components/NavRail';
import MaskReveal from '../components/MaskReveal';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-screen w-screen overflow-hidden text-bone"
      style={{ background: '#14110d' }}
    >
      {/* Generative shader: contour map + hex glyph rain + grain — this IS the hero */}
      <ShaderOverlay containerRef={ref} />

      {/* Top + bottom edge gradients for legibility (very subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0) 18%, rgba(20,17,13,0) 55%, rgba(20,17,13,0.65) 100%)',
        }}
      />

      {/* Type layer */}
      <div className="relative z-20 grid h-full w-full grid-cols-12 grid-rows-12 px-6 py-6 md:px-10 md:py-8">
        {/* Top-left: index mark with live blinking dot */}
        <div
          className="col-span-6 row-span-1 flex items-center gap-3 self-start text-[10px] uppercase tracking-[0.32em] text-bone/65"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bone/90" />
          </span>
          <span>Index 001 · Skiux</span>
          <span className="ml-3 hidden text-bone/35 md:inline">/ a quiet workshop on the long tail</span>
        </div>

        {/* Top-right: live clock */}
        <div className="col-span-6 row-span-1 self-start justify-self-end text-[10px] tracking-wide text-bone/65">
          <LiveClock />
        </div>

        {/* Bottom-left: oversized name, broken to two lines, extending toward the edge */}
        <div className="col-span-12 row-span-7 row-start-6 self-end md:col-span-10">
          {/* small kicker */}
          <MaskReveal
            mode="block"
            delay={0.05}
            duration={0.7}
            className="mb-3 inline-block text-[10px] uppercase tracking-[0.4em] text-bone/55"
          >
            <span style={{ fontFamily: 'var(--font-mono)' }}>Currently — building things that should not be built alone</span>
          </MaskReveal>

          <h1
            className="relative leading-[0.82] tracking-[-0.04em] text-bone"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 380,
              fontSize: 'clamp(96px, 18vw, 320px)',
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
            }}
          >
            <MaskReveal mode="chars" delay={0.15} duration={0.95} whileInView={false} as="span" className="block">
              Skiux
            </MaskReveal>
            <MaskReveal mode="block" delay={0.6} duration={1.0} whileInView={false} as="span">
              <span className="block italic text-bone/45" style={{ fontWeight: 320 }}>
                — systems, slowly.
              </span>
            </MaskReveal>
          </h1>
        </div>

        {/* Bottom-right: nav rail */}
        <div className="col-span-12 row-span-2 row-start-11 self-end justify-self-end md:col-span-2 md:row-span-6 md:row-start-7">
          <NavRail />
        </div>

        {/* Bottom-left scroll cue, very low contrast */}
        <div
          className="absolute bottom-6 left-6 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone/40 md:bottom-8 md:left-10"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="inline-block h-px w-10 bg-bone/30" />
          <span style={{ animation: 'pulse 2.4s ease-in-out infinite' }}>↓ scroll · or press G</span>
        </div>
      </div>
    </section>
  );
}
