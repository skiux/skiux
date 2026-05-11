import { useEffect, useRef } from 'react';
import SectionLabel from '../components/SectionLabel';

/**
 * Field 01 — Adaptive Grid.
 *
 * A grid of N points lives on a dark canvas. Each frame the points are pulled
 * slightly toward the cursor (within a radius) and a noise-driven drift moves
 * them otherwise. Neighbouring points are joined by a thin bone-tinted line
 * whose opacity falls off with distance, producing a Delaunay-ish web.
 *
 * No three.js — just Canvas 2D. ~600 points, 60fps on a 13" MBP.
 */

type Pt = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; phase: number };

export default function LabField01() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let points: Pt[] = [];
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, on: 0 };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // build a slightly jittered grid
      const cols = Math.max(18, Math.round(w / 56));
      const rows = Math.max(10, Math.round(h / 56));
      const stepX = w / (cols - 1);
      const stepY = h / (rows - 1);
      points = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const jx = (Math.random() - 0.5) * stepX * 0.35;
          const jy = (Math.random() - 0.5) * stepY * 0.35;
          const x = i * stepX + jx;
          const y = j * stepY + jy;
          points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2 });
        }
      }
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      layout();
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inside) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.on = 1;
      } else {
        mouse.on = 0;
      }
    };

    const onLeave = () => {
      mouse.on = 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(section);

    layout();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    const radius = 180;
    const force = 90;
    const linkDist = 78;
    const linkDist2 = linkDist * linkDist;

    const draw = (t: number) => {
      if (visible) {
        // background — very dark warm charcoal
        ctx.fillStyle = '#14110d';
        ctx.fillRect(0, 0, w, h);

        // update points
        const time = t * 0.0006;
        for (const p of points) {
          // gentle drift toward original position
          const dxo = p.ox - p.x;
          const dyo = p.oy - p.y;
          p.vx += dxo * 0.012;
          p.vy += dyo * 0.012;

          // mouse repel
          if (mouse.on > 0) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < radius * radius && d2 > 0.1) {
              const d = Math.sqrt(d2);
              const falloff = 1 - d / radius;
              const f = (force * falloff * falloff) / d;
              p.vx += dx * f * 0.02;
              p.vy += dy * f * 0.02;
            }
          }

          // small noise breathing
          p.vx += Math.cos(time + p.phase) * 0.04;
          p.vy += Math.sin(time * 1.3 + p.phase) * 0.04;

          // damp
          p.vx *= 0.86;
          p.vy *= 0.86;

          p.x += p.vx;
          p.y += p.vy;
        }

        // lines: pairs within linkDist
        ctx.lineWidth = 0.7;
        const n = points.length;
        for (let i = 0; i < n; i++) {
          const a = points[i];
          for (let j = i + 1; j < n; j++) {
            const b = points[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < linkDist2) {
              const alpha = 1 - Math.sqrt(d2) / linkDist;
              ctx.strokeStyle = `rgba(244, 239, 230, ${0.06 + alpha * 0.18})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        // points: tiny bone dots
        ctx.fillStyle = 'rgba(244, 239, 230, 0.55)';
        for (const p of points) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="field-01"
      data-section="field-01"
      data-tone="dark"
      className="relative w-full overflow-hidden"
      style={{ background: '#14110d', height: '95vh', color: '#f4efe6' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Edge fade to bone above/below for graceful joining */}
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

      {/* Caption layer */}
      <div className="relative z-10 grid h-full w-full grid-cols-12 gap-6 px-6 py-[12vh] md:px-10">
        <div className="col-span-12 self-start md:col-span-7 md:col-start-2">
          <SectionLabel
            section="field"
            index="§ 02"
            state="canvas mounted · interactive"
            light
          />
          <h2
            className="mt-6 leading-[0.94] tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 360,
              fontSize: 'clamp(48px, 7.5vw, 128px)',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Field 01 — <em className="text-bone/55" style={{ fontStyle: 'italic', fontWeight: 320 }}>adaptive grid.</em>
          </h2>
          <p
            className="mt-6 max-w-md text-[14px] leading-[1.6] text-bone/65"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            A relaxation of 600-ish points. Each one is gently pulled toward its origin
            and pushed away from the cursor. The lines drawn between nearby points
            are the only thing you can see; the points themselves are almost invisible.
            That is most of what I build, really.
          </p>
        </div>

        {/* Bottom-right legend */}
        <div
          className="col-span-12 self-end justify-self-end text-right text-[10px] uppercase tracking-[0.32em] text-bone/45 md:col-span-3 md:col-start-9"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          move the cursor →
        </div>
      </div>
    </section>
  );
}
