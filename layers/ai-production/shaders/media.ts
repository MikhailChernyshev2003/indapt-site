/**
 * Медиа-плоскость, которую «рождает» сфера. Всё, что на ней движется, —
 * процедурные ролики в цветах бренда; картинка или настоящее видео
 * подставляются текстурой (uMode = 5). Плоскость проявляется из шума
 * (uReveal) со светящейся кромкой, а uAlive разгоняет время: в сцене
 * «Изображение» кадры почти стоят, в сцене «Движение» оживают
 */
export const mediaVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const mediaFragment = /* glsl */ `
  uniform float uMode;
  uniform float uPalette;
  uniform sampler2D uTex;
  uniform float uTexAspect;
  uniform float uAspect;
  uniform float uTime;
  uniform float uAlive;
  uniform float uReveal;
  uniform float uOpacity;
  uniform float uRadius;
  uniform float uSeed;
  uniform float uShift;
  uniform float uDim;

  varying vec2 vUv;

  // ---- шум ----
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash2(i + vec2(1.0)), f - vec2(1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  // ---- палитры бренда ----
  vec3 palette(float t) {
    vec3 deep = vec3(0.020, 0.047, 0.180);
    vec3 blue = vec3(0.008, 0.212, 0.922);
    vec3 sky = vec3(0.251, 0.588, 0.980);
    vec3 mint = vec3(0.235, 0.965, 0.882);
    vec3 violet = vec3(0.553, 0.098, 0.988);

    if (uPalette > 1.5) {
      blue = vec3(0.290, 0.180, 0.900);
      mint = vec3(0.560, 0.660, 1.000);
    }
    else if (uPalette > 0.5) {
      mint = vec3(0.027, 0.859, 0.988);
      sky = violet;
    }

    t = clamp(t, 0.0, 1.0);
    vec3 c = mix(deep, blue, smoothstep(0.0, 0.35, t));
    c = mix(c, sky, smoothstep(0.3, 0.65, t));
    c = mix(c, mint, smoothstep(0.6, 0.9, t));
    return mix(c, vec3(1.0), smoothstep(0.92, 1.0, t));
  }

  float sdHexagon(vec2 p, float r) {
    const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
    return length(p) * sign(p.y);
  }

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  // ---- процедурные ролики ----
  vec3 fluid(vec2 p, float t) {
    vec2 q = vec2(fbm(p + t * 0.12), fbm(p + vec2(5.2, 1.3) - t * 0.1));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.15), fbm(p + 3.0 * q + vec2(8.3, 2.8)));
    float v = fbm(p + 3.5 * r);
    return palette(v * 1.6 + 0.45);
  }

  vec3 rings(vec2 p, float t) {
    float d = sdHexagon(p, 0.05);
    float wave = fract(d * 3.2 - t * 0.35);
    float line = smoothstep(0.0, 0.04, wave) * smoothstep(0.42, 0.18, wave);
    vec3 bg = palette(0.15 + 0.25 * (1.0 - length(p)));
    return mix(bg, palette(0.55 + 0.4 * wave), line * 0.85);
  }

  vec3 orb(vec2 p, float t) {
    vec3 bg = palette(0.08 + 0.18 * (1.0 - p.y));
    float r = 0.42;
    vec2 c = vec2(sin(t * 0.5) * 0.06, cos(t * 0.4) * 0.04);
    vec2 q = p - c;
    float d = length(q);

    if (d > r) {
      float glow = exp(-(d - r) * 9.0) * 0.6;
      return bg + palette(0.7) * glow;
    }

    vec3 n = normalize(vec3(q, sqrt(r * r - d * d)));
    vec3 l = normalize(vec3(sin(t * 0.7), 0.6, 0.8));
    float diff = max(dot(n, l), 0.0);
    float fres = pow(1.0 - n.z, 2.5);
    float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 24.0);
    float bands = fbm(n.xy * 3.0 + t * 0.2);
    vec3 col = palette(0.25 + diff * 0.45 + bands * 0.3);
    return col + palette(0.85) * fres * 0.8 + vec3(spec);
  }

  vec3 waves(vec2 p, float t) {
    vec3 col = palette(0.06 + 0.1 * (p.y + 0.5));
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float amp = 0.12 * (1.0 - abs(p.y) * 0.4) * (0.6 + 0.4 * sin(t * 0.8 + fi));
      float y = sin(p.x * (6.0 + fi * 2.0) + t * (1.2 + fi * 0.3) + fi) * amp
        * sin(p.x * 1.5 + t * 0.4);
      float d = abs(p.y - y + (fi - 2.0) * 0.06);
      col += palette(0.55 + fi * 0.09) * smoothstep(0.012, 0.0, d) * 0.9;
      col += palette(0.7) * exp(-d * 40.0) * 0.12;
    }
    return col;
  }

  vec3 dots(vec2 p, float t) {
    vec2 g = p * 14.0;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float n = fbm(id * 0.15 + t * 0.25);
    float r = 0.12 + 0.3 * smoothstep(-0.2, 0.5, n);
    float dotMask = smoothstep(r, r - 0.06, length(f));
    vec3 bg = palette(0.07);
    return mix(bg, palette(0.45 + n * 0.8), dotMask);
  }

  vec3 image(vec2 uv, float t) {
    // cover под пропорции плоскости и медленный наезд
    vec2 s = uAspect > uTexAspect ? vec2(1.0, uTexAspect / uAspect) : vec2(uAspect / uTexAspect, 1.0);
    float zoom = 1.0 - 0.06 * (0.5 + 0.5 * sin(t * 0.25));
    vec2 tuv = (uv - 0.5) * s * zoom + 0.5;
    vec2 shift = vec2(uShift * 0.012, 0.0);
    vec3 col;
    col.r = texture2D(uTex, tuv + shift).r;
    col.g = texture2D(uTex, tuv).g;
    col.b = texture2D(uTex, tuv - shift).b;
    // Прозрачный фон картинок сайта — на светлую подложку
    float a = texture2D(uTex, tuv).a;
    return mix(vec3(0.93, 0.95, 1.0), col, a);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
    float t = uTime * (0.08 + uAlive) + uSeed * 10.0;

    vec3 col;
    if (uMode < 0.5) col = fluid(p * 1.6 + uSeed, t);
    else if (uMode < 1.5) col = rings(p, t);
    else if (uMode < 2.5) col = orb(p, t);
    else if (uMode < 3.5) col = waves(p, t);
    else if (uMode < 4.5) col = dots(p, t);
    else col = image(uv, t);

    col *= 1.0 - uDim;

    // Скруглённые углы
    float box = sdRoundBox(p, vec2(uAspect * 0.5, 0.5), uRadius);
    float mask = smoothstep(0.004, -0.004, box);

    // Проявление из шума со светящейся кромкой
    float n = fbm(uv * 3.5 + uSeed * 7.0) * 0.5 + 0.5;
    float edge = uReveal * 1.25 - 0.1;
    float vis = smoothstep(n - 0.06, n, edge);
    float rim = vis - smoothstep(n, n + 0.06, edge);
    col = mix(col, vec3(0.235, 0.965, 0.882), clamp(rim, 0.0, 1.0));

    // Тонкая светлая рамка
    float border = smoothstep(-0.008, -0.002, box) * 0.35;
    col = mix(col, vec3(1.0), border);

    float alpha = mask * clamp(vis + rim, 0.0, 1.0) * uOpacity;
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(col, alpha);
  }
`;
