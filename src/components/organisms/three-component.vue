<script setup lang="ts">
import {
  SRGBColorSpace,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
} from 'three';
import { useElementBounding } from '@vueuse/core';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import type { IThreeContext, TTickCallback } from '~/types/three';

// Define props
const {
  alpha = false,
  cameraPosition = [0, 0, 1],
  customAnimation = false,
} = defineProps<{
  alpha?: boolean;
  cameraPosition?: [number, number, number];
  clearColor?: string;
  customAnimation?: boolean;
}>();

const stats = import.meta.dev ? new Stats() : null;

const threeCanvas = ref<HTMLCanvasElement>();
const threeContainer = ref<HTMLDivElement>();

const { width, height } = useElementBounding(threeContainer);

const aspect = computed(() => width.value / height.value);

let threeCtx: IThreeContext | null = null;

const emit = defineEmits<{
  'scene-ready': [context: IThreeContext];
}>();

const handleResize = async () => {
  if (!threeCtx || !threeCanvas.value || !threeContainer.value) return;

  const { camera, renderer } = threeCtx;
  camera.aspect = aspect.value;
  camera.updateProjectionMatrix();
  renderer.setSize(width.value, height.value);
  // Тот же предел, что при инициализации: иначе после любого ресайза
  // экраны с DPR 1 начинали рендерить канвас в 4 раза больше пикселей
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

const tickCallback = ref<TTickCallback | null>(null);
const clock = new Clock();

const onTick = (callback: TTickCallback) => {
  tickCallback.value = callback;
};

const animate = () => {
  if (!threeCtx) return;

  const { scene, camera, renderer } = threeCtx;

  if (stats) stats.begin();

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  if (customAnimation && tickCallback.value) {
    tickCallback.value(elapsedTime, delta);
  }

  renderer.render(scene, camera);

  if (stats) stats.end();
  requestAnimationFrame(animate);
};

const initThree = async () => {
  if (!import.meta.client || !threeContainer.value || !threeCanvas.value)
    return;

  // Initialize stats if in dev mode
  if (stats?.dom) {
    stats.dom.style.position = 'fixed';
    stats.dom.style.left = '0px';
    stats.dom.style.top = '0px';
    stats.dom.style.zIndex = '100';
    document.body.appendChild(stats.dom);
  }

  // Initialize renderer
  const renderer = new WebGLRenderer({
    canvas: threeCanvas.value,
    alpha,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width.value, height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.outputColorSpace = SRGBColorSpace;

  // Create scene
  const scene = new Scene();

  // Create camera based on props
  const camera = new PerspectiveCamera(35, aspect.value, 0.1, 1000);
  const [x, y, z] = cameraPosition;
  scene.add(camera);
  camera.position.set(x, y, z);

  threeCtx = { scene, camera, renderer };

  emit('scene-ready', threeCtx);
  animate();
};

onMounted(() => {
  initThree();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  if (!threeCtx) return;
  window.removeEventListener('resize', handleResize);

  const { renderer } = threeCtx;
  renderer.dispose();
  threeCtx = null;

  if (stats?.dom && stats.dom.parentElement) {
    stats.dom.parentElement.removeChild(stats.dom);
  }
});

defineExpose({
  aspect,
  threeContainer,
  width: width,
  height: height,
  onTick,
});
</script>

<template>
  <div ref="threeContainer" class="three-container">
    <canvas ref="threeCanvas" />
  </div>
</template>

<style lang="scss">
.three-container {
  position: fixed;
  inset: 0;
}
</style>
