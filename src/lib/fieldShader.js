// "Champ de risque" — a domain-warped noise field rendered as flowing
// topographic contour lines. Conceptually: noise organising into order
// (signal from noise). The cursor perturbs the field; it self-heals.
//
// Authored for THREE.ShaderMaterial (GLSL ES 1.00). A full-screen quad is
// drawn by passing clip-space positions straight through the vertex stage.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;      // seconds
  uniform vec2  uResolution;
  uniform vec2  uMouse;     // smoothed, in uv space (0..1)
  uniform float uMouseForce;// 0..1, decays after movement
  uniform float uReveal;    // 0 = chaotic (loading) -> 1 = settled
  uniform float uScroll;    // 0..1 scroll progress
  uniform float uFlow;      // animation phase — advances only near the hero (JS-driven)
  uniform float uReduced;   // 1 = reduced motion

  // Palette — fed from CSS custom properties so the field follows the theme
  uniform vec3  INK_DEEP;   // near-black base
  uniform vec3  INK_WARM;   // raised ink on the ridges
  uniform vec3  SHADOW;     // faint tint in the valleys
  uniform vec3  SIGNAL;     // accent (contour lines)
  uniform vec3  EMBER;      // accent highlight

  // --- Simplex noise (Ashima / Stefan Gustavson) ------------------------
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                              + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++){
      v += a * snoise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  // Hash grain
  float hash(vec2 p){
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  void main(){
    vec2 uv = vUv;
    // Aspect-correct coordinates so contours stay circular, not stretched
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    float t = uTime * (uReduced > 0.5 ? 0.0 : 1.0);

    // The interactive motion lives in the hero; it eases out once you scroll on,
    // so the fixed field stops "tangage" behind the reading content.
    float heroZone = 1.0 - smoothstep(0.02, 0.16, uScroll);

    // Cursor ripple: push the field outward from the pointer, self-healing
    vec2 m = uMouse; m.x *= aspect;
    vec2 toM = p - m;
    float md = length(toM);
    float ripple = uMouseForce * exp(-md * 5.5) * heroZone;
    p += normalize(toM + 1e-4) * ripple * 0.06;

    // Turbulence eases as the site reveals (loader -> hero)
    float chaos = mix(1.25, 1.0, uReveal);
    float flow = uFlow; // JS freezes this past the hero (no jump)

    // Domain warping -> organic "risk terrain" (low frequency = large, calm contours)
    vec2 q = vec2(fbm(p * 1.05 + vec2(0.0, flow)),
                  fbm(p * 1.05 + vec2(5.2, -flow)));
    vec2 r = vec2(fbm(p * 1.05 + q * (1.3 * chaos) + vec2(1.7, 9.2) + flow),
                  fbm(p * 1.05 + q * (1.3 * chaos) + vec2(8.3, 2.8) - flow));
    float h = fbm(p * 1.05 + r * (1.5 * chaos) + vec2(uScroll * 0.9, 0.0));
    h = h * 0.5 + 0.5;

    // Contour lines (anti-aliased via screen-space derivatives)
    float levels = mix(3.0, 4.5, uReveal);
    float band = h * levels;
    float d = abs(fract(band) - 0.5);
    float aa = fwidth(band) * 1.1;
    float line = 1.0 - smoothstep(0.0, aa + 0.016, d);

    // Base terrain: mostly deep ink; a whisper of cool in the valleys
    float relief = smoothstep(0.12, 0.92, h);
    vec3 base = mix(SHADOW, INK_DEEP, relief);
    base = mix(base, INK_WARM, smoothstep(0.72, 1.0, h) * 0.45);

    // Signal glow — faint by default, blooms around the cursor (hero only)
    float near = exp(-md * 3.2) * uMouseForce * heroZone;
    float energy = (0.22 + 0.17 * relief) * mix(0.5, 0.92, uReveal);
    energy += near * 0.8;
    vec3 lineColor = mix(SIGNAL, EMBER, relief * 0.35 + near * 0.6);

    vec3 col = base + lineColor * line * energy;
    col += lineColor * pow(line, 3.0) * 0.18 * near;

    // Cursor aura
    col += SIGNAL * near * 0.035;

    // Vignette keeps the edges dark for legible text
    vec2 vc = uv - 0.5;
    float vig = 1.0 - dot(vc, vc) * 1.15;
    col *= clamp(vig, 0.26, 1.0);

    // Fine film grain
    float g = hash(uv * uResolution.xy + t) - 0.5;
    col += g * 0.014;

    // Global reveal fade + hold it as a quiet background so text stays legible
    col *= mix(0.16, 0.6, smoothstep(0.0, 1.0, uReveal));
    // Recede further behind the reading content once past the hero
    col *= mix(1.0, 0.62, smoothstep(0.06, 0.4, uScroll));

    gl_FragColor = vec4(col, 1.0);
  }
`;
