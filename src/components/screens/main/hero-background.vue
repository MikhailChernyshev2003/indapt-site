<script setup lang="ts">
import { GridHelper, MathUtils } from 'three';
import type { IThreeContext } from '~/types';
import { useParticleSphere } from '~/composables/useParticleSphere';

const emit = defineEmits<{
  'scene-ready': [context: IThreeContext];
}>();

const threeComponent = ref();
const cameraRef = ref<any>(null);
const showGrid = ref(false); // Управление отображением сетки
const sphereRef = ref<any>(null);

let particleSphere: ReturnType<typeof useParticleSphere> | null = null;
let gridHelper: GridHelper | null = null;
let scene: any = null;

const cleanup = () => {
  if (particleSphere) {
    particleSphere.cleanup();
    particleSphere = null;
  }
};

const handleSceneReady = async ({
  scene: sceneRef,
  camera,
  renderer,
}: IThreeContext) => {
  if (!threeComponent.value) return;

  scene = sceneRef;

  // Initialize particle sphere
  particleSphere = useParticleSphere();
  await particleSphere.init({ scene, camera, renderer });

  // Условное создание сетки
  if (showGrid.value) {
    gridHelper = new GridHelper(140, 100);
    gridHelper.rotation.x = -Math.PI / 2;
    gridHelper.position.z = 0;
    scene.add(gridHelper);
  }
  cameraRef.value = camera;
  sphereRef.value = particleSphere;

  emit('scene-ready', scene);

  // Set up animation through the three component
  const animate = (t, dt) => {
    if (particleSphere) {
      particleSphere.animate(t, dt, camera);
    }
  };

  if (threeComponent.value?.onTick) {
    threeComponent.value.onTick(animate);
  }
};

onBeforeUnmount(() => {
  cleanup();
});

// Handle HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(cleanup);
}

/**
 * Calculate the distance to fit the sphere.
 * @param radius sphere radius
 * @returns distance
 */
const getDistanceToFitSphere = (radius: number): number => {
  const vFOV = cameraRef.value.getEffectiveFOV() * MathUtils.DEG2RAD;
  const hFOV = Math.atan(Math.tan(vFOV * 0.5) * cameraRef.value.aspect) * 2;
  const fov = 1 < cameraRef.value.aspect ? vFOV : hFOV;
  return radius / (Math.sin(fov * 0.5));
};

// Функции управления сеткой
const showGridHelper = (): void => {
  if (!gridHelper && scene) {
    gridHelper = new GridHelper(140, 100);
    gridHelper.rotation.x = -Math.PI / 2;
    gridHelper.position.z = 0;
    scene.add(gridHelper);
  }
  showGrid.value = true;
};

// Expose API for GSAP integration
defineExpose({
  cameraRef: cameraRef,
  sphereRef: sphereRef,
  particleSphere: computed(() => particleSphere),
  threeComponent,
  getDistanceToFitSphere,
  playInitAnimation: (duration: number) => particleSphere?.playInitAnimation(duration),
  setVisibleParticles: (count: number) => particleSphere?.setVisibleParticles(count),
  showGrid: showGridHelper,
  get sphereOpacity() {
    return particleSphere?.sphereOpacity ?? 1;
  },
  set sphereOpacity(value: number) {
    if (particleSphere) {
      particleSphere.sphereOpacity = value;
    }
  },
  get sphereScale() {
    return particleSphere?.sphereScale ?? 1;
  },
  set sphereScale(value: number) {
    if (particleSphere) {
      particleSphere.sphereScale = value;
    }
  },
  get sphere8Progress() {
    return particleSphere?.sphere8Progress ?? 1;
  },
  set sphere8Progress(value: number) {
    if (particleSphere) {
      particleSphere.sphere8Progress = Math.min(Math.max(value, 0), 1);
    }
  },
});
</script>

<template>
  <div class="hero-background">
    <client-only>
      <organisms-three-component
        ref="threeComponent"
        :alpha="true"
        :camera-position="[0, 0, 5]"
        custom-animation
        @scene-ready="handleSceneReady"
      />
    </client-only>
  </div>
</template>

<style lang="scss">
.hero-background {
  position: fixed;
  inset: 0;
}
</style>
