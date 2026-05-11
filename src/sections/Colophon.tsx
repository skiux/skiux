import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { site } from '../content/site';

export default function Colophon() {
  return (
    <section
      id="colophon"
      data-section="colophon"
      data-tone="light"
      className="relative w-full bg-paper py-[18vh]"
    >
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        <Reveal className="col-span-12 md:col-span-3 md:col-start-2">
          <SectionLabel section="colophon" index="§ 08" state="loaded" />
          <h2
            className="mt-6 leading-[0.92] tracking-[-0.02em] text-charcoal"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 360,
              fontSize: 'clamp(36px, 5vw, 76px)',
              fontStyle: 'italic',
            }}
          >
            How this<br />was made.
          </h2>
        </Reveal>

        <dl className="col-span-12 grid grid-cols-1 gap-y-6 md:col-span-7 md:col-start-6 md:grid-cols-2 md:gap-x-10">
          {site.colophon.map((row, i) => (
            <Reveal key={row.label} delay={0.05 * i} as="div">
              <div className="border-t border-hairline pt-4">
                <dt
                  className="text-[10px] uppercase tracking-[0.32em] text-ash/75"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {row.label}
                </dt>
                <dd
                  className="mt-2 text-[15px] leading-[1.55] text-charcoal"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {row.value}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
