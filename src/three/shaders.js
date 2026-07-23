// Bruit simplex 3D (Ashima Arts / Stefan Gustavson, webgl-noise, MIT) —
// utilitaire de calcul standard, pas une œuvre créative.
export const SIMPLEX_NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amp * snoise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return value;
}
`;

export const INSTRUMENT_VERTEX = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

${SIMPLEX_NOISE_GLSL}

void main() {
  vUv = uv;
  vec3 pos = position;
  float n = fbm(vec3(pos.x * 0.85, pos.y * 0.85, uTime * 0.045));
  float elevation = n * 0.32;
  pos.z += elevation;
  vElevation = elevation;

  float e = 0.06;
  float nx = fbm(vec3((pos.x + e) * 0.85, pos.y * 0.85, uTime * 0.045)) * 0.32;
  float ny = fbm(vec3(pos.x * 0.85, (pos.y + e) * 0.85, uTime * 0.045)) * 0.32;
  vec3 tangentX = normalize(vec3(e, 0.0, nx - elevation));
  vec3 tangentY = normalize(vec3(0.0, e, ny - elevation));
  vNormal = normalize(cross(tangentX, tangentY));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const INSTRUMENT_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uLineColor;
uniform vec3 uFogColor;
uniform vec3 uSignalColor;
uniform vec2 uMarker;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;

void main() {
  float facing = 1.0 - clamp(abs(vNormal.z), 0.0, 1.0);
  float rim = pow(facing, 1.6);

  float contour = abs(fract(vElevation * 10.0) - 0.5) * 2.0;
  float line = smoothstep(0.86, 1.0, 1.0 - contour);

  float dist = distance(vUv, vec2(0.5, 0.46));
  float radial = smoothstep(0.28, 0.98, dist);

  vec3 color = mix(uLineColor, uFogColor, radial * 0.9);
  float plate = line * 0.9 + rim * 0.24 + 0.07;
  float alpha = clamp(plate, 0.0, 1.0) * (1.0 - radial);

  float markerDist = distance(vUv, uMarker);
  float marker = smoothstep(0.018, 0.0, markerDist);
  color = mix(color, uSignalColor, marker);
  alpha = max(alpha, marker * (1.0 - radial * 0.6));

  gl_FragColor = vec4(color, alpha);
}
`;
