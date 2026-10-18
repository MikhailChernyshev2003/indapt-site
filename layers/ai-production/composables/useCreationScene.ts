import type {
  Texture } from 'three';
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  VideoTexture,
  WebGLRenderer,
} from 'three';
import { MEDIA_SLOTS, SPHERE_COLORS } from '@l-ai-production/configs';
import { mediaFragment, mediaVertex } from '@l-ai-production/shaders/media';
import { particlesFragment, particlesVertex } from '@l-ai-production/shaders/particles';
import type { MediaKind, MediaPlacement, MediaSlot } from '@l-ai-production/types';
import {
  createRandom,
  sampleBurst,
  sampleGrid,
  sampleOrbit,
  sampleRingShape,
  sampleSphere,
} from './shapeTargets';

/**
 * Всё, что ведёт таймлайн скролла. Сцена каждый кадр читает эти числа
 * и переводит их в униформы и положения плоскостей, поэтому таймлайн
 * ничего не знает о three.js и пересобирается при ресайзе без потерь
 */
export interface SceneState {
  intro: number;
  opacity: number;
  hex: number;
  star: number;
  circle: number;
  burst: number;
  grid: number;
  orbit: number;
  swirl: number;
  pulse: number;
  flash: number;
  sphereScale: number;
  sphereX: number;
  sphereY: number;
  shapeScale: number;
  shapeX: number;
  shapeY: number;
  spin: number;
  camX: number;
  camY: number;
  camZ: number;
  /** 0..1 — плоскости по очереди вылетают из сферы */
  emerge: number;
  /** Скорость процедурных роликов: 0 — почти стоп-кадр */
  alive: number;
  /** 0..1 — главная плоскость заполняет экран */
  cover: number;
  /** 0..1 — плоскости возвращаются в сферу */
  retract: number;
  /** Сила отталкивания курсором */
  mouse: number;
}

export const createSceneState = (): SceneState => ({
  intro: 0,
  opacity: 1,
  hex: 0,
  star: 0,
  circle: 0,
  burst: 0,
  grid: 0,
  orbit: 0,
  swirl: 0,
  pulse: 0,
  flash: 0,
  sphereScale: 1,
  sphereX: 0,
  sphereY: 0,
  shapeScale: 1.3,
  shapeX: 0,
  shapeY: 0,
  spin: 0,
  camX: 0,
  camY: 0,
  camZ: 6,
  emerge: 0,
  alive: 0,
  cover: 0,
  retract: 0,
  mouse: 1,
});

export type SceneLayout = 'desktop' | 'tablet' | 'mobile';

const MODE: Record<MediaKind, number> = {
  fluid: 0,
  rings: 1,
  orb: 2,
  waves: 3,
  dots: 4,
  image: 5,
  video: 5,
};

const FOV = 35;
const COVER_DISTANCE = 2;

/** Цвет из hex без перевода в линейное пространство: шейдер пишет его как есть */
const hexToVec3 = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface MediaItem {
  slot: MediaSlot;
  place: MediaPlacement;
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  video?: HTMLVideoElement;
}

