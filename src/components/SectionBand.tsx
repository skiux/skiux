import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * A scroll-driven transition band between sections. Renders a slim full-width
 * strip with a B&W photo that does a parallax slide as the viewport passes
 * through it. Used to break the bone monotony with a quiet image, *without*
 * giving up the section's editorial typography.
 *
 * Pair this with sections; do not place inside one.
 */
export default function SectionBand({
  image,
  height = 'h-[55vh]',
  caption,
  align = 'right',
}: {
  image: string;
  height?: string;
  caption?: string;
  align?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1.0]);

  return (
    <div
      ref={ref}
      data-section="band"
      data-tone="dark"
      className={`relative w-full overflow-hidden ${height}`}
      style={{ background: '#14110d' }}
    >
      <motion.img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: 'grayscale(1) brightness(0.46) contrast(1.08)',
          y,
          scale,
          willChange: 'transform',
        }}
      />
      {/* SVG grain — same as Hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0.6 0\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
          backgroundSize: '180px 180px',
        }}
      />
      {/* Edge fades — top and bottom blend into the bone-colored sections above/below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: 'linear-gradient(to bottom, #f4efe6, rgba(244,239,230,0))' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: 'linear-gradient(to top, #f4efe6, rgba(244,239,230,0))' }}
      />

      {caption && (
        <div
          className={`absolute bottom-8 z-10 max-w-md text-[10px] uppercase tracking-[0.32em] text-bone/55 ${
            align === 'right' ? 'right-6 text-right md:right-10' : 'left-6 md:left-10'
          }`}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
