<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CYCLE_STAGES } from '@l-ai-production/configs';
import { useCreationScene, type SceneLayout } from '@l-ai-production/composables/useCreationScene';
import { buildStoryTimeline } from '@l-ai-production/composables/useStoryTimeline';
import { BREAKPOINTS } from '~/shared/constants';

const { t } = useI18n();

useSeoMeta({
  title: t('aiProduction.seoTitle'),
  description: t('aiProduction.hero.text').replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—'),
});

const formHandler = useFormHandler();
const { setPendingCameraReady } = useAppLoader();

const pageRef = ref<HTMLElement>();
const canvasRef = ref<HTMLCanvasElement>();
const isDark = ref(false);
const isSceneActive = ref(true);

const scene = useCreationScene();
let killTimeline: (() => void) | null = null;
let layout: SceneLayout = 'desktop';
let lastWidth = 0;
let resizeTimer: ReturnType<typeof setTimeout> | undefined;

const getLayout = (): SceneLayout => {
  const w = window.innerWidth;
  if (w >= BREAKPOINTS.DESKTOP) return 'desktop';
  return w >= BREAKPOINTS.TABLET ? 'tablet' : 'mobile';
};

const setDark = (dark: boolean) => {
  isDark.value = dark;
  document.body.classList.toggle('ai-dark', dark);
};

const setActive = (active: boolean) => {
  isSceneActive.value = active;
  scene.setActive(active);
};

const build = () => {
  if (!pageRef.value) return;

  killTimeline?.();
  killTimeline = buildStoryTimeline({
    page: pageRef.value,
    state: scene.state,
    layout,
    onDark: setDark,
    onActive: setActive,
  });
  ScrollTrigger.refresh();
};

const playIntro = () => {
  gsap.to(scene.state, { intro: 1, duration: 2.6, ease: 'power2.out' });
  gsap.fromTo('[data-chapter="hero"] .ai-reveal', { autoAlpha: 0, y: 60 }, {
    autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.5,
  });
};

const onResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    scene.resize();

    // На телефонах высота прыгает от адресной строки — пересобираем только по ширине
    if (Math.abs(window.innerWidth - lastWidth) < 40) return;
    lastWidth = window.innerWidth;

    const next = getLayout();
    if (next !== layout && canvasRef.value) {
      // Другой брейкпоинт — другая плотность частиц и набор плоскостей
      layout = next;
      const { intro } = scene.state;
      scene.dispose();
      scene.init(canvasRef.value, layout);
      scene.state.intro = intro;
    }
    build();
  }, 250);
};

onMounted(async () => {
  await nextTick();
  document.querySelector<HTMLElement>('.header')?.style.removeProperty('--header-blur');

  if (!canvasRef.value) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  layout = getLayout();
  lastWidth = window.innerWidth;

  scene.init(canvasRef.value, layout, reducedMotion);
  build();
  window.addEventListener('resize', onResize);

  setPendingCameraReady(playIntro);
});

onBeforeUnmount(() => {
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', onResize);
  killTimeline?.();
  gsap.killTweensOf(scene.state);
  scene.dispose();
  document.body.classList.remove('ai-dark');
});
</script>

