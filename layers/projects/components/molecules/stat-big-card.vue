<script setup lang="ts">
import { gsap } from 'gsap';

const {
  columnHeight = 380,
  barHeight = 311,
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
  /** Высота колонки и её верхнего сегмента по макету, px */
  columnHeight?: number;
  barHeight?: number;
  /** Прозрачность нижнего края градиента колонки */
  fadeTo?: number;
}>();

const toRem = (px: number) => `${px / 16}rem`;

const columnRef = useTemplateRef<HTMLElement>('columnRef');

let tween: gsap.core.Tween | null = null;

useGsap(() => {
  const column = columnRef.value;

  if (!column) return;

  tween = gsap.from(column, {
    scaleY: 0,
    transformOrigin: 'bottom',
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: column,
      start: 'top 88%',
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
       и колонка-градусник акцентного цвета -->
  <article class="stat-big-card">
    <div class="stat-big-card__lead">
      <p class="stat-big-card__text" v-html="text" />
      <projects-molecules-stat-value :preposition="preposition" :value="value" />
    </div>
    <div class="stat-big-card__column-wrap">
      <slot name="decor" />
      <div
        ref="columnRef"
        class="stat-big-card__column"
        :style="{
          height: toRem(columnHeight),
          background: `linear-gradient(180deg, ${color} 0%, ${color}${hexAlpha(fadeTo)} 100%)`,
        }"
      >
        <div
          class="stat-big-card__bar"
          :style="{
            height: toRem(barHeight),
            background: `linear-gradient(180deg, ${color} 0%, ${color}00 100%)`,
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
    gap: 16px;
    padding: 20px;
  }
}

.stat-big-card__lead {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
}

.stat-big-card__text {
  max-width: 340px;

  color: var(--dark-blue);

  @include t.lead-s-medium;

  @include a.mobile {
    @include t.body-s-medium;
  }
}

.stat-big-card__column-wrap {
  position: relative;

  display: flex;
  flex: none;
  align-items: flex-end;
}

.stat-big-card__column {
  display: flex;
  flex-direction: column;
  width: 216px;

  border-radius: 8px;

  @include a.mobile {
    width: 96px;
  }
}

.stat-big-card__bar {
  border-radius: 8px;

  opacity: 0.9;
}
</style>
