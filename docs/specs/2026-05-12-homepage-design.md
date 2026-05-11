# Skiux — Personal Homepage Design Spec

Date: 2026-05-12
Status: Approved — ready to implement

---

## 1. Purpose & positioning

Personal homepage for **Skiux** (git: `hupax`), a developer focused on backend / systems / infrastructure (KV with Raft+LSM, MapReduce/Spark, distributed tracing). The site mixes three intents:

- **A — Portfolio** (deferred): projects section is a placeholder until real work lands.
- **B — Personal brand**: signals taste, restraint, curiosity.
- **D — Experimental playground**: the homepage itself is a small piece of craft.

Two reference sites: jayzhushi.com (cinematic, atmospheric), qzq.at (tinkerer, editorial). The design borrows the cinematic surface from the first and the systems-flavored type/grid from the second.

## 2. Hard constraints

- Light neutral palette only — bone / warm gray / charcoal. No accents.
- English copy throughout.
- Hero is full-bleed: image/video occupies 100vw × 100vh with **no margin or padding**.
- Layouts must be **non-centered**. Content stays off-axis on a 12-column grid.
- No SaaS template tropes (centered hero with two CTA buttons, gradient backgrounds, three-card feature grid, testimonials, large logo cloud, etc.).
- Stack: React + TypeScript.

## 3. Information architecture

Single long-scroll page. Sections in order:

1. **Hero** — full-bleed video + WebGL shader overlay + corner-anchored editorial type.
2. **Manifesto** — one editorial paragraph, body serif, left-pinned (cols 2–7).
3. **Now** — "Currently building" list (KV/Raft+LSM, MapReduce/Spark, distributed tracing). Right-pinned (cols 5–11). Each item: title + one-line status + start date.
4. **Projects (placeholder)** — editorial "table of contents" layout. Large roman numerals (I, II, III) on left; titles `[ TBD ]` on right.
5. **Colophon** — two-column small-print notes on how the site is built (fonts, stack, inspirations).
6. **Footer** — GitHub / email / location placeholder / a single closing line.

Between sections: large vertical breathing room (>= 18vh) + a 1px hairline divider (`#d8d4cc`). No cards, no shadows.

Global decoration: 1px right-side scroll progress hairline; native scrollbar hidden.

## 4. Hero composition

**Layered from bottom up:**

1. `<video>` autoplay loop muted playsinline, `object-fit: cover`. Black-and-white or near-monochrome slow-motion footage. Target < 3 MB, webm + mp4 sources. Subject candidates: fog over a ridge, ocean long exposure, film projector reel, magnetic tape spool, darkroom developing.
2. WebGL shader plane (full viewport) drawing:
   - **grain** — procedural film grain (always on, opacity ≈ 0.18).
   - **scanline** — faint horizontal scanlines (opacity ≈ 0.08).
   - **data-noise** — sparse falling characters from `[0-9a-f]`; baseline density low; cursor proximity increases density (Easter egg).
3. Vignette + top gradient to guarantee text contrast.

**Type placement (off-axis):**

- **Bottom-left**: `Skiux` in Fraunces display serif, `clamp(80px, 14vw, 240px)`, tight tracking.
- Beneath name: tagline in JetBrains Mono uppercase, e.g. `Systems engineer · Building things that should not be built alone`. (Final copy from user.)
- **Top-right**: live UTC clock `[ 2026-05-12 · 22:47 UTC+8 ]` in JetBrains Mono, refreshes every second.
- **Bottom-right**: vertical mini-nav `INDEX / NOW / WORK / COLOPHON` in JetBrains Mono. Hovering an item draws a full-width hairline across the viewport at that row.
- **Bottom-left under tagline**: `↓ scroll` with a slow 2s pulse.

## 5. Visual system

### Color tokens

```
--bone        #f4efe6
--paper       #e8e2d5
--warm-gray   #b8b0a3
--ash         #6b655c
--charcoal    #2a2825
--ink         #14110d
```

### Type stack

- **Display serif**: Fraunces (variable, opsz 144) — Hero name, section headers.
- **Body serif**: Newsreader — Manifesto and prose.
- **Sans**: Inter — UI labels only (used sparingly).
- **Mono**: JetBrains Mono — clock, Now list, Colophon, Easter egg characters.

All fonts loaded via Fontsource (self-hosted, no FOIT).

### Grid

12 columns, 24px gutter, no max-width container on desktop (≥ 1280). Mobile single column, content left-aligned (preserve the off-axis feel).

### Motion

- Section entrance: IntersectionObserver + 80 ms stagger, translate-y(12px) + opacity 0→1, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- No spring/bounce. No hover scale.
- Shader pauses when Hero is out of viewport (perf).

## 6. Technical architecture

```
Vite + React 19 + TypeScript (strict)
├── Tailwind v4              // tokens via @theme; layout via utilities
├── three.js + @react-three/fiber  // shader overlay
├── framer-motion            // section entrance only
├── <video>                  // native, multi-source
└── @fontsource-variable/*   // self-hosted fonts
```

### Directory layout

```
src/
├── main.tsx
├── App.tsx
├── sections/
│   ├── Hero.tsx
│   ├── Manifesto.tsx
│   ├── Now.tsx
│   ├── Projects.tsx
│   ├── Colophon.tsx
│   └── Footer.tsx
├── components/
│   ├── ShaderOverlay.tsx    // r3f canvas + custom fragment shader
│   ├── LiveClock.tsx
│   ├── ScrollProgress.tsx
│   ├── NavRail.tsx
│   └── Reveal.tsx           // IntersectionObserver wrapper
├── content/
│   └── site.ts              // single source of truth for all copy
├── styles/
│   └── globals.css          // @theme tokens, font @font-face, resets
└── shaders/
    └── overlay.frag.glsl    // grain + scanline + data-noise
```

### Performance budget

- Lighthouse Performance ≥ 90.
- Hero video: `preload="metadata"`, < 3 MB, webm preferred.
- Shader: requestAnimationFrame paused when offscreen.
- Total JS first-load ≤ 200 KB gzipped (three.js will be the largest piece).

## 7. Asset sourcing

- **Video**: Pexels, Mazwai, Coverr, Mixkit. Download 3–5 black-and-white slow-mo candidates, pick one locally.
- **Texture/grain**: generated in shader; no image dependency.
- **Fonts**: Fontsource (Fraunces variable, Newsreader, Inter, JetBrains Mono).
- **Reference (audit-only, no copying)**: godly.website, siteinspire.com, minimal.gallery, read.cv, are.na.

## 8. Open TODOs (non-blocking)

- Final tagline copy.
- Manifesto paragraph copy.
- Location string for Footer.
- GitHub / email / X handles.

These have placeholders in `content/site.ts`; user can edit one file to fill them in.

## 9. Out of scope (intentionally)

- Blog / writing section (deferred until there's real writing).
- Reading list / inspiration page (same reason).
- Real project case studies (deferred until KV / MapReduce / tracing projects mature).
- Analytics, SEO meta beyond the essentials, dark mode, i18n.