<template>
  <div
    ref="pageRef"
    class="ai-page"
    :class="{ 'ai-page_dark': isDark }"
  >
    <div class="ai-page__bg" />
    <canvas
      ref="canvasRef"
      class="ai-page__canvas"
      :class="{ 'ai-page__canvas_hidden': !isSceneActive }"
      aria-hidden="true"
    />

    <!-- 1. Hero -->
    <section class="ai-chapter ai-chapter_hero" data-chapter="hero">
      <div class="ai-chapter__sticky container">
        <div class="ai-hero">
          <p class="ai-hero__eyebrow ai-reveal" v-html="t('aiProduction.hero.eyebrow')" />
          <h1 class="ai-hero__title ai-reveal" v-html="t('aiProduction.hero.title')" />
          <p class="ai-hero__text ai-reveal" v-html="t('aiProduction.hero.text')" />
          <div class="ai-hero__actions ai-reveal">
            <atoms-button @click="formHandler.handlerFormOpen(true)">
              {{ t('aiProduction.hero.button') }}
            </atoms-button>
          </div>
        </div>
        <div class="ai-hero__scroll ai-reveal">
          <span class="ai-hero__scroll-line" />
          <span v-html="t('aiProduction.hero.scroll')" />
        </div>
      </div>
    </section>

    <!-- 2. Идея -->
    <section class="ai-chapter ai-chapter_spark" data-chapter="spark">
      <div class="ai-chapter__sticky container">
        <ai-molecules-chapter-text chapter="spark" />
      </div>
    </section>

    <!-- 3. Форма -->
    <section class="ai-chapter ai-chapter_figures" data-chapter="figures">
      <div class="ai-chapter__sticky container">
        <ai-molecules-chapter-text chapter="figures">
          <ol class="ai-steps ai-reveal">
            <li
              v-for="(step, i) in ['hex', 'star', 'circle']"
              :key="step"
              class="ai-steps__item"
            >
              <span class="ai-steps__num">0{{ i + 1 }}</span>
              <span v-html="t(`aiProduction.figures.steps.${step}`)" />
            </li>
          </ol>
        </ai-molecules-chapter-text>
      </div>
    </section>

    <!-- 4. Изображение -->
    <section class="ai-chapter ai-chapter_images" data-chapter="images">
      <div class="ai-chapter__sticky container">
        <div class="ai-chapter__scrim" />
        <ai-molecules-chapter-text chapter="images" />
      </div>
    </section>

    <!-- 5. Движение -->
    <section class="ai-chapter ai-chapter_video" data-chapter="video">
      <div class="ai-chapter__sticky container">
        <ai-molecules-chapter-text chapter="video" reveal-class="ai-reveal_first" />
        <div class="ai-video-big">
          <p class="ai-video-big__title ai-reveal_big" v-html="t('aiProduction.video.big')" />
          <p class="ai-video-big__text ai-reveal_big" v-html="t('aiProduction.video.bigText')" />
        </div>
      </div>
    </section>

    <!-- 6. Полный цикл -->
    <section class="ai-chapter ai-chapter_cycle" data-chapter="cycle">
      <div class="ai-chapter__sticky container">
        <div class="ai-chapter__scrim" />
        <div class="ai-cycle">
          <ai-molecules-chapter-text chapter="cycle" />
          <div class="ai-cycle__list ai-reveal">
            <span class="ai-cycle__track"><span class="ai-cycle__progress" /></span>
            <div
              v-for="(stage, i) in CYCLE_STAGES"
              :key="stage"
              class="ai-cycle__stage"
            >
              <span class="ai-cycle__num">0{{ i + 1 }}</span>
              <div>
                <p class="ai-cycle__title" v-html="t(`aiProduction.cycle.stages.${stage}.title`)" />
                <p class="ai-cycle__text" v-html="t(`aiProduction.cycle.stages.${stage}.text`)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Под ключ -->
    <ai-sections-services data-chapter="services" />

    <!-- 8. Цифры -->
    <ai-sections-numbers data-chapter="numbers" />

    <!-- 9. Финал -->
    <section class="ai-chapter ai-chapter_finale" data-chapter="finale">
      <div class="ai-chapter__sticky container">
        <div class="ai-finale">
          <h2 class="ai-finale__title ai-reveal" v-html="t('aiProduction.finale.title')" />
          <p class="ai-finale__text ai-reveal" v-html="t('aiProduction.finale.text')" />
          <div class="ai-reveal">
            <atoms-button @click="formHandler.handlerFormOpen(true)">
              {{ t('aiProduction.finale.button') }}
            </atoms-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
@use "assets/styles/adaptive" as a;
@use "assets/styles/typography" as t;

// Шапка над тёмными главами: светлое стекло, иначе тёмный текст шапки не читается
body.ai-dark .header::before {
  background: rgb(244 247 255 / 86%);
}

.ai-page {
  position: relative;

  color: var(--dark-blue);

  isolation: isolate;

  &__bg {
    position: fixed;
    z-index: -2;
    inset: 0;

    background-color: #F4F7FF;
  }

  &__canvas {
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;

    width: 100%;
    height: 100vh;

    transition: opacity 0.4s ease;
    pointer-events: none;

    &_hidden {
      opacity: 0;
    }
  }
}

.ai-chapter {
  position: relative;

  &__sticky {
    position: sticky;
    top: 0;

    display: flex;
    align-items: center;
    height: 100vh;
    overflow: hidden;

    @include a.tablet {
      align-items: flex-end;
      padding-bottom: 72px;
    }

    @include a.mobile {
      padding-bottom: 48px;
    }
  }

  &_hero { height: 220vh; }
  &_spark { height: 200vh; }
  &_figures { height: 400vh; }
  &_images { height: 300vh; }
  &_video { height: 420vh; }
  &_cycle { height: 520vh; }
  &_finale { height: 200vh; }

  &_finale &__sticky {
    justify-content: center;

    @include a.tablet {
      align-items: flex-end;
    }
  }

  &_video .ai-chapter-text {
    color: var(--white);
  }

  // Подложка под текст глав, где за ним летают плоскости и туманность.
  // Отдельный элемент, а не ::before: таймлайн гасит её вместе с текстом
  &__scrim {
    --scrim: 244 247 255;

    position: absolute;
    inset: 0;

    background: linear-gradient(90deg, rgb(var(--scrim) / 88%) 0%, rgb(var(--scrim) / 60%) 32%, rgb(var(--scrim) / 0%) 52%);
    pointer-events: none;

    @include a.tablet {
      background: linear-gradient(0deg, rgb(var(--scrim) / 92%) 0%, rgb(var(--scrim) / 70%) 38%, rgb(var(--scrim) / 0%) 62%);
    }

    + .ai-chapter-text,
    + .ai-cycle {
      position: relative;
    }
  }

  &_cycle &__scrim {
    --scrim: 5 12 46;
  }
}

.ai-reveal,
.ai-reveal_first,
.ai-reveal_big {
  will-change: transform, opacity;
}

