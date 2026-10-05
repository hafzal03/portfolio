// GLSL ES 3.00 for the neural field.
//
// One vertex shader serves every pass — nodes, the connections between them and
// the latent haze — because they are all the same thing to the GPU: points in a
// volume, projected by hand. Only the fragment stage differs.
//
// The geometry is a layered network. Each vertex carries where it ends up
// (aPos), where it started before the network resolved (aSeed), and how far
// along the network it sits (aLayer, 0 at the input layer, 1 at the output).
// That third attribute is what makes a forward pass expressible: a travelling
// band of activation is just a function of aLayer and time.

export const FIELD_VERT = /* glsl */ `#version 300 es
precision highp float;

in vec3 aPos;
in vec3 aSeed;
in float aLayer;

uniform float uTime;
uniform float uForm;     // 0 = scattered weights, 1 = resolved network
uniform float uScroll;   // 0..1 page depth
uniform float uAspect;
uniform float uReduce;   // 1 = prefers-reduced-motion
uniform float uSize;
uniform vec2  uPointer;

out float vAct;
out float vFog;

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  // The network resolves layer by layer rather than all at once, so it reads
  // as propagation rather than a fade-in.
  float stagger = clamp(uForm * 1.7 - aLayer * 0.7, 0.0, 1.0);
  vec3 p = mix(aSeed, aPos, smoothstep(0.0, 1.0, stagger));

  float yaw = uTime * 0.045 * (1.0 - uReduce) + uPointer.x * 0.25 + uScroll * 0.9;
  float pitch = -0.1 + uPointer.y * 0.1 + uScroll * 0.18;
  p.xz *= rot(yaw);
  p.yz *= rot(pitch);

  // Camera sits back from the lattice and dollies in as the page is read.
  p.z += 3.3 - uScroll * 1.35;

  float d = max(p.z, 0.08);
  vec2 proj = p.xy / d;
  proj.x /= uAspect;
  gl_Position = vec4(proj * 1.35, 0.0, 1.0);

  // The forward pass: a narrow band sweeping input → output, wrapping around.
  float wave = fract(uTime * 0.21);
  float dist = aLayer - wave;
  dist -= floor(dist + 0.5);
  vAct = exp(-dist * dist * 80.0) * (1.0 - uReduce * 0.7);

  vFog = clamp(1.0 - (d - 1.3) / 3.2, 0.06, 1.0);
  gl_PointSize = max(1.0, uSize * (0.55 + vAct * 1.0) / d);
}`;

export const NODE_FRAG = /* glsl */ `#version 300 es
precision highp float;

in float vAct;
in float vFog;
out vec4 frag;

void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r = dot(q, q);
  if (r > 1.0) discard;

  // A tight core inside a soft halo — the only reason a point reads as a lit
  // thing rather than a dot.
  float core = exp(-r * 4.5);
  float halo = exp(-r * 1.5) * 0.45;

  vec3 cold = vec3(0.38, 0.72, 0.95);
  vec3 hot  = vec3(0.86, 0.98, 1.00);
  vec3 c = mix(cold, hot, vAct);

  float a = (core + halo) * vFog * (0.32 + vAct * 0.95);
  frag = vec4(c * (0.55 + vAct * 1.35), a);
}`;

export const EDGE_FRAG = /* glsl */ `#version 300 es
precision highp float;

in float vAct;
in float vFog;
out vec4 frag;

void main() {
  vec3 c = mix(vec3(0.26, 0.50, 0.74), vec3(0.62, 0.92, 1.00), vAct);
  frag = vec4(c, vFog * (0.05 + vAct * 0.45));
}`;

export const HAZE_FRAG = /* glsl */ `#version 300 es
precision highp float;

in float vAct;
in float vFog;
out vec4 frag;

void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r = dot(q, q);
  if (r > 1.0) discard;
  float g = exp(-r * 3.0);
  frag = vec4(vec3(0.44, 0.63, 0.86) * g, g * vFog * 0.22);
}`;
