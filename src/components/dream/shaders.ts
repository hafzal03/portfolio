// GLSL for the dream sky. One full-screen triangle, one fragment shader, one
// WebGL2 context for the whole page (see DreamSky.tsx for why that matters).
//
// The scene, back to front:
//   sky      — a three-keyframe gradient (chromatic dusk → aurora midnight →
//              pastel dawn) driven by page scroll, with stars, low stratus
//              clouds, aurora curtains and a glow band.
//   moon     — a disc that sinks lower as you scroll, until it sets into the
//              sea at the contact section. Inside it is a *daytime* sky with
//              drifting clouds: Magritte's Empire of Light.
//   arches   — a lone arch and a long colonnade standing in the water, every
//              doorway opening onto that same daylight.
//   sea      — a still mirror that gives the world back in its own aqua
//              duotone, broken by slow swell and rings beneath the orb.
//   orb      — a raymarched sphere of liquid mercury with a thin-film sheen,
//              reflecting the sky and sea. It floats, breathes and leans
//              toward the cursor.

export const VERTEX_SHADER = /* glsl */ `#version 300 es
void main() {
  // A single triangle that covers the whole viewport — no vertex buffer.
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uHorizon;   // horizon height, 0 = bottom of screen, 1 = top
uniform float uNight;     // 0 = dusk, 1 = deep midnight
uniform float uDawn;      // 0 = none, 1 = full dawn
uniform vec2 uMouse;      // smoothed pointer, -1..1
uniform vec3 uOrb;        // orb centre, world space
uniform float uOrbR;      // orb radius, world units
uniform vec3 uMoonDir;    // direction to the moon window
uniform float uMoonR;     // angular radius of the moon window (radians)

const float FOCAL = 1.6;
const float PI = 3.14159265;

// ─── hashing & noise ─────────────────────────────────────────────────────────

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float hash31(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i), hash31(i + vec3(1, 0, 0)), u.x),
        mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), u.x),
        mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), u.x), u.y),
    u.z);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise2(p);
    p = r * p * 2.03;
    a *= 0.5;
  }
  return v;
}

// ─── palette ────────────────────────────────────────────────────────────────

vec3 keyframe(vec3 dusk, vec3 night, vec3 dawn) {
  return mix(mix(dusk, night, uNight), dawn, uDawn);
}

// A chromatic dusk (cobalt → ultraviolet → magenta → tangerine), an
// ultramarine midnight, a pastel dawn.
vec3 skyTop()     { return keyframe(vec3(0.030, 0.035, 0.190), vec3(0.010, 0.012, 0.070), vec3(0.070, 0.080, 0.280)); }
vec3 skyMid()     { return keyframe(vec3(0.240, 0.070, 0.520), vec3(0.040, 0.050, 0.240), vec3(0.420, 0.280, 0.680)); }
vec3 skyLow()     { return keyframe(vec3(0.780, 0.160, 0.480), vec3(0.120, 0.070, 0.340), vec3(0.950, 0.500, 0.620)); }
vec3 skyHorizon() { return keyframe(vec3(1.000, 0.500, 0.260), vec3(0.240, 0.120, 0.450), vec3(1.000, 0.740, 0.560)); }
vec3 glowColor()  { return keyframe(vec3(1.000, 0.620, 0.350), vec3(0.500, 0.450, 1.000), vec3(1.000, 0.820, 0.600)); }

// The sea does not reflect the sky as it is. It gives everything back in its
// own cool duotone — a warm world above, an aqua negative of it below.
vec3 mirrorDark()  { return keyframe(vec3(0.000, 0.035, 0.060), vec3(0.000, 0.030, 0.080), vec3(0.010, 0.055, 0.075)); }
vec3 mirrorLight() { return keyframe(vec3(0.250, 0.950, 0.880), vec3(0.350, 0.600, 1.000), vec3(0.550, 1.000, 0.850)); }

vec3 mirrorTone(vec3 c) {
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 duo = mix(mirrorDark(), mirrorLight(), smoothstep(0.02, 0.65, lum));
  duo += smoothstep(0.65, 1.0, lum) * 0.5;
  return mix(duo, c, 0.12);
}

// ─── the other hour ─────────────────────────────────────────────────────────

// Daylight, seen through the moon window and through the arches' doorways:
// Magritte's Empire of Light, a different time of day behind every opening.
vec3 daylight(vec2 lp, float dim) {
  vec3 day = mix(vec3(0.62, 0.78, 0.99), vec3(0.30, 0.52, 0.92), clamp(lp.y * 0.5 + 0.5, 0.0, 1.0));
  float cl = fbm(lp * 1.4 + vec2(uTime * 0.035, 0.0));
  day = mix(day, vec3(1.0, 0.98, 0.96), smoothstep(0.48, 0.72, cl) * 0.92);
  return day * dim;
}

// ─── sky ────────────────────────────────────────────────────────────────────

float stars(vec3 rd) {
  vec2 sp = vec2(atan(rd.x, rd.z), asin(clamp(rd.y, -1.0, 1.0)));
  vec2 g = sp * 95.0;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash21(id);
  if (h < 0.955) return 0.0;
  vec2 off = (vec2(hash21(id + 7.1), hash21(id + 3.3)) - 0.5) * 0.6;
  float d = length(f - off);
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + h * 2.5) + h * 40.0);
  float brightness = (h - 0.955) / 0.045;
  return smoothstep(0.11, 0.0, d) * twinkle * (0.35 + brightness);
}

// Two curtains of aurora low over the water at midnight: a sharp lower hem,
// fading upward from green into violet, combed into vertical rays.
vec3 aurora(vec3 rd) {
  if (uNight < 0.02 || rd.y < 0.0) return vec3(0.0);
  float x = atan(rd.x, rd.z);
  float t = uTime * 0.04;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float u = x * (2.2 + fi * 0.9) + t * (1.0 + fi * 0.6) + fi * 3.1;
    float hem = 0.035 + 0.045 * fi + 0.02 * sin(u * 1.3) + (noise2(vec2(u * 0.9, fi * 5.0)) - 0.5) * 0.04;
    float d = rd.y - hem;
    float curtain = smoothstep(-0.012, 0.0, d) * exp(-max(d, 0.0) * 14.0);
    float rays = 0.45 + 0.55 * noise2(vec2(u * 11.0, t * 4.0 + fi * 2.0));
    vec3 c = mix(vec3(0.20, 1.00, 0.72), vec3(0.85, 0.30, 1.00), clamp(max(d, 0.0) * 9.0 + fi * 0.35, 0.0, 1.0));
    acc += c * curtain * rays;
  }
  return acc * 0.42 * uNight * (1.0 - uDawn);
}

vec3 moonWindow(vec3 rd, vec3 base) {
  float dd = dot(rd, uMoonDir);
  float cosR = cos(uMoonR);
  // Analytic pixel footprint rather than fwidth(): this runs inside per-pixel
  // branches (sky / sea reflection / orb), where derivatives are undefined.
  float aa = sin(uMoonR) / (uRes.y * FOCAL) * 1.5;
  if (dd < cosR - aa) return base;

  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), uMoonDir));
  vec3 up = cross(uMoonDir, right);
  vec2 lp = vec2(dot(rd, right), dot(rd, up)) / sin(uMoonR);

  float inside = smoothstep(cosR - aa, cosR + aa, dd);
  return mix(base, daylight(lp, mix(1.0, 0.72, uNight)), inside);
}

vec3 skyColor(vec3 rd, bool withMoon) {
  float e = max(rd.y, 0.0);
  vec3 col = mix(skyHorizon(), skyLow(), smoothstep(0.0, 0.05, e));
  col = mix(col, skyMid(), smoothstep(0.03, 0.2, e));
  col = mix(col, skyTop(), smoothstep(0.16, 0.6, e));

  vec3 glow = glowColor();
  float toMoon = max(dot(rd, uMoonDir), 0.0);
  col += glow * (pow(toMoon, 24.0) * 0.45 + pow(toMoon, 4.0) * 0.07);
  col += glow * 0.07 * exp(-e * 16.0) * (1.0 - uNight * 0.6);

  // Stars come out as the night deepens; the aurora with them.
  float starAmt = mix(0.18, 1.0, uNight) * (1.0 - uDawn * 0.8);
  col += vec3(0.92, 0.9, 1.0) * stars(rd) * starAmt * smoothstep(0.02, 0.22, e);
  col += aurora(rd);

  // Low stratus, lit magenta from beneath.
  vec2 cuv = rd.xz / max(rd.y, 0.035) * 0.35 + vec2(uTime * 0.012, 0.0);
  float c = fbm(cuv * 0.9);
  float band = smoothstep(0.015, 0.07, e) * (1.0 - smoothstep(0.22, 0.45, e));
  float density = smoothstep(0.5, 0.82, c) * band;
  vec3 cloudCol = mix(skyTop() * 0.7, glow * 0.5 + skyLow() * 0.4, 0.6);
  col = mix(col, cloudCol, density * 0.75);

  if (withMoon) col = moonWindow(rd, col);
  return col;
}

// ─── architecture ───────────────────────────────────────────────────────────

// A freestanding arch out in the water (x, z, half-width, height) and a long
// colonnade on the horizon (x0, x1, z, height) — de Chirico's empty arcades.
// Every opening looks through to daylight.
const vec4 ARCH = vec4(7.0, 18.0, 0.95, 3.3);
const vec4 ARCADE = vec4(10.0, 30.0, 70.0, 2.6);
const float BAY = 1.6;

float sdArch(vec2 q, float w, float h) {
  float d = q.y > h - w ? length(q - vec2(0.0, h - w)) - w : abs(q.x) - w;
  return max(d, -q.y);
}

// Where a ray meets the vertical plane z = zPlane, if it does above the water.
bool planeHit(vec3 ro, vec3 rd, float zPlane, out vec3 p, out float t) {
  p = vec3(0.0);
  t = 0.0;
  if (rd.z <= 0.0) return false;
  t = (zPlane - ro.z) / rd.z;
  if (t <= 0.0) return false;
  p = ro + rd * t;
  return p.y > -0.05;
}

vec3 stoneColor(float y, float h) {
  return mix(vec3(0.035, 0.025, 0.09), glowColor() * 0.22, (1.0 - smoothstep(0.0, h, y)) * 0.6);
}

vec3 addArchitecture(vec3 ro, vec3 rd, vec3 col) {
  vec3 p;
  float t;

  // The colonnade, furthest away, drawn first.
  if (planeHit(ro, rd, ARCADE.z, p, t)) {
    float fp = t / (uRes.y * FOCAL) * 1.2;
    vec2 c = vec2((ARCADE.x + ARCADE.y) * 0.5, ARCADE.w * 0.5);
    vec2 bq = abs(p.xy - c) - vec2((ARCADE.y - ARCADE.x) * 0.5, ARCADE.w * 0.5);
    float block = length(max(bq, 0.0)) + min(max(bq.x, bq.y), 0.0);
    float cover = 1.0 - smoothstep(-fp, fp, block);
    if (cover > 0.0) {
      float lx = mod(p.x - ARCADE.x, BAY) - BAY * 0.5;
      float open = 1.0 - smoothstep(-fp, fp, sdArch(vec2(lx, p.y), BAY * 0.3, ARCADE.w * 0.72));
      // Far away, so it takes on the colour of the air between (aerial
      // perspective): a soft silhouette, not a hard black shape.
      col = mix(col, mix(stoneColor(p.y, ARCADE.w), skyHorizon() * 0.8, 0.45), cover);
      if (open > 0.0) {
        vec2 lp = vec2(lx / (BAY * 0.3), p.y / ARCADE.w * 2.0 - 1.0);
        col = mix(col, mix(daylight(lp, 0.7), skyHorizon(), 0.3), open * cover);
      }
    }
  }

  // The lone arch, nearer.
  if (planeHit(ro, rd, ARCH.y, p, t)) {
    float fp = t / (uRes.y * FOCAL) * 1.2;
    vec2 q = vec2(p.x - ARCH.x, p.y);
    float outer = 1.0 - smoothstep(-fp, fp, sdArch(q, ARCH.z, ARCH.w));
    if (outer > 0.0) {
      float wi = ARCH.z * 0.56;
      float hi = ARCH.w * 0.8;
      float inner = 1.0 - smoothstep(-fp, fp, sdArch(q, wi, hi));
      col = mix(col, stoneColor(q.y, ARCH.w), outer);
      if (inner > 0.0) col = mix(col, daylight(vec2(q.x / wi, q.y / hi * 2.0 - 1.0), 0.85), inner);
    }
  }
  return col;
}

// ─── orb ────────────────────────────────────────────────────────────────────

float orbField(vec3 p) {
  vec3 q = (p - uOrb) / uOrbR;
  float t = uTime * 0.35;
  float wobble = sin(q.x * 3.1 + t * 1.3) * sin(q.y * 2.7 - t) * sin(q.z * 3.3 + t * 0.7);
  float n = noise3(q * 1.9 + vec3(0.0, t, t * 0.5)) - 0.5;
  return (length(q) - 1.0 - wobble * 0.05 - n * 0.1) * uOrbR;
}

vec3 orbNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  float h = 0.002 * uOrbR;
  return normalize(
    k.xyy * orbField(p + k.xyy * h) +
    k.yyx * orbField(p + k.yyx * h) +
    k.yxy * orbField(p + k.yxy * h) +
    k.xxx * orbField(p + k.xxx * h));
}

// Ray/sphere entry and exit distances; x < 0 means a miss.
vec2 sphereHit(vec3 ro, vec3 rd, vec3 c, float r) {
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float h = b * b - (dot(oc, oc) - r * r);
  if (h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h);
}

vec3 seaSeenFromOrb(vec3 r) {
  // What a downward reflection on the orb sees: the aqua mirror, brightest
  // where it meets the horizon.
  float down = clamp(-r.y, 0.0, 1.0);
  return mix(mirrorLight() * 0.45, mirrorDark(), smoothstep(0.0, 0.35, down));
}

vec3 shadeOrb(vec3 p, vec3 rd) {
  vec3 n = orbNormal(p);
  vec3 r = reflect(rd, n);
  vec3 env = r.y > 0.0 ? skyColor(r, true) : seaSeenFromOrb(r);

  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  vec3 film = 0.5 + 0.5 * cos(2.0 * PI * (vec3(0.0, 0.33, 0.67) + fres * 1.3 + n.y * 0.25 + uTime * 0.015));

  vec3 col = env * mix(vec3(0.95, 0.95, 1.05), film, 0.38);
  col += film * (fres * 0.55 + 0.04);
  col += skyHorizon() * 0.18 * (0.5 + 0.5 * n.y);
  float spec = pow(max(dot(r, uMoonDir), 0.0), 90.0);
  col += glowColor() * spec * 1.4;
  return col;
}

// Returns how much of this pixel the orb covers (0..1) and the point to shade.
// The displaced surface isn't a true distance field (its gradient exceeds 1),
// so steps are kept short to avoid tunnelling through the silhouette, and the
// closest approach of a near-miss is turned into partial coverage — an
// anti-aliased edge instead of a stair-stepped one.
float marchOrb(vec3 ro, vec3 rd, out vec3 hit) {
  vec2 bounds = sphereHit(ro, rd, uOrb, uOrbR * 1.3);
  if (bounds.x < 0.0 && bounds.y < 0.0) return 0.0;
  float t = max(bounds.x, 0.0);
  float minD = 1e9;
  float tMin = t;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = orbField(p);
    if (d < minD) {
      minD = d;
      tMin = t;
    }
    if (d < 0.001 * uOrbR) {
      hit = p;
      return 1.0;
    }
    t += d * 0.6;
    if (t > bounds.y) break;
  }
  float footprint = tMin / (uRes.y * FOCAL);
  hit = ro + rd * tMin;
  return 1.0 - smoothstep(0.0, footprint * 1.5, minD);
}

// ─── sea ────────────────────────────────────────────────────────────────────

vec2 swell(vec2 q, float t) {
  vec2 g = vec2(0.0);
  g += vec2(0.8, 0.3) * cos(dot(q, vec2(0.8, 0.3)) * 2.6 + t * 0.7);
  g += vec2(-0.4, 0.9) * 0.7 * cos(dot(q, vec2(-0.4, 0.9)) * 3.9 + t * 0.95);
  g += vec2(0.2, -1.0) * 0.45 * cos(dot(q, vec2(0.2, -1.0)) * 6.7 + t * 1.3);
  g += (vec2(noise2(q * 1.7 + t * 0.15), noise2(q * 1.9 - t * 0.12)) - 0.5) * 1.3;
  return g;
}

vec3 shadeSea(vec3 ro, vec3 rd) {
  float t = -ro.y / rd.y;
  vec3 pos = ro + rd * t;

  // Ripples die away with distance so the far water stays a clean mirror.
  float fade = 1.0 / (1.0 + t * 0.22);
  vec2 g = swell(pos.xz, uTime) * 0.035 * fade;

  // Rings spreading outwards beneath the orb, as if it were breathing on the water.
  vec2 toOrb = pos.xz - uOrb.xz;
  float rr = length(toOrb) / max(uOrbR, 0.001);
  float ring = sin(rr * 5.0 - uTime * 1.6) * exp(-rr * 0.35) * smoothstep(0.0, 0.8, rr);
  g += normalize(toOrb + 1e-4) * ring * 0.06;

  vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
  vec3 r = reflect(rd, n);
  r.y = abs(r.y);

  vec3 refl = addArchitecture(pos, r, skyColor(r, true));

  // The orb, seen in the mirror.
  vec2 oh = sphereHit(pos, r, uOrb, uOrbR);
  if (oh.x > 0.0) {
    vec3 op = pos + r * oh.x;
    vec3 on = normalize(op - uOrb);
    vec3 orr = reflect(r, on);
    vec3 env = orr.y > 0.0 ? skyColor(orr, false) : seaSeenFromOrb(orr);
    float fres = pow(1.0 - max(dot(on, -r), 0.0), 3.0);
    refl = env * 0.9 + glowColor() * fres * 0.15;
  }

  refl = mirrorTone(refl);

  // Dark water near the viewer, a bright mirror only at grazing angles out
  // toward the horizon — keeps text laid over the sea legible.
  float fresnel = 0.12 + 0.88 * pow(1.0 - max(dot(n, -rd), 0.0), 5.0);
  vec3 col = mix(mirrorDark() * 0.5, refl * 0.85, fresnel);

  // Haze where the water meets the sky.
  col = mix(col, mirrorLight() * 0.3, (1.0 - exp(-t * 0.014)) * 0.35);
  return col;
}

// ─── main ───────────────────────────────────────────────────────────────────

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // The horizon line sits exactly at uHorizon on screen.
  float pitch = uHorizon - 0.5;
  vec3 ro = vec3(uMouse.x * 0.12, 1.0 + uMouse.y * 0.04, 0.0);
  vec3 rd = normalize(vec3(p.x, p.y - pitch, FOCAL));

  vec3 hit;
  float orb = marchOrb(ro, rd, hit);
  vec3 col = vec3(0.0);
  if (orb < 1.0) {
    col = rd.y > 0.0 ? skyColor(rd, true) : shadeSea(ro, rd);
    // Arches stand on the water, so their bases sit just below the horizon
    // line too — composite them over sky and sea alike.
    col = addArchitecture(ro, rd, col);
  }
  if (orb > 0.0) col = mix(col, shadeOrb(hit, rd), orb);

  // Cinematic finish: vignette and a whisper of film grain.
  float vig = 1.0 - 0.42 * pow(length((uv - 0.5) * vec2(1.1, 1.0)) * 1.25, 2.2);
  col *= vig;
  col += (hash21(gl_FragCoord.xy + fract(uTime * 7.13) * 91.7) - 0.5) * 0.028;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
