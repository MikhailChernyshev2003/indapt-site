<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDebounceFn } from '@vueuse/core';
import {
  adaptiveAnim,
  cleanupMainPageAnimations,
  desktopAnim,
  getTimeline,
  lockAutoScroll,
} from '~/animation/page-main';

definePageMeta({
  layout: 'animation',
});

const RESIZE_DEBOUNCE_MS = 250;
const RESIZE_WIDTH_THRESHOLD_PX = 80;
const RESIZE_HEIGHT_THRESHOLD_PX = 80;
// Чуть дольше scrub (1с), чтобы onStart-колбэки при восстановлении не скроллили страницу
const RESTORE_AUTO_SCROLL_LOCK_MS = 1500;

const heroBackground = ref();
const digitalServicesRef = ref();
const ourProjectsRef = ref();
const isCameraReady = ref(false);
const lastViewportWidth = ref(0);
const lastViewportHeight = ref(0);
const { setPendingCameraReady } = useAppLoader();

const isDesktopViewport = (): boolean => window.innerWidth >= 1024;
const isCoarsePointer = (): boolean => window.matchMedia('(pointer: coarse)').matches;

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
    resetStyles: true,
  });

  window.dispatchEvent(new Event('resize'));

  nextTick(() => {
    lockAutoScroll(RESTORE_AUTO_SCROLL_LOCK_MS);
    startAnimations(true);
    ScrollTrigger.refresh();
    window.scrollTo(0, scrollY);
    // Сразу ставим таймлайн в позицию скролла, без секундной перемотки scrub
    ScrollTrigger.update();
    getTimeline()?.scrollTrigger?.getTween()?.progress(1);
  });
};

// Кнопка «наверх» в конце главной: экран плавно уходит в белый, под ним страница
// сбрасывается и запускается заново с первого экрана — с интро и появлением сферы
// Переход мягкий: страница не просто закрывается белым, а постепенно расплывается
// и растворяется в нём (белая подложка и размытие под ней нарастают вместе),
// а первый экран так же проступает из размытия
const DIP_IN_S = 1.6;
const DIP_HOLD_S = 0.4;
const DIP_OUT_S = 1.8;
const DIP_BLUR = '24px';

const dipRef = ref<HTMLElement | null>(null);
let isRestarting = false;

const restartFromTop = (): void => {
  const hero = heroBackground.value;
  if (isRestarting || !isCameraReady.value || !hero?.cameraRef || !hero?.sphereRef) return;
  isRestarting = true;

  gsap.set(dipRef.value, { autoAlpha: 1, '--dip-alpha': 0, '--dip-blur': '0px' });
  gsap.to(dipRef.value, {
    '--dip-alpha': 1,
    '--dip-blur': DIP_BLUR,
    duration: DIP_IN_S,
    ease: 'sine.inOut',
    onComplete: () => {
      cleanupMainPageAnimations({
        camera: hero.cameraRef,
        sphere: hero.sphereRef,
        resetStyles: true,
      });
      hero.hideParticles();
      // Камера в конце страницы развёрнута и сдвинута, а интро задаёт ей только y и z
      gsap.set(hero.cameraRef.position, { x: 0 });
      gsap.set(hero.cameraRef.rotation, { x: 0, y: 0, z: 0 });
      // Как при первой загрузке: обёртка с кнопкой «наверх» проявится вместе со сборкой таймлайна
      gsap.set('.main__scroll-top', { clearProps: 'opacity' });
      document.body.classList.remove('after-init');
      window.scrollTo({ top: 0, behavior: 'instant' });

      nextTick(() => {
        ScrollTrigger.refresh();
        startAnimations(false);

        gsap.to(dipRef.value, {
          '--dip-alpha': 0,
          '--dip-blur': '0px',
          duration: DIP_OUT_S,
          delay: DIP_HOLD_S,
          ease: 'sine.out',
          onComplete: () => {
            gsap.set(dipRef.value, { autoAlpha: 0 });
            isRestarting = false;
          },
        });
      });
    },
  });
};

const debouncedResize = useDebounceFn(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (!lastViewportWidth.value) {
    lastViewportWidth.value = width;
    lastViewportHeight.value = height;
    return;
  }

  const isWidthChanged = Math.abs(width - lastViewportWidth.value) >= RESIZE_WIDTH_THRESHOLD_PX;
  // Сфера и vh-смещения считаются от размеров окна при сборке таймлайна:
  // на десктопе после смены одной высоты сфера уезжала за край. На тач-устройствах
  // высоту не учитываем — её постоянно меняет адресная строка браузера
  const isHeightChanged = !isCoarsePointer()
    && Math.abs(height - lastViewportHeight.value) >= RESIZE_HEIGHT_THRESHOLD_PX;

  if (!isWidthChanged && !isHeightChanged) return;

  lastViewportWidth.value = width;
  lastViewportHeight.value = height;
  reinitAnimations();
}, RESIZE_DEBOUNCE_MS);

// В скрытой вкладке requestAnimationFrame стоит: твины интро замирают на первом
// кадре (пустой экран), а setTimeout сборки таймлайна продолжает идти, и шаги
// расходятся. Поэтому интро запускаем, только когда страница видна
let pendingVisibleStart: (() => void) | null = null;

const clearPendingVisibleStart = (): void => {
  if (!pendingVisibleStart) return;
  document.removeEventListener('visibilitychange', pendingVisibleStart);
  pendingVisibleStart = null;
};

const startAnimationsWhenVisible = (): void => {
  clearPendingVisibleStart();

  if (!document.hidden) {
    startAnimations(false);
    return;
  }

  pendingVisibleStart = () => {
    if (document.hidden) return;
    clearPendingVisibleStart();
    startAnimations(false);
  };
  document.addEventListener('visibilitychange', pendingVisibleStart);
};

const handleCameraReady = (): void => {
  isCameraReady.value = true;
  setPendingCameraReady(startAnimationsWhenVisible);
};

onMounted(async () => {
  await nextTick();
  window.scroll(0, 0);
  lastViewportWidth.value = window.innerWidth;
  lastViewportHeight.value = window.innerHeight;
  window.addEventListener('resize', debouncedResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize);
  clearPendingVisibleStart();

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
      :action="restartFromTop"
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

    <!-- В body: внутри страницы слой не перекрывал бы футер (у .__main свой контекст наложения) -->
    <client-only>
      <teleport to="body">
        <div
          ref="dipRef"
          class="main__dip"
          aria-hidden="true"
        />
      </teleport>
    </client-only>
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

  // Белый экран перехода кнопки «наверх» — поверх шапки и всей страницы

  &__dip {
    position: fixed;
    inset: 0;
    z-index: 1000;

    visibility: hidden;
    opacity: 0;

    background: rgb(255 255 255 / var(--dip-alpha, 1));
    backdrop-filter: blur(var(--dip-blur, 0px));
  }
}
</style>
