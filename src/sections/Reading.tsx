import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { site } from '../content/site';

/**
 * Reading — a compact editorial list of papers and books currently in
 * rotation. Two columns on desktop. Kind (paper / book) is shown as a
 * monospace tag. No covers, no images.
 */
export default function Reading() {
  return (
    <section
      id="reading"
      data-section="reading"
      data-tone="light"
      className="relative w-full bg-bone py-[18vh]"
    >
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        <Reveal className="col-span-12 md:col-span-3 md:col-start-2">
          <SectionLabel section="reading" index="§ 06" state="open" />
          <h2
            className="mt-6 leading-[0.92] tracking-[-0.02em] text-charcoal"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 360,
              fontSize: 'clamp(40px, 6vw, 96px)',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            On the<br />
            <em className="text-ash" style={{ fontStyle: 'italic', fontWeight: 320 }}>desk.</em>
          </h2>
          <p
            className="mt-6 max-w-[24ch] text-[14px] leading-[1.6] text-ash"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            A short queue. Most of these are revisits — distributed systems
            ages slowly, and the first read is rarely the last.
          </p>
        </Reveal>

        <ul className="col-span-12 md:col-span-7 md:col-start-6">
          {site.reading.map((r, i) => (
            <Reveal key={r.title} delay={0.04 * i} as="li">
              <div className="flex items-baseline gap-6 border-t border-hairline py-6 first:border-t-0 md:py-7">
                <div
                  className="w-16 shrink-0 text-[10px] uppercase tracking-[0.32em] text-warm-gray md:w-20"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {r.kind}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-balance leading-[1.18] tracking-[-0.01em] text-charcoal"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 420,
                      fontSize: 'clamp(18px, 2vw, 26px)',
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    className="mt-1.5 text-[13px] italic leading-[1.5] text-ash"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {r.who} · {r.year}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
      <div className="hairline mt-[16vh]" />
    </section>
  );
}
