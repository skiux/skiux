import Reveal from '../components/Reveal';
import SectionLabel from '../components/SectionLabel';
import { site } from '../content/site';

export default function Now() {
  return (
    <section
      id="now"
      data-section="now"
      data-tone="light"
      className="relative w-full bg-bone py-[18vh]"
    >
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        {/* Heading sits on the right side — opposite of manifesto for rhythm */}
        <Reveal className="col-span-12 md:col-span-3 md:col-start-2">
          <SectionLabel section="now" index="§ 05" state="running" />
          <h2
            className="mt-6 leading-[0.92] tracking-[-0.02em] text-charcoal"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 380,
              fontSize: 'clamp(48px, 7vw, 120px)',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Currently<br />
            <em className="text-ash" style={{ fontStyle: 'italic', fontWeight: 320 }}>
              building.
            </em>
          </h2>
        </Reveal>

        {/* List shifted to the right */}
        <div className="col-span-12 md:col-span-7 md:col-start-6">
          {site.now.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * i} as="div">
              <article className="flex items-baseline justify-between gap-6 border-t border-hairline py-7 first:border-t-0 md:py-9">
                <div className="max-w-2xl">
                  <h3
                    className="text-[22px] leading-tight tracking-[-0.01em] text-charcoal md:text-[28px]"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 420 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-2 text-[15px] leading-[1.55] text-ash md:text-[16px]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.detail}
                  </p>
                </div>
                <div
                  className="shrink-0 text-[11px] tracking-[0.22em] text-warm-gray"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.since}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="hairline mt-[16vh]" />
    </section>
  );
}
