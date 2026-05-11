import { useEffect, useRef, useState } from 'react';
import SectionLabel from '../components/SectionLabel';

/**
 * Field 02 — ASCII Rain.
 *
 * A canvas runs a column-based character rain (think a quiet, monochrome
 * Matrix). When the user types into the inline input, the typed characters
 * are injected at random columns and ride the rain down with higher
 * brightness, eventually fading out.
 *
 * Pure Canvas 2D + monospace text rendering.
 */

const COLOR_BG = '#14110d';
const COLOR_HOT = 'rgba(244, 239, 230, 0.92)';
const CHARSET = '01234567890abcdefghi[]{}<>·/\\=+*-';

type Drop = { col: number; y: number; speed: number; chars: string[]; injected?: boolean; life: number };

export default function LabField02() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const colsRef = useRef(0);
  const cellRef = useRef({ w: 12, h: 18 });
  const visibleRef = useRef(true);
  const [echo, setEcho] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // pick cell size based on width
      const cellW = w < 700 ? 11 : 13;
      const cellH = w < 700 ? 16 : 19;
      cellRef.current = { w: cellW, h: cellH };
      colsRef.current = Math.floor(w / cellW);

      // seed drops, one per column at random y
      dropsRef.current = Array.from({ length: colsRef.current }, (_, col) => ({
        col,
        y: Math.random() * h,
        speed: 0.6 + Math.random() * 1.6,
        chars: Array.from({ length: 18 }, () => CHARSET[Math.floor(Math.random() * CHARSET.length)]),
        life: 1,
      }));
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      layout();
    };

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(section);

    layout();
    window.addEventListener('resize', onResize);

    const draw = () => {
      if (visibleRef.current) {
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const { w: cellW, h: cellH } = cellRef.current;

        // motion blur via translucent fill
        ctx.fillStyle = 'rgba(20, 17, 13, 0.18)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = `${cellH - 4}px var(--font-mono), ui-monospace, monospace`;
        ctx.textBaseline = 'top';

        for (const d of dropsRef.current) {
          d.y += d.speed;
          if (d.y > h + d.chars.length * cellH) {
            // recycle
            d.y = -d.chars.length * cellH;
            d.speed = 0.6 + Math.random() * 1.6;
            d.injected = false;
            d.life = 1;
            d.chars = Array.from({ length: 16 + Math.floor(Math.random() * 8) }, () =>
              CHARSET[Math.floor(Math.random() * CHARSET.length)]
            );
          }

          for (let i = 0; i < d.chars.length; i++) {
            const charY = d.y - i * cellH;
            if (charY < -cellH || charY > h) continue;
            // head bright, tail dim
            const tFade = 1 - i / d.chars.length;
            const isHead = i === 0;
            const baseAlpha = (isHead ? 0.85 : 0.12 + 0.55 * tFade) * d.life;
            ctx.fillStyle = d.injected
              ? `rgba(244, 239, 230, ${baseAlpha})`
              : `rgba(180, 170, 150, ${baseAlpha * 0.35})`;
            // occasional flicker / char mutation for non-injected
            if (!d.injected && Math.random() < 0.02) {
              d.chars[i] = CHARSET[Math.floor(Math.random() * CHARSET.length)];
            }
            ctx.fillText(d.chars[i], d.col * cellW, charY);
          }

          if (d.injected) d.life *= 0.997;
        }

        // edges
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(20,17,13,0.55)');
        grad.addColorStop(0.15, 'rgba(20,17,13,0)');
        grad.addColorStop(0.85, 'rgba(20,17,13,0)');
        grad.addColorStop(1, 'rgba(20,17,13,0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, []);

  // Inject typed letters into the rain at random columns.
  const inject = (text: string) => {
    const cols = colsRef.current;
    if (cols === 0) return;
    const drops = dropsRef.current;
    for (const ch of text) {
      const col = Math.floor(Math.random() * cols);
      const d = drops[col];
      if (!d) continue;
      const insertChars = [
        ch,
        CHARSET[Math.floor(Math.random() * CHARSET.length)],
        CHARSET[Math.floor(Math.random() * CHARSET.length)],
      ];
      d.chars = [...insertChars, ...d.chars].slice(0, 22);
      d.injected = true;
      d.life = 1;
      d.speed = 0.8 + Math.random() * 1.2;
      d.y = -2 * cellRef.current.h;
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // only inject the newly-typed tail
    if (v.length > echo.length) {
      inject(v.slice(echo.length));
    }
    setEcho(v);
  };

  // ARIA-friendly placeholder hint
  return (
    <section
      ref={sectionRef}
      id="field-02"
      data-section="field-02"
      data-tone="dark"
      className="relative w-full overflow-hidden"
      style={{ background: COLOR_BG, height: '90vh', color: '#f4efe6' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* top/bottom hairlines */}
      <div className="absolute left-0 right-0 top-0 h-px bg-bone/10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-bone/10" />

      <div className="relative z-10 grid h-full w-full grid-cols-12 gap-6 px-6 py-[12vh] md:px-10">
        <div className="col-span-12 self-start md:col-span-7 md:col-start-2">
          <SectionLabel section="field" index="§ 04" state="awaiting input" light />

          <h2
            className="mt-6 leading-[0.94] tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 360,
              fontSize: 'clamp(48px, 7.5vw, 128px)',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Field 02 — <em className="text-bone/55" style={{ fontStyle: 'italic', fontWeight: 320 }}>say something.</em>
          </h2>

          <p
            className="mt-6 max-w-md text-[14px] leading-[1.6] text-bone/65"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Type below and watch your letters scatter into the rain. There is no
            log, no submission, no save. It is mostly an excuse to make a text
            input feel a little alive.
          </p>
        </div>

        {/* input area, right side */}
        <div className="col-span-12 self-end md:col-span-9 md:col-start-2">
          <div
            className="flex items-center gap-3 border-b border-bone/25 pb-2"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span
              className="text-[12px] tracking-[0.2em] text-bone/55"
              style={{ color: COLOR_HOT, opacity: 0.55 }}
              aria-hidden
            >
              ▸
            </span>
            <input
              type="text"
              value={echo}
              onChange={onInput}
              placeholder="type here..."
              data-cursor="text"
              maxLength={200}
              className="w-full bg-transparent text-[18px] tracking-tight text-bone outline-none placeholder-bone/30 md:text-[24px]"
            />
            <span
              className="hidden text-[10px] uppercase tracking-[0.32em] text-bone/35 md:inline"
            >
              {echo.length.toString().padStart(3, '0')} / 200
            </span>
          </div>
          <div
            className="mt-2 text-[10px] uppercase tracking-[0.32em] text-bone/35"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            characters are injected at random columns · they fade with age
          </div>
        </div>

        {/* edge legend */}
        <div
          className="col-span-12 self-end justify-self-end text-right text-[10px] uppercase tracking-[0.32em] text-bone/45 md:col-span-3 md:col-start-10"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          ↓ they fall down ↓
        </div>
      </div>
    </section>
  );
}
