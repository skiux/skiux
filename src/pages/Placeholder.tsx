import SectionLabel from '../components/SectionLabel';

/**
 * Generic "in progress" page used for /notes /lab /work until they get real
 * implementations. Each one ships with a curated B&W backdrop image from
 * Unsplash so the page does not feel naked while waiting for content.
 *
 * Pass `image` as a full URL (we use Unsplash hot-link URLs).
 */
export default function Placeholder({
  title,
  italic,
  blurb,
  image,
  credit,
}: {
  title: string;
  italic: string;
  blurb: string;
  image: string;
  credit: string;
}) {
  return (
    <section
      data-section={title.toLowerCase()}
      data-tone="dark"
      className="relative h-screen w-screen overflow-hidden text-bone"
      style={{ background: '#14110d' }}
    >
      {/* Curated backdrop */}
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.55) contrast(1.05)' }}
      />

      {/* Top + bottom legibility gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0.15) 22%, rgba(20,17,13,0.15) 60%, rgba(20,17,13,0.78) 100%)',
        }}
      />

      {/* Soft procedural grain overlay (subtle, no shader) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'140\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0.7 0\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
          backgroundSize: '140px 140px',
        }}
      />

      <div className="relative z-10 grid h-full w-full grid-cols-12 grid-rows-12 px-6 pb-14 pt-24 md:px-10 md:pb-16 md:pt-28">
        <div className="col-span-12 row-span-1 self-start">
          <SectionLabel
            section={title.toLowerCase()}
            index="§ —"
            level="warn"
            state="under construction"
            light
          />
        </div>

        <div className="col-span-12 row-span-7 row-start-6 self-end md:col-span-9">
          <h1
            className="leading-[0.84] tracking-[-0.04em] text-bone"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 380,
              fontSize: 'clamp(80px, 14vw, 240px)',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {title}
            <span className="block italic text-bone/40" style={{ fontWeight: 320 }}>
              — {italic}
            </span>
          </h1>

          <p
            className="mt-8 max-w-xl text-[15px] leading-[1.65] text-bone/70 md:text-[17px]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {blurb}
          </p>
        </div>

        {/* Bottom-right credit + back link */}
        <div
          className="col-span-12 row-span-2 row-start-11 self-end justify-self-end text-right text-[10px] uppercase tracking-[0.32em] text-bone/45 md:col-span-3"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {credit}
        </div>
      </div>
    </section>
  );
}
