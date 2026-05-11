import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { site } from '../content/site';

export default function Projects() {
  return (
    <section
      id="projects"
      data-section="work"
      data-tone="light"
      className="relative w-full bg-bone py-[18vh]"
    >
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        <Reveal className="col-span-12 md:col-span-3 md:col-start-2">
          <SectionLabel section="work" index="§ 07" state="awaiting commits" level="warn" />
          <p
            className="mt-8 max-w-[18ch] text-[15px] leading-[1.55] text-ash"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            An index, kept honest. The first entries are still under construction;
            they will appear here when they are ready to be read, not before.
          </p>
        </Reveal>

        <ol className="col-span-12 md:col-span-7 md:col-start-6">
          {site.projects.map((p, i) => (
            <Reveal key={p.numeral} delay={0.08 * i} as="li">
              <div className="flex items-baseline gap-8 border-t border-hairline py-10 first:border-t-0 md:py-14">
                <div
                  className="w-12 shrink-0 text-[14px] tracking-[0.18em] text-ash/75 md:w-20 md:text-[15px]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p.numeral}
                </div>
                <div className="flex-1">
                  <h3
                    className="leading-[0.95] tracking-[-0.02em] text-charcoal"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 360,
                      fontSize: 'clamp(36px, 5.5vw, 84px)',
                      fontVariationSettings: '"opsz" 144',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="mt-3 text-[14px] tracking-wide text-ash"
                    style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                  >
                    {p.note}
                  </p>
                </div>
                <div
                  className="hidden shrink-0 self-start text-[11px] tracking-[0.22em] text-ash/75 md:block"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  [ TBD ]
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="hairline mt-[16vh]" />
    </section>
  );
}