export function useCreationScene() {
  // Обычный объект, не reactive: его каждый кадр читает рендер и крутит GSAP
  const state = createSceneState();

  let renderer: WebGLRenderer | null = null;
  let scene: Scene | null = null;
  let camera: PerspectiveCamera | null = null;
  let points: Points<BufferGeometry, ShaderMaterial> | null = null;
  let media: MediaItem[] = [];
  let frame = 0;
  let active = true;
  let layout: SceneLayout = 'desktop';
  let time = 0;
  let last = 0;
  let timeScale = 1;
  const textures: Texture[] = [];

  const pointer = new Vector2(10, 10);
  const mouseWorld = new Vector3(100, 100, 0);
  const smoothMouse = new Vector3(100, 100, 0);
  const raycaster = new Raycaster();
  const hit = new Vector3();
  let hasPointer = false;

  const particleCount = (l: SceneLayout) => ({ desktop: 9000, tablet: 6000, mobile: 4200 }[l]);

  const buildParticles = () => {
    if (!scene) return;

    const count = particleCount(layout);
    const rand = createRandom(7);
    const geometry = new BufferGeometry();

    geometry.setAttribute('position', new BufferAttribute(sampleSphere(count, rand), 3));
    geometry.setAttribute('aHex', new BufferAttribute(shuffle(sampleRingShape('hexagon', count, rand), rand), 3));
    geometry.setAttribute('aStar', new BufferAttribute(shuffle(sampleRingShape('star', count, rand), rand), 3));
    geometry.setAttribute('aCircle', new BufferAttribute(shuffle(sampleRingShape('circle', count, rand), rand), 3));
    geometry.setAttribute('aBurst', new BufferAttribute(sampleBurst(count, rand, layout === 'mobile' ? 0.55 : 1), 3));
    geometry.setAttribute('aGrid', new BufferAttribute(gridTargets(count), 3));
    geometry.setAttribute('aOrbit', new BufferAttribute(sampleOrbit(count, rand), 3));

    const r = new Float32Array(count * 4);
    for (let i = 0; i < r.length; i++) r[i] = rand();
    geometry.setAttribute('aRand', new BufferAttribute(r, 4));

    const material = new ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uHex: { value: 0 },
        uStar: { value: 0 },
        uCircle: { value: 0 },
        uBurst: { value: 0 },
        uGrid: { value: 0 },
        uOrbit: { value: 0 },
        uSwirl: { value: 0 },
        uPulse: { value: 0 },
        uFlash: { value: 0 },
        uSphereScale: { value: 1 },
        uSphereOffset: { value: new Vector3() },
        uShapeOffset: { value: new Vector3() },
        uShapeScale: { value: 1.3 },
        uSpin: { value: 0 },
        uMouse: { value: new Vector3(100, 100, 0) },
        uMouseForce: { value: 0 },
        uSize: { value: layout === 'mobile' ? 0.022 : 0.028 },
        uViewScale: { value: 1 },
        uOpacity: { value: 1 },
        uFrontTop: { value: hexToVec3(SPHERE_COLORS.frontTop) },
        uFrontBottom: { value: hexToVec3(SPHERE_COLORS.frontBottom) },
        uBackTop: { value: hexToVec3(SPHERE_COLORS.backTop) },
        uBackBottom: { value: hexToVec3(SPHERE_COLORS.backBottom) },
      },
    });

    points = new Points(geometry, material);
    points.frustumCulled = false;
    points.renderOrder = 2;
    scene.add(points);
  };

  /** Сетка во весь экран на глубине -1.5 с запасом по краям */
  const gridTargets = (count: number) => {
    const dist = state.camZ + 1.5;
    const h = 2 * dist * Math.tan((FOV * Math.PI) / 360) * 1.1;
    const aspect = camera ? camera.aspect : 16 / 9;
    return sampleGrid(count, createRandom(3), h * aspect, h);
  };

  const buildMedia = () => {
    if (!scene) return;

    const loader = new TextureLoader();
    const blank = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    blank.needsUpdate = true;
    textures.push(blank);

    MEDIA_SLOTS.forEach((slot, index) => {
      const place = layout === 'desktop' ? slot.desktop : slot.mobile ?? (layout === 'tablet' ? slot.desktop : null);

      if (!place) return;

      const material = new ShaderMaterial({
        vertexShader: mediaVertex,
        fragmentShader: mediaFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uMode: { value: MODE[slot.kind] },
          uPalette: { value: slot.palette ?? 0 },
          uTex: { value: blank },
          uTexAspect: { value: 1 },
          uAspect: { value: slot.aspect },
          uTime: { value: 0 },
          uAlive: { value: 0 },
          uReveal: { value: 0 },
          uOpacity: { value: 1 },
          uRadius: { value: 0.06 },
          uSeed: { value: index * 0.37 + 0.11 },
          uShift: { value: 0 },
          uDim: { value: 0 },
        },
      });

      const mesh = new Mesh(new PlaneGeometry(1, 1), material);
      mesh.visible = false;
      mesh.renderOrder = 1;
      scene!.add(mesh);

      const item: MediaItem = { slot, place, mesh };

      if (slot.kind === 'image' && slot.src) {
        loader.load(slot.src, (tex) => {
          tex.colorSpace = SRGBColorSpace;
          material.uniforms.uTex!.value = tex;
          material.uniforms.uTexAspect!.value = tex.image.width / tex.image.height;
          textures.push(tex);
        });
      }

      if (slot.kind === 'video' && slot.src) {
        const video = document.createElement('video');
        Object.assign(video, { src: slot.src, muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous' });
        const tex = new VideoTexture(video);
        tex.colorSpace = SRGBColorSpace;
        material.uniforms.uTex!.value = tex;
        video.addEventListener('loadedmetadata', () => {
          material.uniforms.uTexAspect!.value = video.videoWidth / video.videoHeight;
        });
        textures.push(tex);
        item.video = video;
      }

      media.push(item);
    });
  };

  const updateMedia = (t: number) => {
    if (!camera) return;

    const n = media.length;
    const tanHalf = Math.tan((FOV * Math.PI) / 360);
    const coverH = 2 * COVER_DISTANCE * tanHalf * 1.04;
    const coverW = coverH * camera.aspect;

    media.forEach((item, i) => {
      const { mesh, place, slot } = item;
      const u = mesh.material.uniforms;
      const start = (i / n) * 0.62;
      const e = clamp01((state.emerge - start) / 0.3);
      const reveal = clamp01((state.emerge - start - 0.06) / 0.26);
      const back = state.retract;
      const visible = e > 0.001 && back < 0.999;

      mesh.visible = visible;

      if (item.video) {
        if (visible && item.video.paused) item.video.play().catch(() => {});
        else if (!visible && !item.video.paused) item.video.pause();
      }

      if (!visible) return;

      const k = easeOut(e);
      const h = place.w / slot.aspect;
      const float = Math.sin(t * 0.6 + i * 1.7) * 0.05;

      // Из центра сферы — по дуге на орбиту
      let x = lerp(state.sphereX, place.x, k);
      let y = lerp(state.sphereY, place.y, k) + float * k;
      let z = lerp(0, place.z, k) + Math.sin(Math.PI * k) * 0.8;
      let sx = lerp(0.04, place.w, k);
      let sy = lerp(0.04, h, k);
      let radius = 0.06;
      let opacity = 1;

      const cover = i === 0 ? easeInOut(state.cover) : 0;

      if (i === 0) {
        x = lerp(x, state.camX, cover);
        y = lerp(y, state.camY, cover);
        z = lerp(z, state.camZ - COVER_DISTANCE, cover);
        sx = lerp(sx, coverW, cover);
        sy = lerp(sy, coverH, cover);
        radius = lerp(0.06, 0, cover);
      }
      else {
        // Камера пролетает сквозь рой: остальные расходятся и уходят за спину
        const c = easeInOut(state.cover);
        x += (x - state.camX) * c * 1.2;
        y += (y - state.camY) * c * 1.2;
        z += c * 5;
        opacity = 1 - c;
      }

      // Возврат в сферу
      const b = easeInOut(back);
      x = lerp(x, state.sphereX, b);
      y = lerp(y, state.sphereY, b);
      z = lerp(z, 0, b);
      sx *= 1 - b * 0.97;
      sy *= 1 - b * 0.97;

      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, 1);
      // Лёгкий доворот к курсору (пока мыши не было — плоскости смотрят прямо)
      const tilt = hasPointer ? 0.05 * (1 - cover) : 0;
      mesh.rotation.y = Math.max(-0.25, Math.min(0.25, (smoothMouse.x - x) * tilt));
      mesh.rotation.x = Math.max(-0.25, Math.min(0.25, -(smoothMouse.y - y) * tilt));

      u.uAspect!.value = sx / sy;
      u.uRadius!.value = radius * (sy > 0 ? 1 : 0);
      u.uReveal!.value = reveal;
      u.uAlive!.value = state.alive;
      u.uOpacity!.value = opacity * (1 - b * b);
      // Полноэкранный кадр приглушаем под крупный текст
      u.uDim!.value = cover * 0.38;
      u.uTime!.value = t;
      u.uShift!.value = Math.sin(t * 0.8 + i) * (1 - state.alive * 0.5);
    });
  };

  const updatePointer = () => {
    if (!camera || !hasPointer) return;

    raycaster.setFromCamera(pointer, camera);
    // Плоскость z = 0: на ней живёт сфера
    const { origin, direction } = raycaster.ray;
    const d = -origin.z / direction.z;
    hit.copy(origin).addScaledVector(direction, d);
    mouseWorld.copy(hit);
  };

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);

    if (!active || !renderer || !scene || !camera || !points) return;

    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    time += dt * timeScale;

    camera.position.set(state.camX, state.camY, state.camZ);

    updatePointer();
    smoothMouse.lerp(mouseWorld, 0.08);

    const u = points.material.uniforms;
    u.uTime!.value = time;
    u.uIntro!.value = state.intro;
    u.uHex!.value = state.hex;
    u.uStar!.value = state.star;
    u.uCircle!.value = state.circle;
    u.uBurst!.value = state.burst;
    u.uGrid!.value = state.grid;
    u.uOrbit!.value = state.orbit;
    u.uSwirl!.value = state.swirl;
    u.uPulse!.value = state.pulse;
    u.uFlash!.value = state.flash;
    u.uSphereScale!.value = state.sphereScale;
    u.uSphereOffset!.value.set(state.sphereX, state.sphereY, 0);
    u.uShapeOffset!.value.set(state.shapeX, state.shapeY, 0);
    u.uShapeScale!.value = state.shapeScale;
    u.uSpin!.value = state.spin + Math.sin(time * 0.25) * 0.25;
    u.uMouse!.value.copy(smoothMouse);
    u.uMouseForce!.value = hasPointer ? state.mouse : 0;
    u.uOpacity!.value = state.opacity;

    updateMedia(time);

    renderer.render(scene, camera);
  };

  const resize = () => {
    if (!renderer || !camera) return;

    const canvas = renderer.domElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, layout === 'desktop' ? 1.75 : 2);

    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    if (points) {
      points.material.uniforms.uViewScale!.value = (h * dpr) / (2 * Math.tan((FOV * Math.PI) / 360));
      points.geometry.setAttribute('aGrid', new BufferAttribute(gridTargets(particleCount(layout)), 3));
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    hasPointer = true;
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };

  const onVisibility = () => {
    last = performance.now();
  };

  const init = (canvas: HTMLCanvasElement, nextLayout: SceneLayout, reducedMotion = false) => {
    layout = nextLayout;
    timeScale = reducedMotion ? 0.25 : 1;

    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;

    scene = new Scene();
    camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, state.camZ);

    buildParticles();
    buildMedia();
    resize();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const setActive = (value: boolean) => {
    active = value;
    if (value) last = performance.now();
  };

  const dispose = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);

    points?.geometry.dispose();
    points?.material.dispose();
    media.forEach(({ mesh, video }) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      video?.pause();
    });
    textures.forEach(t => t.dispose());
    renderer?.dispose();

    media = [];
    points = null;
    scene = null;
    camera = null;
    renderer = null;
  };

  return { state, init, resize, setActive, dispose };
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Перемешивает точки фигуры: соседние по контуру точки получают разные
 * индексы, иначе «стекание» со сферы шло бы полосами
 */
function shuffle(arr: Float32Array, rand: () => number) {
  const n = arr.length / 3;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    for (let k = 0; k < 3; k++) {
      const tmp = arr[i * 3 + k]!;
      arr[i * 3 + k] = arr[j * 3 + k]!;
      arr[j * 3 + k] = tmp;
    }
  }
  return arr;
}
