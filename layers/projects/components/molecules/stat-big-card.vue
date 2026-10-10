<script setup lang="ts">
import { gsap } from 'gsap';

const {
  columnHeight = 380,
  mobileColumnHeight,
  barHeight = 311,
  trackOpacity = 0.3,
  fadeTo = 0,
} = defineProps<{
  /** Описание показателя */
  text: string;
  /** Предлог перед значением */
  preposition?: string;
  /** Значение, например «95%» */
  value: string;
  /** Цвет колонки-градусника */
  color: string;
  /** Высота колонки и её нижнего насыщенного сегмента по макету, px */
  columnHeight?: number;
  /** Высота колонки на мобильном, если в макете она другая */
  mobileColumnHeight?: number;
  barHeight?: number;
  /** Прозрачность бледной подложки колонки сверху и снизу */
  trackOpacity?: number;
  fadeTo?: number;
}>();

const toRem = (px: number) => `${px / 16}rem`;

const barRef = useTemplateRef<HTMLElement>('barRef');

let tween: gsap.core.Tween | null = null;

// Насыщенный сегмент вырастает со дна бледной колонки
useGsap(() => {
  const bar = barRef.value;

  if (!bar) return;

  tween = gsap.from(bar, {
    scaleY: 0,
    transformOrigin: 'bottom',
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: bar,
      start: 'top 95%',
    },
  });
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});

const hexAlpha = (alpha: number) =>
  Math.round(alpha * 255).toString(16).padStart(2, '0');
</script>

<template>
  <!-- Крупная карточка результата: текст, большая цифра
       и колонка-градусник: бледная подложка и насыщенный сегмент снизу -->
  <article
    class="stat-big-card"
    :style="{
      '--stat-column-height': toRem(columnHeight),
      '--stat-column-height-mobile': toRem(mobileColumnHeight ?? columnHeight),
    }"
  >
    <div class="stat-big-card__lead">
      <p class="stat-big-card__text" v-html="text" />
      <projects-molecules-stat-value
        class="stat-big-card__value"
        :preposition="preposition"
        :value="value"
      />
    </div>
    <div class="stat-big-card__column-wrap">
      <slot name="decor" />
      <div
        class="stat-big-card__column"
        :style="{
          background: `linear-gradient(180deg, ${color}${hexAlpha(trackOpacity)} 0%, ${color}${hexAlpha(fadeTo)} 100%)`,
        }"
      >
        <div
          ref="barRef"
          class="stat-big-card__bar"
          :style="{
            height: toRem(barHeight),
            background: `linear-gradient(180deg, ${color} 0%, ${color}00 100%), ${color}1a`,
          }"
        />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;

.stat-big-card {
  position: relative;

  display: flex;
  gap: 24px;
  align-items: stretch;
  justify-content: space-between;
  padding: 40px;
  overflow: hidden;

  background-color: var(--white);
  border-radius: 16px;

  @include a.mobile {
    // На мобильном всё в столбик: текст, колонка на всю ширину, значение

    flex-direction: column;
    padding: 24px;
  }
}

.stat-big-card__lead {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
  min-width: 0;

  @include a.mobile {
    display: contents;
  }
}

.stat-big-card__text {
  color: var(--dark-blue);

  @include t.lead-m-medium;

  @include a.mobile {
    @include t.lead-s-medium;
  }
}

.stat-big-card__value {
  @include a.mobile {
    order: 2;
  }
}

.stat-big-card__column-wrap {
  position: relative;

  display: flex;
  flex: none;
  align-items: flex-end;

  @include a.mobile {
    order: 1;
  }
}

.stat-big-card__column {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 216px;
  height: var(--stat-column-height);
  overflow: hidden;

  border-radius: 8px;

  @include a.mobile {
    width: 100%;
    height: var(--stat-column-height-mobile);
  }
}

.stat-big-card__bar {
  flex: none;

  border-radius: 8px;
}
</style>
