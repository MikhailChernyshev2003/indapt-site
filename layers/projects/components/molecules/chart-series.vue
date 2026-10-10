<script setup lang="ts">
import { gsap } from 'gsap';

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Tween | null = null;

useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  tween = gsap.from(root.querySelectorAll('.chart-series__bar'), {
    scaleY: 0,
    transformOrigin: 'bottom',
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.04,
    scrollTrigger: {
      trigger: root,
      start: 'top 85%',
    },
  });
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});

const { primary, secondary, mobileCount } = defineProps<{
  /** Высоты столбцов основного и наложенного ряда по макету, px */
  primary: number[];
  secondary: number[];
  /** Цвет основного ряда */
  color: string;
  /** Сколько столбцов остаётся на мобильном (в макете часть скрыта) */
  mobileCount?: number;
}>();

const isHiddenOnMobile = (idx: number) => mobileCount !== undefined && idx >= mobileCount;

const toRem = (px: number) => `${px / 16}rem`;
</script>

<template>
  <!-- Два наложенных ряда столбцов из макета: цветной и белый поверх,
       оба растут от общего дна -->
  <div ref="rootRef" class="chart-series">
    <div class="chart-series__row">
      <span
        v-for="(h, idx) in primary"
        :key="idx"
        class="chart-series__bar"
        :class="{ 'chart-series__bar_extra': isHiddenOnMobile(idx) }"
        :style="{
          height: toRem(h),
          background: `linear-gradient(180deg, ${color}cc 0%, ${color}14 100%)`,
        }"
      />
    </div>
    <div class="chart-series__row">
      <span
        v-for="(h, idx) in secondary"
        :key="idx"
        class="chart-series__bar chart-series__bar_light"
        :class="{ 'chart-series__bar_extra': isHiddenOnMobile(idx) }"
        :style="{ height: toRem(h) }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;

.chart-series {
  position: relative;

  height: 163px;
}

.chart-series__row {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chart-series__bar {
  flex: 1;

  border-radius: 8px;

  &_light {
    background: linear-gradient(180deg, var(--white-80) 0%, rgb(255 255 255 / 8%) 100%);
  }

  &_extra {
    @include a.mobile {
      display: none;
    }
  }
}
</style>