// ---- Hero ----
.ai-hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 640px;

  @include a.tablet {
    max-width: 560px;
  }

  &__eyebrow {
    @include t.button-m-semi;

    width: fit-content;
    padding: 8px 16px;

    color: var(--blue);

    background: rgb(255 255 255 / 60%);
    border: 1px solid rgb(11 64 255 / 15%);
    border-radius: 100px;
    backdrop-filter: blur(12px);
  }

  &__title {
    @include t.generate-involve(76px, 500, 1.02em, 0.01em);

    @include a.tablet {
      @include t.generate-involve(48px, 500, 1.05em);
    }

    @include a.mobile {
      @include t.generate-involve(36px, 500, 1.1em);
    }
  }

  &__text {
    @include t.lead-m-medium;

    max-width: 520px;

    @include a.mobile {
      @include t.body-m-regular;
    }
  }

  &__actions {
    margin-top: 8px;
  }

  &__scroll {
    @include t.caption-m-medium;

    position: absolute;
    bottom: 32px;
    left: 60px;

    display: flex;
    gap: 12px;
    align-items: center;

    opacity: 0.6;

    @include a.tablet {
      display: none;
    }
  }

  &__scroll-line {
    position: relative;

    width: 1px;
    height: 40px;
    overflow: hidden;

    background: rgb(12 29 79 / 15%);

    &::after {
      content: "";

      position: absolute;
      inset: 0;

      background: var(--blue);

      animation: ai-scroll-line 2s ease-in-out infinite;
    }
  }
}

@keyframes ai-scroll-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

// ---- Шаги фигур ----
.ai-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  padding: 0;

  @include a.tablet {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
  }

  &__item {
    --active: 0;

    @include t.h6;

    display: flex;
    gap: 16px;
    align-items: baseline;

    opacity: calc(0.3 + var(--active) * 0.7);
    transform: translateX(calc(var(--active) * 12px));

    @include a.tablet {
      @include t.body-s-semi;

      padding: 6px 12px;

      background: rgb(255 255 255 / calc(0.4 + var(--active) * 0.5));
      border-radius: 100px;
      transform: none;
    }
  }

  &__num {
    @include t.caption-m-medium;

    color: var(--blue);
  }
}

// ---- Видео-момент ----
.ai-video-big {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;
  padding: 0 60px;

  color: var(--white);
  text-align: center;

  pointer-events: none;

  @include a.mobile {
    padding: 0 20px;
  }

  &__title {
    @include t.generate-involve(96px, 500, 1em, -0.01em);

    max-width: 1100px;

    text-shadow: 0 4px 40px rgb(5 12 46 / 35%);

    @include a.tablet {
      @include t.generate-involve(56px, 500, 1.05em);
    }

    @include a.mobile {
      @include t.generate-involve(38px, 500, 1.08em);
    }
  }

  &__text {
    @include t.lead-m-medium;

    max-width: 640px;

    @include a.mobile {
      @include t.body-m-regular;
    }
  }
}

// ---- Полный цикл ----
.ai-cycle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;

  color: var(--white);

  @include a.tablet {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  &__list {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-left: 28px;

    // Справа на десктопе — орбита сферы, список ложится поверх неё
    @include a.desktop-only {
      max-width: 400px;
      margin-left: auto;
      padding: 28px 28px 28px 52px;

      background: rgb(5 12 46 / 45%);
      border: 1px solid rgb(255 255 255 / 10%);
      border-radius: 24px;
      backdrop-filter: blur(16px);
    }

    @include a.mobile {
      gap: 8px;
    }
  }

  &__track {
    position: absolute;
    top: 34px;
    bottom: 34px;
    left: 8px;

    width: 2px;

    background: rgb(255 255 255 / 12%);

    @include a.desktop-only {
      left: 32px;
    }
  }

  &__progress {
    position: absolute;
    inset: 0;

    background: linear-gradient(180deg, #3CF6E1 0%, #4b72ff 100%);
    transform-origin: top;
  }

  &__stage {
    --active: 0;

    display: flex;
    gap: 16px;
    align-items: baseline;

    opacity: calc(0.3 + var(--active) * 0.7);
  }

  &__num {
    @include t.caption-m-medium;

    color: #3CF6E1;
  }

  &__title {
    @include t.h6;

    @include a.mobile {
      @include t.body-m-medium;
    }
  }

  &__text {
    @include t.body-s-regular;

    max-height: calc(var(--active) * 3em);
    overflow: hidden;

    opacity: calc(var(--active) * 0.75);

    @include a.mobile {
      display: none;
    }
  }
}

// ---- Финал ----
.ai-finale {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  max-width: 860px;

  text-align: center;

  @include a.desktop-only {
    // Сфера в центре — текст под ней
    margin-top: 46vh;
  }

  &__title {
    @include t.generate-involve(56px, 500, 1.05em);

    @include a.tablet {
      @include t.generate-involve(40px, 500, 1.1em);
    }

    @include a.mobile {
      @include t.generate-involve(30px, 500, 1.12em);
    }
  }

  &__text {
    @include t.lead-s-medium;

    @include a.mobile {
      @include t.body-m-regular;
    }
  }
}
</style>
