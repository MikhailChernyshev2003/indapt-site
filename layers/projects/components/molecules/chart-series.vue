<script setup lang="ts">
import { gsap } from 'gsap';

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Tween | null = null;

useGsap(() => {
  const root = rootRef.value;

  if (!root) return;

  tween = gsap.from(root.querySelectorAll('.chart-series__bar'), {
    scaleY: 0,
    transformOrigin: 'top',
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

const { primary, secondary } = defineProps<{
  /** Высоты столбцов основного и наложенного ряда по макету, px */
  primary: number[];
  secondary: number[];
  /** Цвет основного ряда */
  color: string;
}>();

const toRem = (px: number) => `${px / 16}rem`;
</script>

<template>
  <!-- Два наложенных ряда столбцов из макета: цветной и белый поверх -->
  <div ref="rootRef" class="chart-series">
    <div class="chart-series__row">
      <span
        v-for="(h, idx) in primary"
        :key="idx"
        class="chart-series__bar"
        :style="{
          height: toRem(h),
          background: `linear-gradient(180deg, ${color} 0%, ${color}1a 100%)`,
        }"
      />
    </div>
    <div class="chart-series__row chart-series__row_overlay">
      <span
        v-for="(h, idx) in secondary"
        :key="idx"
        class="chart-series__bar chart-series__bar_light"
        :style="{ height: toRem(h) }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-series {
  position: relative;

  height: 163px;
  overflow: hidden;
}

.chart-series__row {
  position: absolute;
  top: 49px;
  right: 0;
  left: 0;

  display: flex;
  gap: 10px;
  align-items: flex-start;

  &_overlay {
    top: 79px;
  }
}

.chart-series__bar {
  flex: 1;

  border-radius: 8px;

  &_light {
    background: linear-gradient(180deg, var(--white) 0%, var(--white-10) 100%);
  }
}
</style>
