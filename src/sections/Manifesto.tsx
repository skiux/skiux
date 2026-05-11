import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import SectionLabel from '../components/SectionLabel';
import { site } from '../content/site';

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      data-section="manifesto"
      data-tone="light"
      className="relative w-full bg-bone py-[22vh]"
    >
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        {/* Log-line label, far left */}
        <Reveal className="col-span-12 md:col-span-3 md:col-start-2">
          <SectionLabel section="manifesto" index="§ 01" state="loaded" />
        </Reveal>

        {/* Body — cols 2–8, deliberately not centered */}
        <div className="col-span-12 md:col-span-9 md:col-start-2">
          <MaskReveal
            mode="words"
            delay={0.05}
            duration={1.0}
            as="p"
            className="mt-6 max-w-[28ch] text-balance text-[28px] leading-[1.22] tracking-[-0.02em] text-charcoal md:max-w-[18ch] md:text-[64px] md:leading-[1.05]"
          >
            {site.manifesto}
          </MaskReveal>

          {/* Hashtag chips */}
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-warm-gray"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {site.hashtags.map((t) => (
              <li
                key={t}
                className="border-b border-warm-gray/30 pb-0.5 transition-colors hover:text-charcoal"
                data-cursor="link"
              >
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Working principles — sub-grid on right, offset down */}
        <div className="col-span-12 mt-[14vh] md:col-span-7 md:col-start-6 md:mt-[18vh]">
          <Reveal>
            <div
              className="mb-8 text-[10px] uppercase tracking-[0.32em] text-warm-gray"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              — working principles
            </div>
          </Reveal>
          <ol className="space-y-8 md:space-y-10">
            {site.principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08} as="li">
                <div className="flex items-baseline gap-6 border-t border-hairline pt-5 md:gap-10">
                  <div
                    className="w-8 shrink-0 text-[10px] uppercase tracking-[0.22em] text-warm-gray md:w-12"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {p.n}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-balance leading-[1.12] tracking-[-0.02em] text-charcoal"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 420,
                        fontSize: 'clamp(22px, 2.6vw, 36px)',
                      }}
                    >
                      {p.t}
                    </h3>
                    <p
                      className="mt-2 max-w-prose text-[14px] leading-[1.6] text-ash"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {p.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <div className="hairline mt-[20vh]" />
    </section>
  );
}
