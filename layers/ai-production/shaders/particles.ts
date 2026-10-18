/**
 * Частицы сферы. Каждая точка знает все свои формы (атрибуты-цели), а униформы
 * задают, насколько сейчас проявлена каждая форма. Формы накладываются по
 * очереди через mix, поэтому цепочка «сфера → шестиугольник → звезда → круг»
 * ведётся одним твином на форму, а обратный путь — твином весов к нулю.
 * У каждой точки свой сдвиг по времени (aRand.x): точки «стекают» волной,
 * а не прыгают все разом
 */
export const particlesVertex = /* glsl */ `
  attribute vec3 aHex;
  attribute vec3 aStar;
  attribute vec3 aCircle;
  attribute vec3 aBurst;
  attribute vec3 aGrid;
  attribute vec3 aOrbit;
  attribute vec4 aRand;

  uniform float uTime;
  uniform float uIntro;
  uniform float uHex;
  uniform float uStar;
  uniform float uCircle;
  uniform float uBurst;
  uniform float uGrid;
  uniform float uOrbit;
  uniform float uSwirl;
  uniform float uPulse;
  uniform float uSphereScale;
  uniform vec3 uSphereOffset;
  uniform vec3 uShapeOffset;
  uniform float uShapeScale;
  uniform float uSpin;
  uniform vec3 uMouse;
  uniform float uMouseForce;
  uniform float uSize;
  uniform float uViewScale;
  uniform float uOpacity;
  uniform vec3 uFrontTop;
  uniform vec3 uFrontBottom;
  uniform vec3 uBackTop;
  uniform vec3 uBackBottom;

  varying vec3 vColor;
  varying float vAlpha;

  const float PI = 3.14159265;

  mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  // Вес формы для конкретной точки: окно перехода у каждой своё
  float stagger(float w, float r) {
    float start = r * 0.45;
    return smoothstep(start, start + 0.55, w);
  }

  // Дуга перехода: точка взлетает в середине пути и садится на место
  vec3 flight(float w, vec4 r, float t) {
    float arc = sin(PI * w);
    return arc * vec3(
      sin(r.y * 12.0 + t * 0.9),
      cos(r.z * 11.0 + t * 0.7),
      sin(r.w * 9.0 + t * 0.8)
    ) * 0.55;
  }

  void main() {
    float t = uTime;

    // Сфера: медленное вращение, дыхание и закрутка
    float swirl = uSwirl * (position.y * 2.0 + 1.0);
    mat3 sphereRot = rotY(t * 0.12 + swirl) * rotX(0.3);
    vec3 unit = sphereRot * position;
    float breathe = 1.0 + 0.035 * sin(t * 1.4 + aRand.y * 6.2832) + uPulse * (0.25 + 0.2 * aRand.z);
    vec3 p = unit * uSphereScale * breathe + uSphereOffset;

    // Фирменные фигуры: общий поворот и смещение
    mat3 shapeRot = rotY(uSpin) * rotX(sin(t * 0.3) * 0.08);
    vec3 hex = shapeRot * aHex * uShapeScale + uShapeOffset;
    vec3 star = shapeRot * aStar * uShapeScale + uShapeOffset;
    vec3 circle = shapeRot * aCircle * uShapeScale + uShapeOffset;

    float wHex = stagger(uHex, aRand.x);
    float wStar = stagger(uStar, aRand.x);
    float wCircle = stagger(uCircle, aRand.x);
    float wBurst = stagger(uBurst, aRand.x);
    float wGrid = stagger(uGrid, aRand.x);
    float wOrbit = stagger(uOrbit, aRand.x);

    p = mix(p, hex, wHex) + flight(wHex, aRand, t);
    p = mix(p, star, wStar) + flight(wStar, aRand, t);
    p = mix(p, circle, wCircle) + flight(wCircle, aRand, t);

    // Туманность вокруг медиа-плоскостей
    vec3 burst = aBurst + vec3(sin(t * 0.2 + aRand.y * 6.0), cos(t * 0.17 + aRand.z * 6.0), 0.0) * 0.12;
    p = mix(p, burst, wBurst) + flight(wBurst, aRand, t) * 1.5;

    // Орбита полного цикла: кольцо вокруг ядра
    vec3 orbit = rotX(1.15) * rotY(t * 0.18 + aRand.w * 0.02) * aOrbit;
    orbit = orbit * uSphereScale + uSphereOffset;
    p = mix(p, orbit, wOrbit) + flight(wOrbit, aRand, t);

    // Сетка за каталогом услуг: мягкая волна
    vec3 grid = aGrid;
    grid.z += sin(grid.x * 1.3 + t * 0.8) * cos(grid.y * 1.1 + t * 0.6) * 0.18;
    p = mix(p, grid, wGrid) + flight(wGrid, aRand, t);

    // Курсор отталкивает точки
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec2 toMouse = world.xy - uMouse.xy;
    float dist = length(toMouse);
    float push = (1.0 - smoothstep(0.0, 0.75, dist)) * uMouseForce;
    world.xy += normalize(toMouse + 1e-4) * push * 0.28;
    world.z += push * 0.35;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;

    // Появление: точка вырастает в своё окно
    float appear = smoothstep(aRand.x * 0.7, aRand.x * 0.7 + 0.3, uIntro);
    float size = uSize * (0.55 + aRand.z * 0.75) * appear;
    gl_PointSize = size * uViewScale / -mv.z;

    // Цвет — по положению точки на сфере, как у сферы главной
    float h = clamp(unit.y * 0.5 + 0.5, 0.0, 1.0);
    float front = clamp(unit.z * 0.5 + 0.5, 0.0, 1.0);
    vec3 frontCol = mix(uFrontBottom, uFrontTop, h);
    vec3 backCol = mix(uBackBottom, uBackTop, h);
    vColor = mix(backCol, frontCol, front);
    vAlpha = uOpacity * appear * (0.45 + 0.55 * front);
  }
`;

export const particlesFragment = /* glsl */ `
  uniform float uFlash;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.28, d);

    if (a < 0.01) discard;

    vec3 col = mix(vColor, vec3(1.0), uFlash * 0.7);
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;
