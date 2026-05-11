import { useRef } from 'react';
import ShaderOverlay from '../components/ShaderOverlay';
import MaskReveal from '../components/MaskReveal';
import HeroLog from '../components/HeroLog';
import { site } from '../content/site';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={ref}
      data-section="index"
      data-tone="dark"
      className="relative h-screen w-screen overflow-hidden text-bone"
      style={{ background: '#14110d' }}
    >
      {/* WebGL: topographic contour map + sparse hex glyph rain + grain */}
      <ShaderOverlay containerRef={ref} />

      {/* Top + bottom edge gradients for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0) 18%, rgba(20,17,13,0) 55%, rgba(20,17,13,0.7) 100%)',
        }}
      />

      {/* Type layer */}
      <div className="relative z-20 grid h-full w-full grid-cols-12 grid-rows-12 px-6 pb-14 pt-24 md:px-10 md:pb-16 md:pt-28">
        {/* Top-left: index marker with blinking dot */}
        <div
          className="col-span-7 row-span-1 flex items-center gap-3 self-start text-[10px] uppercase tracking-[0.32em] text-bone/55"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone/55" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bone/85" />
          </span>
          <span>Index 001</span>
          <span className="text-bone/30">/</span>
          <span className="hidden text-bone/45 md:inline">a quiet workshop on the long tail</span>
        </div>

        {/* Top-right: hashtags */}
        <div
          className="col-span-5 row-span-1 hidden items-center justify-end gap-x-4 self-start text-[10px] uppercase tracking-[0.28em] text-bone/55 md:flex"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {site.hashtags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Bottom-left: oversized name */}
        <div className="col-span-12 row-span-7 row-start-6 self-end md:col-span-9">
          <MaskReveal
            mode="block"
            delay={0.05}
            duration={0.7}
            className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-bone/60"
          >
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              currently — building things that should not be built alone
            </span>
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

        {/* Bottom-right: live pseudo-log column */}
        <div className="col-span-12 row-span-5 row-start-8 hidden self-end justify-self-end md:col-span-3 md:flex">
          <HeroLog />
        </div>

        {/* Bottom-left scroll cue */}
        <div
          className="absolute bottom-12 left-6 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone/45 md:bottom-14 md:left-10"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="inline-block h-px w-10 bg-bone/30" />
          <span style={{ animation: 'pulse 2.4s ease-in-out infinite' }}>↓ scroll · or press ⌘K</span>
        </div>
      </div>
    </section>
  );
}
