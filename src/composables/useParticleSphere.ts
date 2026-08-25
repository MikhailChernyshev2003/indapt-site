import {

  Color,
  Mesh,
  InstancedMesh,
  CircleGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  PlaneGeometry,
  Raycaster,

  Vector2,
  Vector3,
  Object3D,
} from 'three';
import type { Camera, ShaderMaterial,
  BufferGeometry } from 'three';
import { useMouse, useWindowScroll } from '@vueuse/core';
import { gsap } from 'gsap';
import type { ParticleData, UseParticleSphereOptions } from '~/types';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

class Particle {
  pos: Vector3;
  displacement: Vector3;
  transform: Vector3;
  scale: Vector3;
  colored: boolean;
  rotationAxis: Vector3;

  constructor() {
    this.pos = (new Vector3()).randomDirection();
    this.displacement = new Vector3(0, 0, 0);
    this.transform = new Vector3(0, 0, 0);
    this.scale = new Vector3(0, 0, 0);
    this.colored = false;
    this.rotationAxis = (new Vector3()).randomDirection();
  }

  getPosAndTransform() {
    return this.pos.clone().add(this.transform);
  }

  getRealPos() {
    return this.getPosAndTransform().add(this.displacement);
  }

  update(dt: number) {
    this.pos.applyAxisAngle(this.rotationAxis, dt / 20);
  }
}

class Animation {
  readonly onUpdate: Function;
  private _progress: number;
  private _status: 'ready' | 'start' | 'complete' | null;
  private x: number | null;

  constructor(onUpdate) {
    this._progress = 0;
    this._status = null;
    this.onUpdate = onUpdate;
    this.x = null;
  }

  get isNotActive() {
    return this._progress <= 0 || this._progress >= 1;
  }

  set progress(val) {
    if (this._status === null) return;
    if (val >= 1) {
      if (this._status === 'complete') return;
      val = 1;
      this._status = 'complete';
    }
    if (val <= 0) {
      if (this._status === 'start') return;
      val = 0;
      this._status = 'start';
    }

    this._progress = val;
    this.onUpdate(val, this.x);
  }

  get progress() {
    return this._progress;
  }

  init(x) {
    this._status = 'ready';
    this.x = x;
  }
}

const dotsAmount = 500;

// Mouse interaction variables
const mouse = new Vector2();
const raycaster = new Raycaster();
let intersection = null;
let isMouseInside = false;

