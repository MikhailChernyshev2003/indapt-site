<script setup lang="ts">
import { gsap } from 'gsap';

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Timeline | null = null;

useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  const line = root.querySelector<SVGPathElement>('.chart-columns__line path');
  const length = line?.getTotalLength() ?? 0;

  tween = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top 85%',
    },
  })
    .from(root.querySelectorAll('.chart-columns__bar'), {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.06,
    });

  if (line && length) {
    tween.fromTo(line, { strokeDasharray: length, strokeDashoffset: length }, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power1.inOut',
    }, '-=0.4');
  }
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});

const { heights, solidFrom = 3 } = defineProps<{
  /** Высоты столбцов по макету, px */
  heights: number[];
  /** С какого столбца добавляется плотная подложка (как в макете) */
  solidFrom?: number;
  /** Цвет столбцов */
  color: string;
  /** Цвет восходящей линии */
  lineColor: string;
}>();

const toRem = (px: number) => `${px / 16}rem`;
</script>

<template>
  <!-- Ряд растущих столбцов с восходящей линией поверх -->
  <div ref="rootRef" class="chart-columns">
    <div class="chart-columns__row">
      <span
        v-for="(h, idx) in heights"
        :key="idx"
        class="chart-columns__bar"
        :style="{
          height: toRem(h),
          background: idx >= solidFrom
            ? `linear-gradient(${color}1a, ${color}1a), linear-gradient(180deg, ${color} 0%, ${color}1a 100%)`
            : `linear-gradient(180deg, ${color} 0%, ${color}1a 100%)`,
        }"
      />
    </div>
    <svg
      class="chart-columns__line"
      viewBox="0 0 580 200"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M148 130L538 -12"
        :stroke="lineColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.chart-columns {
  position: relative;
}

.chart-columns__row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 200px;
}

.chart-columns__bar {
  flex: 1;

  border-radius: 8px;
}

.chart-columns__line {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
}
</style>
