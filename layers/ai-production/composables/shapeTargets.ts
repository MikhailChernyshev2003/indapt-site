import { RING_SHAPES } from '@l-services/configs';
import type { RingShape } from '@l-services/types';

/** Детерминированный ГСЧ: формы одинаковы при каждой сборке сцены */
export function createRandom(seed = 1) {
  let s = seed >>> 0;

  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Раскладывает count точек по кольцам фирменной фигуры (контуры из
 * ring-shapes — те же, что рисует ring-pattern на страницах услуг).
 * Точек на кольцо — по длине контура. Кольца разнесены по глубине,
 * поэтому при повороте фигура читается объёмной. Радиус внешнего кольца — 1
 */
export function sampleRingShape(shape: RingShape, count: number, rand: () => number) {
  const data = RING_SHAPES[shape];
  const out = new Float32Array(count * 3);
  const svgNS = 'http://www.w3.org/2000/svg';
  const paths = data.rings.map((ring) => {
    const el = document.createElementNS(svgNS, 'path');
    el.setAttribute('d', ring.path);
    return { el, ring, length: el.getTotalLength() };
  });

  // Центр и размер — по габариту внешнего кольца
  const outer = paths[0]!;
  const bb = sampleBounds(outer.el, outer.length);
  const cx = outer.ring.x + (bb.minX + bb.maxX) / 2;
  const cy = outer.ring.y + (bb.minY + bb.maxY) / 2;
  const radius = Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY) / 2;

  const total = paths.reduce((sum, p) => sum + p.length, 0);
  let index = 0;

  paths.forEach((p, ringIndex) => {
    const isLast = ringIndex === paths.length - 1;
    const share = isLast ? count - index : Math.round((p.length / total) * count);
    const depth = (ringIndex / Math.max(paths.length - 1, 1) - 0.5) * 0.5;

    for (let i = 0; i < share && index < count; i++, index++) {
      const pt = p.el.getPointAtLength(((i + rand() * 0.6) / share) * p.length);
      const jitter = 0.012;
      out[index * 3] = (p.ring.x + pt.x - cx) / radius + (rand() - 0.5) * jitter;
      out[index * 3 + 1] = -(p.ring.y + pt.y - cy) / radius + (rand() - 0.5) * jitter;
      out[index * 3 + 2] = depth + (rand() - 0.5) * 0.05;
    }
  });

  return out;
}

function sampleBounds(el: SVGPathElement, length: number) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i <= 64; i++) {
    const p = el.getPointAtLength((i / 64) * length);
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  return { minX, minY, maxX, maxY };
}

/** Точки на единичной сфере (золотая спираль — без сгустков) */
export function sampleSphere(count: number, rand: () => number) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const shell = 1 + (rand() - 0.5) * 0.04;
    out[i * 3] = Math.cos(theta) * r * shell;
    out[i * 3 + 1] = y * shell;
    out[i * 3 + 2] = Math.sin(theta) * r * shell;
  }

  return out;
}

/** Туманность: оболочка вокруг сцены, вытянутая в глубину */
export function sampleBurst(count: number, rand: () => number, spread: number) {
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = (1.6 + Math.pow(rand(), 0.7) * 4.5) * spread;
    out[i * 3] = Math.cos(a) * r * 1.4;
    out[i * 3 + 1] = Math.sin(a) * r * 0.75;
    out[i * 3 + 2] = -6 + rand() * 8.5;
  }

  return out;
}

/** Ровная сетка за каталогом услуг */
export function sampleGrid(count: number, rand: () => number, width: number, height: number) {
  const out = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * (width / height)));
  const rows = Math.ceil(count / cols);

  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    out[i * 3] = (c / (cols - 1) - 0.5) * width + (rand() - 0.5) * 0.01;
    out[i * 3 + 1] = (r / Math.max(rows - 1, 1) - 0.5) * height;
    out[i * 3 + 2] = -1.5;
  }

  return out;
}

/** Ядро и кольцо орбиты для сцены «Полный цикл» (до поворота шейдером) */
export function sampleOrbit(count: number, rand: () => number) {
  const out = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    if (i % 3 === 0) {
      // Ядро: маленькая сфера
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u) * 0.55;
      out[i * 3] = Math.cos(a) * s;
      out[i * 3 + 1] = u * 0.55;
      out[i * 3 + 2] = Math.sin(a) * s;
    }
    else {
      // Кольцо: несколько дорожек, как у колец паттерна
      const lane = Math.floor(rand() * 4);
      const r = 1.45 + lane * 0.28 + (rand() - 0.5) * 0.06;
      const a = rand() * Math.PI * 2;
      out[i * 3] = Math.cos(a) * r;
      out[i * 3 + 1] = (rand() - 0.5) * 0.04;
      out[i * 3 + 2] = Math.sin(a) * r;
    }
  }

  return out;
}