export const useParticleSphere = () => {
  const particles: Particle[] = [];
  const sphereCenter = new Vector3(0, 0, 0);
  const sphereIntersectionHelper = new Mesh(new SphereGeometry(1, 30, 30, 0), new MeshStandardMaterial());
  const planeIntersectionHelper = new Mesh(new PlaneGeometry(10, 10, 1, 1), new MeshStandardMaterial({ side: 2 }));
  const simplexNoise = new SimplexNoise();
  let animation;

  let mesh: InstancedMesh | null = null;
  let geometry: BufferGeometry | null = null;
  const material: ShaderMaterial | null = null;
  let mouseCleanup: (() => void) | null = null;
  let sphere8Progress = 0;

  function getPositions(count: number): Array<Vector3> {
    const positions = [];
    const phi = Math.PI * (Math.sqrt(5.0) - 1.0);
    for (let i = 0; i < count; i++) {
      const y = (1 - (i / (count - 1)) * 2);
      const radius = Math.sqrt(1 - y * y) + (Math.random() * 0.1 - 0.05);
      const theta = phi * i + (Math.random() * 0.1 - 0.05);

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      positions.push(new Vector3(x, y, z));
    }
    return positions;
  }

  // Initialize particles
  const initSphere = () => {
    function makeEaseInOut(timing) {
      return function (timeFraction) {
        if (timeFraction < 0.5)
          return timing(2 * timeFraction) / 2;
        else
          return (2 - timing(2 * (1 - timeFraction))) / 2;
      };
    }
    const circEaseInOut = makeEaseInOut(x => 1 - Math.sin(Math.acos(x)));
    for (let i = 0; i < dotsAmount; i++) {
      particles.push(new Particle());
    }
    animation = new Animation((progress, pos) => {
      const { x: sx, y: sy, z: sz } = pos.clone().multiplyScalar(circEaseInOut(progress));
      sphereIntersectionHelper.position.set(sx, sy, sz);

      particles.forEach((particle, idx) => {
        const index = (71 * idx) % dotsAmount;
        const startPos = particle.pos.clone();
        const endPos = particles[index].pos.clone();
        const way = endPos.sub(startPos);
        const { x, y, z } = particle.pos;

        // Все параметры ниже являются относительными, равняются доле от длительности полной анимации (см. файл page-main.js)

        const globalTranslateDelay = 0.2; // насколько пересыпание отстает от закручивания

        // разница между началом анимации верхних и нижних элементов (от этого параметра зависит длительность/скорость анимации)
        const translateDelay = 0.4; // пересыпание
        const rotationDelay = 0.4; // вращение

        // длительность анимации (рассчитана до конца полной анимации) (можно сделать её меньше, но не больше)
        const translateDuration = (1 - globalTranslateDelay) - translateDelay;
        const rotationDuration = 1 - rotationDelay;

        const noisePower = 0.1; // чем больше этот параметр, тем более хаотичная анимация
        const delta = (y + 1) / 2;

        const noise = (simplexNoise.noise3d(x, 12, z) + 1) / 2;

        const rotationAngle = Math.PI * 2; // угол поворота

        const currentTranslateDelay = globalTranslateDelay + translateDelay * (delta * (1 - noisePower) + noise * noisePower);
        const currentRotationDelay = rotationDelay * (delta * (1 - noisePower) + noise * noisePower);
        const localTranslateProgress = Math.min(Math.max((progress - currentTranslateDelay) / translateDuration, 0), 1);
        const localRotationProgress = Math.min(Math.max((progress - currentRotationDelay) / rotationDuration, 0), 1);

        const localCoords = way.multiplyScalar(circEaseInOut(localTranslateProgress));

        localCoords.add(startPos).applyAxisAngle(new Vector3(0, 1, 0), rotationAngle * circEaseInOut(localRotationProgress));
        localCoords.sub(startPos).add(pos.clone().multiplyScalar(circEaseInOut(localTranslateProgress)));
        particle.transform.set(localCoords.x, localCoords.y, localCoords.z);
      });
    });
  };

  const updateParticlesPos = (t, camera) => {
    if (!mesh) return;
    const helper = new Object3D();
    particles.forEach((particle, idx: number) => {
      const realPos = particle.getRealPos();
      helper.position.set(realPos.x, realPos.y, realPos.z);
      // helper.scale.set(scale.x, scale.y, scale.z)
      helper.scale.copy(particle.scale);
      if (camera?.position) helper.lookAt(camera?.position);
      helper.updateMatrix();
      mesh?.setMatrixAt(idx, helper.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  function getMixedVectors3(v1: Vector3, v2: Vector3, p: number) {
    const x = v2.x + (v1.x - v2.x) * p;
    const y = v2.y + (v1.y - v2.y) * p;
    const z = v2.z + (v1.z - v2.z) * p;
    return new Vector3(x, y, z);
  }

  // Update colors function
  const frontColorTop = new Color(0x0236eb);
  const frontColorBottom = new Color(0x07dbfc);
  const backColorTop = new Color(0x4096fa);
  const backColorBottom = new Color(0x43f2d5);

  const minMax = (val, min, max) => Math.min(max, Math.max(min, val));

  const updateColors = (camera) => {
    if (!mesh) return;
    let counter = 0;

    const distanceFromCameraToCenter = camera.position.clone().distanceTo(sphereIntersectionHelper.position);

    for (const i in particles) {
      const particle = particles[i];
      if (!particle.colored) continue;

      // Инициализируем цветовую схему один раз для частицы
      const position = particle.getRealPos().clone().sub(sphereIntersectionHelper.position);
      const { x, y, z } = position;
      const color = new Color();

      const distanceFromCamera = camera.position.clone().distanceTo(position);
      const topColor = new Color(), bottomColor = new Color();

      const zRange = { from: -0.1, to: 1 }; //        <-- тут можно
      const yRangeFront = { from: -0.1, to: -0.3 }; //   <-- регулировать
      const yRangeBack = { from: -0.8, to: 1 }; //    <-- границы градиентов
      const yRange = { from: yRangeBack.from + (yRangeFront.from - yRangeBack.from) * ((z + 1) / 2), to: yRangeBack.to + (yRangeFront.to - yRangeBack.to) * ((z + 1) / 2) };
      const qz = minMax((distanceFromCameraToCenter - distanceFromCamera) - zRange.from, 0, zRange.to - zRange.from) / (zRange.to - zRange.from);
      const qy = minMax((y - yRange.from), 0, yRange.to - yRange.from) / (yRange.to - yRange.from);

      topColor.lerpColors(backColorTop, frontColorTop, qz);
      bottomColor.lerpColors(backColorBottom, frontColorBottom, qz);
      color.lerpColors(bottomColor, topColor, qy);

      mesh.setColorAt(+i, color);
      counter++;
    }

    if (counter) mesh.instanceColor.needsUpdate = true;
  };

  // Function to calculate ray-sphere intersection mathematically
  const getRaySphereIntersection = (): Vector3 | null => {
    const intersection = raycaster.intersectObject(sphereIntersectionHelper);
    if (!intersection?.length) return null;
    return (new Vector3()).copy(intersection[0].point);
  };

  function getRayPlaneIntersectionThroughPoint(): Vector3 | null {
    const intersection = raycaster.intersectObject(planeIntersectionHelper);
    if (!intersection?.length) return null;
    return (new Vector3()).copy(intersection[0].point);
  }

  // Setup mouse tracking
  const setupMouseEvents = (canvas: HTMLCanvasElement, camera: Camera) => {
    // Using global mouse position
    const { x: mouseX, y: mouseY } = useMouse({ touch: false });
    const { y: scrollTop } = useWindowScroll();

    return watch([mouseX, mouseY], () => {
      if (!mesh) return;

      const rect = canvas.getBoundingClientRect();

      // Calculate position relative to canvas, accounting for scroll since canvas is fixed
      const canvasX = mouseX.value - rect.left;
      const canvasY = mouseY.value - rect.top - scrollTop.value; // Add scrollTop since canvas is fixed

      // Only process if mouse is within canvas bounds
      if (canvasX >= 0 && canvasX <= rect.width && canvasY >= 0 && canvasY <= rect.height) {
        // Calculate normalized coordinates (-1 to +1)
        mouse.x = (canvasX / rect.width) * 2 - 1;
        mouse.y = -(canvasY / rect.height) * 2 + 1;

        // Update raycaster
        raycaster.setFromCamera(mouse, camera);

        // Calculate intersection with sphere using current sphere position
        const sphereIntersection = getRaySphereIntersection();
        const planeIntersection = getRayPlaneIntersectionThroughPoint();
        intersection = sphereIntersection || planeIntersection;
        isMouseInside = !!sphereIntersection;
      }
      else {
      }
    }, { immediate: true });
  };

  const movePointByRay = (sourcePosition: Vector3, targetPosition: Vector3, distance: number): Vector3 => {
    // 1. Находим направление от центра к точке
    const direction = targetPosition.clone().sub(sourcePosition);

    // 2. Нормализуем направление (делаем единичным вектором)
    direction.normalize();

    // 3. Умножаем на новое расстояние
    direction.multiplyScalar(distance);

    return direction;
  };

  // Update visible particles

  // Set number of visible particles
  const setVisibleParticles = (start: number, count: number) => {
    for (let i = start; i < start + count; i++) {
      const index = (71 * i) % dotsAmount;
      const particle = particles[index];

      if (!particle.colored) {
        particle.colored = true;

        gsap.fromTo(
          particle.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 0.2, ease: 'back.out(1.7)' },
        );
      }
    }
  };

  let desktopMode = false;

  const initAnimation = (x: number, desktop: boolean) => {
    if (!animation) return;
    animation.init(x);
    desktopMode = desktop;
  };

  const updateDisplacement = () => {
    const displacementRadius = 0.5;
    particles.forEach((particle) => {
      const targetDisplacement = new Vector3(0, 0, 0);
      if (intersection) {
        const pos = particle.getPosAndTransform();
        const distance = pos.distanceTo(intersection);
        if (distance <= displacementRadius) {
          const delta = pos.clone().sub(intersection);
          if (!isMouseInside) delta.negate();
          const force = isMouseInside ? (1 - distance / displacementRadius) / 2 : Math.min(1, (1 - (distance / displacementRadius)) * 2);
          const finalDisplacement = delta.multiplyScalar(force);
          targetDisplacement.set(finalDisplacement.x, finalDisplacement.y, finalDisplacement.z);
        }
      }
      const currentDisplacement = targetDisplacement.clone().sub(particle.displacement).multiplyScalar(0.05);
      particle.displacement.add(currentDisplacement);
    });
  };

  // Animation function
  const animate = (t, dt, camera) => {
    if (dt > 1 / 30) dt = 1 / 30;
    if (!mesh) return;
    particles.forEach(particle => particle.update(dt));
    if (animation.progress >= 0.99) animation.onUpdate(1, animation.x);
    updateDisplacement();
    updateParticlesPos(t * 1000, camera);
    updateColors(camera);
  };

  // Initialize the particle sphere
  const init = async (options: UseParticleSphereOptions) => {
    const { scene, camera, renderer } = options;

    // Initialize particles
    initSphere();

    // Create geometry
    const geometry = new CircleGeometry(0.014, 6);
    const material = new MeshBasicMaterial({ color: 0xF4F7FF });

    mesh = new InstancedMesh(geometry, material, particles.length);

    updateParticlesPos(0, camera);
    updateColors(camera);

    scene.add(mesh);
    scene.add(sphereIntersectionHelper);
    scene.add(planeIntersectionHelper);

    sphereIntersectionHelper.visible = false;
    planeIntersectionHelper.visible = false;
    // Start with 0 particles visible for animation
    // visibleParticles = 0;
    // updateVisibleParticles();

    // Setup mouse events
    mouseCleanup = setupMouseEvents(renderer.domElement, camera);
  };

  // Cleanup function
  const cleanup = () => {
    if (mouseCleanup) {
      mouseCleanup();
      mouseCleanup = null;
    }
    // if (points && points.parent) {
    //   points.parent.remove(points);
    // }
    if (geometry) {
      geometry.dispose();
    }
    // points = null;
    geometry = null;
  };

  // Add opacity getter/setter for direct GSAP control
  const sphereOpacity = {
    get: () => material?.uniforms.u_opacity.value ?? 1,
    set: (value: number) => {
      if (material) {
        material.uniforms.u_opacity.value = value;
      }
    },
  };

  // Scale control
  const sphereScale = {
    get: () => mesh?.scale.x ?? 1,
    set: (value: number) => {
      // Размер частиц (с ресайзом)
      if (mesh) {
        mesh.scale.set(value, value, value);
      }
    },
  };

  // Play initial animation with wave-based particle appearance
  const playInitAnimation = (animationDuration: number) => {
    if (!mesh) {
      console.warn('Sphere not initialized');
      return;
    }

    // Create timeline for potential control
    const initTl = gsap.timeline();
    const targetCount = dotsAmount;
    let currentCount = 0;
    let waveNumber = 0;
    let animationActive = true;

    // Функция расчета размера волны
    const getWaveSize = (wave: number) => {
      if (wave === 0) return 1; // Первая частица (центральная)

      // Примерная последовательность: 1, 2, 4, 6, 9, 12, 15, 18, 20...
      const sizes = [1, 2, 4, 6, 9, 12, 15, 18, 20];

      if (wave < sizes.length) {
        return sizes[wave];
      }
      else {
        // Для больших волн - стабильно 20 частиц
        return 20;
      }
    };

    // Функция расчета задержки между волнами
    const getWaveDelay = (wave: number) => {
      const maxDelay = 0.15; // 300ms для первых волн
      const minDelay = 0.05; // 20ms для последних волн

      // Ускорение по кубической кривой
      const progress = Math.min(wave / 15, 1); // Нормализуем к 15 волнам
      return maxDelay * Math.pow(1 - progress, 3) + minDelay;
    };

    // Рекурсивная функция добавления волн
    const addNextWave = () => {
      if (!animationActive || currentCount >= targetCount) return;

      const waveSize = getWaveSize(waveNumber);
      const particlesToAdd = Math.min(waveSize, targetCount - currentCount);

      // Просто добавляем частицы без анимаций
      setVisibleParticles(currentCount, particlesToAdd);
      currentCount += particlesToAdd;

      waveNumber++;

      if (currentCount < targetCount) {
        const nextDelay = getWaveDelay(waveNumber); // Без дополнительных задержек
        gsap.delayedCall(nextDelay, addNextWave);
      }
    };

    // Добавляем возможность остановки анимации
    initTl.call(() => {
      animationActive = true;
      addNextWave();
    });

    // Добавляем метод для остановки
    const originalKill = initTl.kill.bind(initTl);
    initTl.kill = (() => {
      animationActive = false;
      gsap.killTweensOf(addNextWave);
      originalKill();
      return initTl;
    }) as any;

    return initTl;
  };

  return {
    init,
    animate,
    cleanup,
    setVisibleParticles,
    playInitAnimation,
    initAnimation,
    get animation() {
      return animation;
    },
    get sphereOpacity() {
      return sphereOpacity.get();
    },
    set sphereOpacity(value: number) {
      sphereOpacity.set(value);
    },
    get sphereScale() {
      return sphereScale.get();
    },
    set sphereScale(value: number) {
      sphereScale.set(value);
    },
    get sphere8Progress() {
      return sphere8Progress;
    },
    set sphere8Progress(value: number) {
      sphere8Progress = Math.min(Math.max(value, 0), 1);
    },
  };
};
