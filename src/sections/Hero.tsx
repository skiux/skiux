import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskReveal from '../components/MaskReveal';
import HeroLog from '../components/HeroLog';
import { site } from '../content/site';

/**
 * Hero — full-bleed B&W photo backdrop (Unsplash, downloaded locally) with
 * a slow ken-burns zoom and scroll-driven parallax.
 *
 * The previous version had an opaque WebGL shader covering the photo — it has
 * been removed; the only overlays now are an SVG grain texture and edge
 * gradients for legibility.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Scroll-driven parallax: backdrop slides up faster than content as user
  // scrolls past Hero, creating a depth effect.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      data-section="index"
      data-tone="dark"
      className="relative h-screen w-screen overflow-hidden text-bone"
      style={{ background: '#14110d' }}
    >
      {/* Backdrop — local file, parallax + slow ken-burns zoom */}
      <motion.img
        src="/img/hero-fog.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: 'grayscale(1) brightness(0.5) contrast(1.08)',
          y: imgY,
          scale: imgScale,
          transformOrigin: '50% 45%',
          willChange: 'transform',
          animation: 'kenburns 22s ease-out infinite alternate',
        }}
      />

      {/* SVG grain — procedural, very subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0.65 0\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
          backgroundSize: '180px 180px',
        }}
      />

      {/* Legibility gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,17,13,0.45) 0%, rgba(20,17,13,0.05) 22%, rgba(20,17,13,0.05) 55%, rgba(20,17,13,0.78) 100%)',
        }}
      />

      {/* Type layer */}
      <motion.div
        className="relative z-20 grid h-full w-full grid-cols-12 grid-rows-12 px-6 pb-14 pt-24 md:px-10 md:pb-16 md:pt-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Top-left: index marker */}
        <div
          className="col-span-7 row-span-1 flex items-center gap-3 self-start text-[10px] uppercase tracking-[0.32em] text-bone/65"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bone" />
          </span>
          <span>Index 001</span>
          <span className="text-bone/40">/</span>
          <span className="hidden text-bone/55 md:inline">a quiet workshop on the long tail</span>
        </div>

        {/* Top-right: hashtags */}
        <div
          className="col-span-5 row-span-1 hidden items-center justify-end gap-x-4 self-start text-[10px] uppercase tracking-[0.28em] text-bone/65 md:flex"
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
            className="mb-4 inline-block text-[10px] uppercase tracking-[0.4em] text-bone/70"
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
              <span className="block italic text-bone/55" style={{ fontWeight: 320 }}>
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
          className="absolute bottom-12 left-6 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-bone/55 md:bottom-14 md:left-10"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span className="inline-block h-px w-10 bg-bone/40" />
          <span style={{ animation: 'pulse 2.4s ease-in-out infinite' }}>↓ scroll · or press ⌘K</span>
        </div>
      </motion.div>

      {/* Photo credit, tiny, bottom-right */}
      <div
        className="absolute bottom-12 right-6 z-20 text-[9px] uppercase tracking-[0.28em] text-bone/35 md:bottom-14 md:right-10"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        photo · eberhard grossgasteiger / unsplash
      </div>
    </section>
  );
}
