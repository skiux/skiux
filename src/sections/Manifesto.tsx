import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import MaskReveal from '../components/MaskReveal';
import { site } from '../content/site';

const tags = ['#storage', '#consensus', '#observability', '#systems'];

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative w-full bg-bone py-[22vh]">
      <div className="grid w-full grid-cols-12 gap-6 px-6 md:px-10">
        {/* Section label, far left */}
        <Reveal className="col-span-12 md:col-span-2">
          <div
            className="text-[10px] uppercase tracking-[0.32em] text-ash/80"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="mr-3 text-warm-gray">§ 01</span>
            Manifesto
          </div>
        </Reveal>

        {/* Body — cols 2–8, deliberately not centered */}
        <div className="col-span-12 md:col-span-7 md:col-start-2">
          <MaskReveal
            mode="words"
            delay={0.05}
            duration={1.0}
            as="p"
            className="text-balance text-[26px] leading-[1.32] tracking-[-0.01em] text-charcoal md:text-[36px] md:leading-[1.22]"
          >
            {site.manifesto}
          </MaskReveal>

          {/* Hashtag chips — small, mono, sit under the paragraph */}
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-warm-gray"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {tags.map((t) => (
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

        {/* Right-side margin note, monospace */}
        <Reveal
          delay={0.25}
          className="col-span-12 mt-4 md:col-span-2 md:col-start-10 md:mt-2"
        >
          <p
            className="text-[11px] leading-relaxed text-warm-gray"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            — written once,<br />
            re-read often.
          </p>
        </Reveal>
      </div>

      <div className="hairline mt-[20vh]" />
    </section>
  );
}
