<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDebounceFn } from '@vueuse/core';
import {
  adaptiveAnim,
  cleanupMainPageAnimations,
  desktopAnim,
  getTimeline,
} from '~/animation/page-main';

definePageMeta({
  layout: 'animation',
});

const RESIZE_DEBOUNCE_MS = 250;
const RESIZE_WIDTH_THRESHOLD_PX = 80;

const heroBackground = ref();
const digitalServicesRef = ref();
const ourProjectsRef = ref();
const isCameraReady = ref(false);
const lastViewportWidth = ref(0);
const { setPendingCameraReady } = useAppLoader();

const isDesktopViewport = (): boolean => window.innerWidth >= 1024;

const startAnimations = (skipIntro = false): void => {
  const hero = heroBackground.value;
  if (!hero?.cameraRef || !hero?.sphereRef) return;

  if (isDesktopViewport()) {
    desktopAnim(hero, hero.cameraRef, hero.sphereRef, { skipIntro });
    return;
  }

  adaptiveAnim(
    hero,
    null,
    digitalServicesRef.value,
    ourProjectsRef.value,
    hero.cameraRef,
    hero.sphereRef,
    { skipIntro },
  );
};

const reinitAnimations = (): void => {
  const hero = heroBackground.value;
  if (!isCameraReady.value || !hero?.cameraRef || !hero?.sphereRef) return;

  const scrollY = window.scrollY;

  cleanupMainPageAnimations({
    camera: hero.cameraRef,
    sphere: hero.sphereRef,
  });

  window.dispatchEvent(new Event('resize'));

  nextTick(() => {
    startAnimations(true);
    ScrollTrigger.refresh();
    window.scrollTo(0, scrollY);
  });
};

const debouncedResize = useDebounceFn(() => {
  const width = window.innerWidth;

  if (!lastViewportWidth.value) {
    lastViewportWidth.value = width;
    return;
  }

  if (Math.abs(width - lastViewportWidth.value) < RESIZE_WIDTH_THRESHOLD_PX) return;

  lastViewportWidth.value = width;
  reinitAnimations();
}, RESIZE_DEBOUNCE_MS);

const handleCameraReady = (): void => {
  isCameraReady.value = true;
  setPendingCameraReady(() => startAnimations(false));
};

onMounted(async () => {
  await nextTick();
  window.scroll(0, 0);
  lastViewportWidth.value = window.innerWidth;
  window.addEventListener('resize', debouncedResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize);

  const hero = heroBackground.value;
  cleanupMainPageAnimations({
    camera: hero?.cameraRef,
    sphere: hero?.sphereRef,
  });
});

onBeforeRouteLeave(() => {
  getTimeline()?.kill();
});
</script>

<template>
  <div class="main">
    <!-- Three.js Background -->
    <screens-main-hero-background
      ref="heroBackground"
      class="main__background"
      @scene-ready="handleCameraReady"
    />
    <wrappers-scroll-to-top
      class="main__scroll-top"
      target-selector=".digital-info__title"
      :target-top="1600"
    >
      <!-- Main content -->
      <div class="main__wrapper">
        <screens-main-digital-conductor class="main__conductor" />
        <screens-main-digital-info class="main__info" />
        <screens-main-development-experts class="main__development-experts" />
        <screens-main-digital-services ref="digitalServicesRef" class="main__services" />
        <screens-main-our-projects ref="ourProjectsRef" class="main__projects" />
        <screens-main-our-partners class="main__partners" />
        <screens-main-vacancies class="main__vacancies" />

        <molecules-decor-shape class="development-experts__shape development-experts__shape_move" />
      </div>
    </wrappers-scroll-to-top>
  </div>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;

:deep(canvas) {
  position: relative; // Ensure canvas creates its own stacking context
  z-index: 0; // Put canvas behind while keeping interactions

  pointer-events: all;
}

.main {
  &__wrapper {
    position: relative;
    z-index: 1;

    width: 100%;
    height: 100vh;
    overflow: hidden;

    opacity: 0;
  }

  &__conductor,
  &__info,
  &__development-experts,
  &__services {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__projects, &__partners, &__vacancies {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  &__projects {
    z-index: 5;
  }

  &__partners {
    z-index: 6;
  }

  &__vacancies {
    z-index: 7;
  }

  &__conductor {
    z-index: 1;
  }

  &__info {
    z-index: 2;
  }

  &__development-experts {
    z-index: 3;

    @include a.mobile {
      top: unset;
      bottom: 40px;
    }
  }

  &__services {
    z-index: 4;
  }

  &__scroll-top {
    opacity: 0;
  }
}
</style>
