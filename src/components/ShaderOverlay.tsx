import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Animated topographic contour map + sparse hex glyph rain + film grain + scanlines.
 * Fragment shader is the only visual in Hero — no video, no images.
 *
 * Color: near-ink charcoal background, bone-tinted contour lines.
 * Mouse: pushes the noise field outward (force field), and amplifies hex glyph density.
 */
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;       // 0..1
  uniform float uMouseOn;     // 0..1 eased

  // ---- noise utils ----
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 r = mat2(0.8, 0.6, -0.6, 0.8); // rotate octaves to avoid axial artifacts
    for (int i = 0; i < 5; i++) {
      v += a * gnoise(p);
      p = r * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 78.233);
    return fract(p.x * p.y);
  }

  // Cheap glyph-ish dot pattern in a cell — reads as "a hex char from a distance"
  float glyph(vec2 cellUv, float seed) {
    vec2 p = floor(cellUv * vec2(5.0, 7.0));
    float h = hash(p + seed * 11.0);
    float shape = step(0.55, h);
    float center = 1.0 - smoothstep(0.0, 3.5, length(p - vec2(2.0, 3.0)));
    return shape * (0.4 + 0.6 * center);
  }

  void main() {
    // Aspect-correct uv so contours are not stretched
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uRes.x / uRes.y;

    // Mouse force field: warp the noise sampling position away from cursor
    vec2 m = uMouse - 0.5;
    m.x *= uRes.x / uRes.y;
    vec2 toM = p - m;
    float d = length(toM);
    float forceR = 0.25;
    float force = exp(-pow(d / forceR, 2.0)) * uMouseOn * 0.18;
    p += normalize(toM + 0.0001) * force;

    // Slow drift
    vec2 q = p * 2.4 + vec2(uTime * 0.025, uTime * 0.015);
    float n = fbm(q);

    // Contour lines: take fractional part of n*K and band it
    float bands = 9.0;
    float bandV = n * bands;
    float dist = abs(fract(bandV) - 0.5);
    // line width controlled by derivative of bandV
    float w = fwidth(bandV) * 1.2;
    float line = smoothstep(w, 0.0, dist - 0.02);

    // Some contour rings emphasized (every Nth)
    float major = step(0.45, fract(bandV * 0.5 + 0.5));
    line *= mix(0.55, 1.0, major);

    // Base background: very dark warm charcoal
    vec3 bg = vec3(0.078, 0.066, 0.052);

    // Line color: warm bone, slightly tinted
    vec3 lineCol = vec3(0.96, 0.93, 0.86);

    // Compose lines over bg
    vec3 col = mix(bg, lineCol, line * 0.55);

    // Subtle radial darkening from elevation
    col *= 0.85 + 0.25 * smoothstep(-0.6, 0.6, n);

    // ---- Hex glyph rain overlay ----
    vec2 px = uv * uRes;
    vec2 cellSize = vec2(13.0, 19.0);
    vec2 cell = floor(px / cellSize + vec2(0.0, -uTime * 1.8));
    vec2 cellUv = fract(px / cellSize + vec2(0.0, -uTime * 1.8));
    float cellSeed = hash(cell);

    // Mouse proximity boosts density
    float dm = distance(uv, uMouse);
    float prox = 1.0 - smoothstep(0.0, 0.30, dm);
    float density = mix(0.978, 0.84, prox * uMouseOn);
    float alive = step(density, cellSeed);

    float g = glyph(cellUv, cellSeed) * alive;
    float flicker = 0.6 + 0.4 * sin(uTime * 7.0 + cellSeed * 40.0);
    col = mix(col, lineCol * 1.05, g * (0.22 + 0.18 * flicker));

    // ---- Film grain ----
    float grain = hash(uv * uRes + uTime * 47.0);
    col += (grain - 0.5) * 0.06;

    // ---- Scanlines ----
    float scan = sin(px.y * 1.8 + uTime * 0.4) * 0.5 + 0.5;
    col -= (scan - 0.5) * 0.025;

    // Vignette
    float vig = smoothstep(1.15, 0.30, length(uv - 0.5));
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number; on: number }> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseOn: { value: 0 },
    }),
    []
  );

  useFrame(({ size, clock }) => {
    if (!matRef.current) return;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uRes.value.set(size.width, size.height);
    const m = mouseRef.current;
    uniforms.uMouse.value.x += (m.x - uniforms.uMouse.value.x) * 0.06;
    uniforms.uMouse.value.y += (m.y - uniforms.uMouse.value.y) * 0.06;
    uniforms.uMouseOn.value += (m.on - uniforms.uMouseOn.value) * 0.05;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ShaderOverlay({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const mouseRef = useRef({ x: 0.5, y: 0.5, on: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const insideX = e.clientX >= r.left && e.clientX <= r.right;
      const insideY = e.clientY >= r.top && e.clientY <= r.bottom;
      if (insideX && insideY) {
        mouseRef.current.x = (e.clientX - r.left) / r.width;
        mouseRef.current.y = 1 - (e.clientY - r.top) / r.height;
        mouseRef.current.on = 1;
      } else {
        mouseRef.current.on = 0;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
